import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu } from "antd";
const { Content, Sider } = Layout;
import { UserOutlined, PlusOutlined, MenuUnfoldOutlined, InsertRowBelowOutlined, InsertRowAboveOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from '../../styles/components/nav/InstructorNav.module.scss';

const InstructorNav = ({
  hideSidebar,
  collapsed,
  setCollapsed,
  children
}) => {
  const router = useRouter();
  const [currSelected, setCurrSelected] = useState('/instructor');
  const [child, setChild] = useState(null);

  const selectedHandler = (currentSelected) => {
    // setChild(childComponent);
    setCurrSelected(currentSelected);
  }

  useEffect(() => {
    if (router.pathname === '/instructor')
      // selectedHandler(<CInstructorIndex />, '/instructor');
      selectedHandler('/instructor');
    else if (router.pathname === '/instructor/course/create')
      // selectedHandler(<CCreate />, '/instructor/course/create');
      selectedHandler('/instructor/course/create');
    else if (router.pathname === '/instructor/waiting-courses')
      selectedHandler('/instructor/waiting-courses');
    else if (router.pathname === '/instructor/public-courses')
      selectedHandler('/instructor/public-courses');
    else if (router.pathname === '/instructor/rejected-courses')
      selectedHandler('/instructor/rejected-courses');
    else if (router.pathname === '/instructor/editing-courses')
      selectedHandler('/instructor/editing-courses');
  }, [router.pathname])

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
        width={272}
        style={{
          minHeight: 'calc(100vh - 80px)'
        }}
      >
        <Menu
          mode="inline"
          theme='light'
          defaultOpenKeys={['group_1']}
          selectedKeys={[currSelected]}
          style={{
            height: '100%',
            borderRight: 0,
          }}
        >
          <Menu.SubMenu
            key='group_1'
            title='Bảng điều khiển'
            icon={<UserOutlined />}
          >
            <Menu.Item
              key='/instructor'
              icon={<MenuUnfoldOutlined />}
              onClick={() => selectedHandler('/instructor')}
              // onClick={() => selectedHandler(<CInstructorIndex />, '/instructor')}
            >
              <Link href='/instructor'>
                Tất cả khóa học
              </Link>
            </Menu.Item>
            <Menu.Item
              key='/instructor/editing-courses'
              icon={<InsertRowBelowOutlined />}
              onClick={() => selectedHandler('/instructor/editing-courses')}
              // onClick={() => selectedHandler(<CInstructorIndex />, '/instructor')}
            >
              <Link href='/instructor/editing-courses'>
                Khóa học đang chỉnh sửa
              </Link>
            </Menu.Item>
            <Menu.Item
              key='/instructor/waiting-courses'
              icon={<InsertRowAboveOutlined />}
              onClick={() => selectedHandler('/instructor/waiting-courses')}
              // onClick={() => selectedHandler(<CInstructorIndex />, '/instructor')}
            >
              <Link href='/instructor/waiting-courses'>
                Khóa học chờ được xuất bản
              </Link>
            </Menu.Item>
            <Menu.Item
              key='/instructor/public-courses'
              icon={<InsertRowAboveOutlined />}
              onClick={() => selectedHandler('/instructor/public-courses')}
              // onClick={() => selectedHandler(<CInstructorIndex />, '/instructor')}
            >
              <Link href='/instructor/public-courses'>
                Khóa học đã được xuất bản
              </Link>
            </Menu.Item>
            <Menu.Item
              key='/instructor/rejected-courses'
              icon={<InsertRowBelowOutlined />}
              onClick={() => selectedHandler('/instructor/rejected-courses')}
              // onClick={() => selectedHandler(<CInstructorIndex />, '/instructor')}
            >
              <Link href='/instructor/rejected-courses'>
                Khóa học bị từ chối
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item
            key='/instructor/course/create'
            icon={<PlusOutlined />}
            onClick={() => selectedHandler('/instructor/course/create')}
            // onClick={() => selectedHandler(<CCreate />, '/instructor/course/create')}
          >
            <Link href='/instructor/course/create'>
              Tạo khóa học mới
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Content
        className="site-layout-background"
        style={{ padding: 16, margin: 0, minHeight: 'calc(100vh - 80px)' }}
      >
        {children}
        {/* {child} */}
      </Content>
    </Layout>
  );
}

export default React.memo(InstructorNav);