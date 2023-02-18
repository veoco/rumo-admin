import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Form, Button, Toast } from '@douyinfe/semi-ui';

import { mapFail } from "../../common/utils";

export default function LoginPage() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    document.title = "管理登录";
  })

  const handleSubmit = async (values) => {
    const r = await fetch("/api/users/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    if (r.status != 200) {
      if (r.status == 401) {
        Toast.error({ content: '邮箱或密码错误' })
      } else {
        mapFail(r.status);
      }
      return;
    }
    const res = await r.json();
    const access_token = res.access_token;
    const payload = JSON.parse(window.atob(access_token.split('.')[1]));
    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("uid", payload.sub);
    setLocation("/");
  }

  return (
    <Form className="h-[calc(100vh-8rem)] max-w-xs mx-auto flex flex-col justify-center" labelPosition='inset' onSubmit={handleSubmit}>
      <h2 className="text-center text-lg font-bold pb-1">管理登录</h2>
      <Form.Input field='mail' label='邮箱' type="email" />
      <Form.Input field='password' label="密码" type="password" />
      <div className="flex items-center pt-2">
        <p className="mr-auto">没有帐号？ <Link className="underline" href="#">立即注册</Link></p>
        <Button htmlType='submit' type="tertiary">登录</Button>
      </div>
    </Form>
  )
};