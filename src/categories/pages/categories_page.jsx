import { useEffect, useState } from "react";
import { Pagination } from '@douyinfe/semi-ui';
import { Link } from "wouter";
import useSWR from 'swr'

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(`/api/categories/?page=${page}&page_size=400`);

  useEffect(() => {
    document.title = "分类列表";
  })

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>正在加载</div>;

  const handlePageChange = (currentPage) => {
    setPage(currentPage);
  }

  return (
    <>
      <div className="mb-1 flex items-center">
        <h2 className="font-bold mr-auto">全部分类</h2>
        <Link className="underline mr-1.5" href={`/categories/create`}>新增</Link>
      </div>
      {data.results.map(item => {
        return (
          <Link className="underline mr-1.5" href={`/categories/${item.slug}/`} key={item.mid}>{item.name}</Link>
        )
      })}
      <Pagination className={data.all_count > 400 ? "mt-2" : "hidden"} total={data.all_count} pageSize={400} currentPage={page} onPageChange={handlePageChange} showQuickJumper></Pagination>
    </>
  )
};