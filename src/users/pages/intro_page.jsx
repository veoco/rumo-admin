import { useEffect } from "react";

import UserDescription from "../components/user_description";

export default function IntroPage() {
  useEffect(() => {
    document.title = "管理面板";
  })

  return (
    <UserDescription className="py-2" />
  )
};