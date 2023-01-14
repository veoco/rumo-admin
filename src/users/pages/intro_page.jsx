import { useEffect } from "react";
import { Link } from "wouter";
import { Descriptions } from '@douyinfe/semi-ui';
import useSWR from 'swr'

import UserDescription from "../components/user_description";

export default function IntroPage(){
  useEffect(() => {
    document.title = "管理面板";
  })

  return (
    <>
      <div>
        <UserDescription className="p-4 border rounded bg-white" />
      </div>
        
    </>
  )
};