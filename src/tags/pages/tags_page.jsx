import { useEffect, useState } from "react";
import { Pagination } from '@douyinfe/semi-ui';
import { Link } from "wouter";
import useSWR from 'swr'

export default function TagsPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(`/api/tags/?page=${page}&page_size=400`);

  useEffect(() => {
    document.title = "标签列表";
  })

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>正在加载</div>;

  const handlePageChange = (currentPage) => {
    setPage(currentPage);
  }

  return (
    <>
      <div className="mb-1 flex items-center">
        <h2 className="font-bold mr-auto">全部标签</h2>
        <Link className="underline mr-1.5" href={`/tags/create`}>新增</Link>
      </div>
      {data.results.map(item => {
        return (
          <Link className="underline mr-1.5" href={`/tags/${item.slug}/`} key={item.mid}>{item.name}</Link>
        )
      })}
      <Pagination className={data.all_count > 400 ? "mt-2" : "hidden"} total={data.all_count} pageSize={400} currentPage={page} onPageChange={handlePageChange} showQuickJumper></Pagination>
    </>
  )
};