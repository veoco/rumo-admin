import { Descriptions, Tag } from '@douyinfe/semi-ui';
import { useLocation } from "wouter";
import useSWR from 'swr'

import { GroupMap, removeLoginData } from '../utils';

export default function UserDescription({ className }) {
  const uid = sessionStorage.getItem("uid");

  const [location, setLocation] = useLocation();
  const { data, error, isLoading } = useSWR(`/api/users/${uid}`);

  if (error) return <div className={className}>加载失败</div>;
  if (isLoading) return <div className={className}>正在加载</div>;
  

  const lastLogin = new Date(data.logged * 1000);
  const groupName = GroupMap[data.group];

  return (
    <Descriptions className={className}>
      <Descriptions.Item itemKey="帐号名称">{data.name}</Descriptions.Item>
      <Descriptions.Item itemKey="用户昵称">{data.screenName}</Descriptions.Item>
      <Descriptions.Item itemKey="用户邮箱">{data.mail}</Descriptions.Item>
      <Descriptions.Item itemKey="当前组别"><Tag color='green'>{groupName}</Tag></Descriptions.Item>
      <Descriptions.Item itemKey="上次登录">
        {lastLogin.toLocaleString()}
        <Tag className="ml-2" color='red' onClick={() => { removeLoginData(); setLocation("/login") }}>登出</Tag>
      </Descriptions.Item>
    </Descriptions>
  )
};