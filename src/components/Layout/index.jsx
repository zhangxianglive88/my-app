import React, { Component } from 'react'
import { Layout, Menu } from 'antd'
import { TableOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'

const { Header, Sider, Content } = Layout

class AppLayout extends Component {
  state = {
    collapsed: false,
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  handleMenuClick = ({ key }) => {
    this.props.history.push(key)
  }

  render() {
    const { collapsed } = this.state
    const { location, children } = this.props
    const selectedKeys = [location.pathname]

    return (
      <Layout style={{ minHeight: '100vh', width: '100%' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" style={{ 
            height: 64, 
            lineHeight: '64px', 
            textAlign: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            background: 'rgba(255, 255, 255, 0.2)'
          }}>
            {collapsed ? 'App' : 'My App'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="/table">
              <TableOutlined />
              <span>表格管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ width: '100%', flex: 1 }}>
          <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', width: '100%' }}>
            {collapsed ? (
              <MenuUnfoldOutlined
                className="trigger"
                onClick={this.toggle}
                style={{ fontSize: 18, cursor: 'pointer' }}
              />
            ) : (
              <MenuFoldOutlined
                className="trigger"
                onClick={this.toggle}
                style={{ fontSize: 18, cursor: 'pointer' }}
              />
            )}
            <div style={{ marginLeft: 'auto', fontSize: 16, fontWeight: 500 }}>
              管理系统
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
              width: 'auto',
              overflow: 'auto',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(AppLayout)

