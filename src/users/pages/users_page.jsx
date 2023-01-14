import { useEffect, useState } from "react";
import { List, Tag, ButtonGroup, Button, CheckboxGroup, Checkbox } from '@douyinfe/semi-ui';
import useSWR from 'swr'

export default function UsersPage() {
  const { data, error, isLoading } = useSWR(`/api/users/`);
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckall] = useState(false);

  useEffect(() => {
    document.title = "用户列表";
  })

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>正在加载</div>;

  const handleChange = (checkedList) => {
    setCheckedList(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < data.count);
    setCheckall(checkedList.length === data.count);
  };

  const handleCheckAllChange = (e) => {
    let uids = [];
    for (let user of data.results) {
      uids.push(user.uid);
    }
    setCheckedList(e.target.checked ? uids : []);
    setIndeterminate(false);
    setCheckall(e.target.checked);
  };

  return (
    <>
      <div className="flex items-center bg-white border mb-3 p-4">
        <Checkbox
          className="px-2"
          indeterminate={indeterminate}
          onChange={handleCheckAllChange}
          checked={checkAll}
        >
          <span className="ml-2">选择全部</span>
        </Checkbox>
        <span className="text-sm">共有 {data.all_count} 位用户</span>
      </div>
      <CheckboxGroup value={checkedList} onChange={handleChange}>
        <List className="border bg-white" dataSource={data.results} renderItem={item => {
          return (
            <List.Item
              header={<Checkbox value={item.uid}></Checkbox>}
              main={
                <div className="flex">
                  <Tag className="mr-2" color="blue">{item.uid}</Tag>
                  <span className="mr-1">{item.name}</span>
                  <span className="text-sm text-slate-500">{item.screenName}</span>
                </div>
              }
              extra={
                <ButtonGroup theme="borderless">
                  <Button>编辑</Button>
                  <Button type="danger">删除</Button>
                </ButtonGroup>
              }
            />
          )
        }}
        />
      </CheckboxGroup>
    </>
  )
};