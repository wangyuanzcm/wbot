import React, { useState } from 'react';
import {
  BrowserRouter,
} from "react-router-dom";
import Router from './router';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, message, Button, theme } from 'antd';

import {  useQueryTokenDatas } from './store';
import { menu_options } from './config'
const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  // const [loading, setLoading] = useState(false)
  // const fetchList = useQueryDB((state) => state.fetchList)

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const onClick = (e) => {
    console.log('click ', e);
  };
  
  return (
    <BrowserRouter basename="/">
      <Layout style={{ height: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}   >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['tradelist']}
            onClick={onClick}
            items={menu_options}
          />
        </Sider>
        <Layout >
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            {/* <Button type="primary" loading={loading} onClick={handleSync} >
              同步远程数据库
            </Button> */}
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              overflow: 'auto',
              background: colorBgContainer,
            }}
          >
            <Router />
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;