import { useEffect, useState } from "react";
import { Form, Button, Toast, Col, Row } from '@douyinfe/semi-ui';
import { Link, useLocation } from "wouter";
import useSWR, { useSWRConfig } from 'swr'

export default function CategoryPage({ params }) {
  const { data, error, isLoading } = useSWR(`/api/categories/${params.slug}`);
  const [location, setLocation] = useLocation();
  const { mutate } = useSWRConfig()

  useEffect(() => {
    document.title = "分类修改";
  })

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>正在加载</div>;

  const handleSubmit = async (values) => {
    const access_token = sessionStorage.getItem("access_token");
    const r = await fetch(`/api/categories/${params.slug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify(values),
    })
    if (r.status != 200) {
      if (r.status == 400) {
        Toast.error({ content: '参数错误' })
      } else {
        mapFail(r.status);
      }
      return;
    }
    Toast.info({ content: '已更新' });
    mutate(`/api/categories/${params.slug}`);
    setLocation("/categories/");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col span={8}>
          <Form.Input field='name' label='名称' type="text" initValue={data.name} />
        </Col>
        <Col span={8} offset={1}>
          <Form.Input field='slug' label="Slug" type="text" initValue={data.slug} />
        </Col>
      </Row>
      <Row>
        <Form.TextArea field='description' label="描述" initValue={data.description} />
      </Row>
      <div className="w-full mt-2">
        <Button htmlType='submit' type="tertiary">修改</Button>
      </div>
    </Form>
  )
};