const GroupMap = {
  "administrator": "管理员",
  "editor": "编辑",
  "contributor": "贡献者",
  "subscriber": "关注者",
}

function removeLoginData(){
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("uid")
}

export { GroupMap, removeLoginData };