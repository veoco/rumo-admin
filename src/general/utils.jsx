import { useLocation } from "wouter";
import { Toast } from '@douyinfe/semi-ui';

function mapFail(status) {
  const [location, setLocation] = useLocation();

  switch (status) {
    case 401:
      sessionStorage.removeItem("access_token");
      setLocation('/login');
      break;
    case 500:
      Toast.error({ content: '服务器内部错误' });
      break;
    default:
      Toast.error({ content: '无网络或未知错误' });
  }
}

export { mapFail };