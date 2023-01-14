import { useState } from "react";
import { Layout, Nav } from '@douyinfe/semi-ui';
import { Route, useLocation, Router } from "wouter";
import { Avatar } from '@douyinfe/semi-ui';
import { IconHome, IconUser } from '@douyinfe/semi-icons';

import ErrorPage from './general/error_page';

import IntroPage from './users/pages/intro_page';
import LoginPage from './users/pages/login_page';
import UsersPage from './users/pages/users_page';

import "./app.css"

export default function App() {
  const [location, setLocation] = useLocation();

  const token = sessionStorage.getItem('access_token');
  const isLoginPage = location.startsWith("/admin/login");
  const [selectedKeys, setSelectedKeys] = useState([location]);

  if (!isLoginPage && !token) {
    setLocation("/admin/login");
  }

  const handleSelect = data => {
    setLocation(data.itemKey)
    setSelectedKeys([...data.selectedKeys]);
  };

  return (
    <Layout>
      <Layout.Sider className={isLoginPage ? "hidden" : ""}>
        <Nav
          selectedKeys={selectedKeys}
          onSelect={handleSelect}
          className="max-w-xs h-screen"
          items={[
            { itemKey: '/admin/', text: '首页', icon: <IconHome /> },
            { itemKey: '/admin/users/', text: '用户', icon: <IconUser /> },
          ]}
          header={{ text: '管理面板', logo: <Avatar style={{ color: '#333', backgroundColor: '#fff' }} size="small" alt='Rumo' onClick={() => { setLocation("/admin/") }}>R</Avatar> }}
          footer={{ collapseButton: true }}
        />
      </Layout.Sider>

      <Layout>
        <Layout.Content className="p-8">
          <Router base="/admin">
            <Route path="/" component={IntroPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/users/" component={UsersPage} />
          </Router>
        </Layout.Content>
      </Layout>
    </Layout>
  )
};
