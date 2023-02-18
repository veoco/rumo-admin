import { useEffect, useState } from "react";
import { List, Tag, ButtonGroup, Button, CheckboxGroup, Checkbox, Pagination } from '@douyinfe/semi-ui';
import useSWR from 'swr'

export default function PostsPage(params) {
  const [page, setPage] = useState(parseInt(params.page || '1'));
  const { data, error, isLoading } = useSWR(`/api/posts/?page=${page}&private=true`);
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckall] = useState(false);

  useEffect(() => {
    document.title = "文章列表";
  })

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>正在加载</div>;

  const handleChange = (checkedList) => {
    setCheckedList(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < data.count);
    setCheckall(checkedList.length === data.count);
  };

  const handleCheckAllChange = (e) => {
    let mids = [];
    for (let category of data.results) {
      mids.push(category.mid);
    }
    setCheckedList(e.target.checked ? mids : []);
    setIndeterminate(false);
    setCheckall(e.target.checked);
  };

  const handlePageChange = (currentPage) => {
    setPage(currentPage);
  }

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
      </div>
      <CheckboxGroup value={checkedList} onChange={handleChange}>
        <List className="border bg-white" dataSource={data.results} renderItem={item => {
          return (
            <List.Item
              header={<Checkbox value={item.cid}></Checkbox>}
              main={
                <div className="flex">
                  <Tag className="mr-2" color="blue">{item.status}</Tag>
                  <span className="mr-1">{item.title}</span>
                  <span className="text-sm text-slate-500">{item.slug}</span>
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
      <Pagination className="bg-white p-4 mt-3 border" total={data.all_count} pageSize={10} currentPage={page} onPageChange={handlePageChange} showQuickJumper></Pagination>
    </>
  )
};