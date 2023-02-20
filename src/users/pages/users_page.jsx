import { useEffect, useState } from "react";
import { Pagination } from '@douyinfe/semi-ui';
import { Link } from "wouter";
import useSWR from 'swr'

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(`/api/users/?page=${page}&page_size=15`);

  useEffect(() => {
    document.title = "用户列表";
  })

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>正在加载</div>;

  const handlePageChange = (currentPage) => {
    setPage(currentPage);
  }

  return (
    <>
      <div className="mb-1 flex items-center">
        <h2 className="font-bold mr-auto">全部用户</h2>
        <Link className="underline mr-1.5" href={`/users/`}>新增</Link>
      </div>
      <div>
        {data.results.map(item => {
          const created = new Date(item.created * 1000);
          const modified = new Date(item.modified * 1000);
          return (
            <div className="my-1" key={item.uid}>
              <h2><Link className="underline mr-1.5" href={`/users/`}>{item.screenName}</Link></h2>
              <ul className="flex flex-wrap mt-1 text-gray-400 text-xs">
                <li className="mr-2">创建于 {created.toLocaleDateString()}</li>
              </ul>
            </div>
          )
        })}
      </div>
      <Pagination className={data.all_count > 15 ? "mt-2" : "hidden"} total={data.all_count} pageSize={15} currentPage={page} onPageChange={handlePageChange} showQuickJumper></Pagination>
    </>
  )
};