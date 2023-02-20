import { useEffect } from "react";
import { Form, Button, Toast, Col, Row } from '@douyinfe/semi-ui';
import { useLocation } from "wouter";
import useSWR, { useSWRConfig } from 'swr'

import { mapFail } from "../../common/utils";

export default function CategoryPage({ params }) {
  const { data, error, isLoading } = useSWR(`/api/categories/${params.slug}`);
  const [location, setLocation] = useLocation();
  const { mutate } = useSWRConfig()

  useEffect(() => {
    document.title = params.slug ? "分类修改" : "分类创建";
  })

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>正在加载</div>;

  const handleSubmit = async (values) => {
    const access_token = sessionStorage.getItem("access_token");
    let method = 'PATCH';
    let url = `/api/categories/${params.slug}`;
    if (!params.slug) {
      method = 'POST';
      url = `/api/categories/`;
    }

    const r = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify(values),
    })
    if (r.status != 200 && r.status != 201) {
      if (r.status == 400) {
        Toast.error({ content: '参数错误' })
      } else {
        mapFail(r.status);
      }
      return;
    }
    Toast.info({ content: params.slug ? "已修改" : "已创建" });
    mutate(url);
    setLocation("/categories/");
  }

  const handleDelete = async (e) => {
    const access_token = sessionStorage.getItem("access_token");
    const r = await fetch(`/api/categories/${params.slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      }
    })
    if (r.status != 200 && r.status != 201) {
      if (r.status == 400) {
        Toast.error({ content: '参数错误' })
      } else {
        mapFail(r.status);
      }
      return;
    }
    Toast.info({ content: "已删除" });
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
        <Button className="mr-2" htmlType='submit'>{params.slug ? "修改" : "创建"}</Button>
        <Button className={params.slug ? "" : "hidden"} htmlType='button' type="danger" onClick={handleDelete}>删除</Button>
      </div>
    </Form>
  )
};