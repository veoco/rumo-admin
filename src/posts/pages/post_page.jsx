import { useEffect } from "react";
import { Form, Button, Toast, Col, Row } from '@douyinfe/semi-ui';
import { useLocation } from "wouter";
import useSWR, { useSWRConfig } from 'swr'

import { mapFail } from "../../common/utils";
import PostCategories from "../components/post_categories";
import PostTags from "../components/post_tags";

export default function PostPage({ params }) {
  const { data, error, isLoading } = useSWR(`/api/posts/${params.slug}?private=true`);
  const [location, setLocation] = useLocation();
  const { mutate } = useSWRConfig()

  useEffect(() => {
    document.title = params.slug ? "文章修改" : "文章创建";
  })

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>正在加载</div>;

  const created = new Date(data.created ? data.created * 1000 : Date.now());
  const modified = new Date(data.modified ? data.modified * 1000 : Date.now());
  const { Option } = Form.Select;

  const categories = [];
  const tags = [];

  if (params.slug) {
    for (let cate of data.categories) {
      categories.push(cate.slug)
    }
    for (let tag of data.tags) {
      tags.push(tag.slug)
    }
  }

  const handleSubmit = async (values) => {
    const deletedCategories = categories.filter(v => !values.categories.includes(v));
    const addedCategories = values.categories.filter(v => !categories.includes(v));

    const deletedTags = tags.filter(v => !values.tags.includes(v));
    const addedTags = values.tags.filter(v => !tags.includes(v));

    const access_token = sessionStorage.getItem("access_token");
    let method = 'PATCH';
    let url = `/api/posts/${params.slug}`;
    if (!params.slug) {
      method = 'POST';
      url = `/api/posts/`;
    }
    values.created = Math.floor(values.created.getTime() / 1000);
    values.text = "<!--markdown-->"+values.text;

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

    for (let slug of deletedCategories) {
      await fetch(`/api/categories/${slug}/posts/${values.slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })
    }

    for (let slug of deletedTags) {
      await fetch(`/api/tags/${slug}/posts/${values.slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })
    }

    for (let slug of addedCategories) {
      await fetch(`/api/categories/${slug}/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({ slug: values.slug }),
      })
    }

    for (let slug of addedTags) {
      await fetch(`/api/tags/${slug}/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({ slug: values.slug }),
      })
    }

    Toast.info({ content: params.slug ? "已修改" : "已创建" });
    mutate(`/api/posts/${params.slug}?private=true`);
    setLocation("/posts/");
  }

  const handleDelete = async (e) => {
    const access_token = sessionStorage.getItem("access_token");

    for (let slug of categories) {
      await fetch(`/api/categories/${slug}/posts/${values.slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })
    }

    for (let slug of tags) {
      await fetch(`/api/tags/${slug}/posts/${values.slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })
    }

    const r = await fetch(`/api/posts/${params.slug}`, {
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
    setLocation("/posts/");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col span={11}>
          <Form.Input field='title' label="标题" type="text" initValue={data.title} />
        </Col>
        <Col span={11} offset={1}>
          <Form.Input field='slug' label="Slug" type="text" initValue={data.slug} />
        </Col>
      </Row>
      <Row>
        <Col span={7}>
          <Form.DatePicker field='created' label="创建时间" type="dateTime" initValue={created} />
        </Col>
        <Col className={params.slug ? "" : "hidden"} span={7} offset={1}>
          <Form.DatePicker field='modified' label="修改时间" type="dateTime" disabled={true} initValue={modified} />
        </Col>
        <Col span={7} offset={1}>
          <Form.Select field='status' label="文章状态" initValue={data.status || "publish"}>
            <Option value="publish">公开</Option>
            <Option value="private">私密</Option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Form.TextArea field='text' label="描述" initValue={data.text?data.text.slice(15):""} rows={28} />
      </Row>
      <Row>
        <Col span={11}>
          <PostCategories className="w-full" initValue={categories} />
        </Col>
        <Col span={11} offset={1}>
          <PostTags className="w-full" initValue={tags} />
        </Col>
      </Row>
      <div className="w-full mt-2">
        <Button className="mr-2" htmlType='submit'>{params.slug ? "修改" : "创建"}</Button>
        <Button className={params.slug ? "" : "hidden"} htmlType='button' type="danger" onClick={handleDelete}>删除</Button>
      </div>
    </Form>
  )
};