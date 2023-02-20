import { Form } from '@douyinfe/semi-ui';
import useSWR from 'swr'

export default function PostCategories({ initValue, className }) {
  const { data, error, isLoading } = useSWR(`/api/categories/?page_size=100`);

  if (error) return <div className={className}>加载失败</div>;
  if (isLoading) return <div className={className}>正在加载</div>;
 
  const Select = Form.Select;
  const { Option } = Form.Select;

  return (
    <Select className={className} multiple filter field='categories' label="分类" initValue={initValue}>
      {data.results.map(item=>{
        return (
          <Option value={item.slug} key={item.mid}>{item.name}</Option>
        )
      })}
    </Select>
  )
};