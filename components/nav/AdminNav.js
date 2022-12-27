import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout, Menu } from 'antd';
const { Content, Sider } = Layout;
import { AppstoreOutlined, AuditOutlined, DatabaseOutlined, GoldFilled } from '@ant-design/icons';
import Link from "next/link";
import styles from '../../styles/components/nav/AdminNav.module.scss';

const AdminNav = ({
  hideSidebar,
  collapsed,
  setCollapsed,
  children,
}) => {
  // router
  const router = useRouter();

  // variables
  const keys = ['/admin', 'group_1', '/tags', 'group_2'];

  // states
  const [currSelected, setCurrSelected] = useState('/admin');

  // functions
  const selectedHandler = (currentSelected) => {
    // setChild(childComponent);
    setCurrSelected(currentSelected);
  }

  useEffect(() => {
    if (router.pathname === '/admin')
      selectedHandler('/admin');
    else if (router.pathname.includes('/admin/course-new'))
      selectedHandler('/admin/course-new');
    else if (router.pathname.includes('/admin/course-edit'))
      selectedHandler('/admin/course-edit');
    else if (router.pathname.includes('/admin/categories'))
      selectedHandler('/admin/categories');
    else if (router.pathname.includes('/admin/banner/home-banner'))
      selectedHandler('/admin/banner/home-banner');
    else if (router.pathname.includes('/admin/banner/advertisement-banner'))
      selectedHandler('/admin/banner/advertisement-banner');
    else if (router.pathname.includes('/admin/banner/category-banner'))
      selectedHandler('/admin/banner/category-banner');
  }, [router.pathname]);
  
  return (
    <Layout
      className={styles.site_layout}
      style={{ marginTop: '1px' }}
    >
      <Sider
        className={styles.site_layout_background}
        hidden={hideSidebar}
        defaultCollapsed={false}
        collapsible={true}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width='260px'
        style={{
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        <Menu
          mode='inline'
          theme='light'
          defaultOpenKeys={keys}
          selectedKeys={[currSelected]}
          style={{
            height: '100%',
            borderRight: 0
          }}
        >
          <Menu.Item
            key='/admin'
            icon={<GoldFilled />}
            onClick={() => selectedHandler('/admin')}
          >
            <Link href='/admin'>
              Thống kê
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            key='group_1'
            title='Phê duyệt'
            icon={<AppstoreOutlined />}
          >
            <Menu.Item
              key='/admin/course-new'
              icon={<AuditOutlined />}
              onClick={() => selectedHandler('/admin/course-new')}
            >
              <Link href='/admin/course-new'>
                Khóa học mới
              </Link>
            </Menu.Item>
            <Menu.Item
              key='/admin/course-edit'
              icon={<AuditOutlined />}
              onClick={() => selectedHandler('/admin/course-edit')}
            >
              <Link href='/admin/course-edit'>
                Khóa học được chỉnh sửa
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item
            key='/admin/categories'
            icon={<DatabaseOutlined />}
            onClick={() => selectedHandler('/admin/categories')}
          >
            <Link href='/admin/categories'>
              Quản lý phân loại
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            key='group_2'
            title='Quản lý banner'
            icon={<AppstoreOutlined />}
          >
            <Menu.Item
              key='/admin/banner/home-banner'
              icon={<AuditOutlined />}
              onClick={() => selectedHandler('/admin/banner/home-banner')}
            >
              <Link href='/admin/banner/home-banner'>
                Banner trang chủ
              </Link>
            </Menu.Item>
            <Menu.Item
              key='/admin/banner/advertisement-banner'
              icon={<AuditOutlined />}
              onClick={() => selectedHandler('/admin/banner/advertisement-banner')}
            >
              <Link href='/admin/banner/advertisement-banner'>
                Banner quảng cáo
              </Link>
            </Menu.Item>
            <Menu.Item
              key='/admin/banner/category-banner'
              icon={<AuditOutlined />}
              onClick={() => selectedHandler('/admin/banner/category-banner')}
            >
              <Link href='/admin/banner/category-banner'>
                Banner các phân loại
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Content
        className="site-layout-background"
        style={{ padding: 16, margin: 0, minHeight: 'calc(100vh - 80px)' }}
      >
        {children}
      </Content>
    </Layout>
  );

  // return (
  //   <div>
  //     asd
  //   </div>
  // )
}

export default AdminNav
