import { useRouter } from 'next/router'
import { Button, Menu, Dropdown, Space, message, Modal } from 'antd';
import { AppstoreAddOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import styles from '../../styles/components/nav/TopNav.module.scss';
import { Context } from '../../context/index';

const TopNav = () => {
  // router
  const router = useRouter();

  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // states
  const [currItem, setCurrItem] = useState('/');
  const [modalOpened, setModalOpened] = useState(false);
  const [course, setCourse] = useState({}); // this states only used when in learning route

  // variables
  const menuItems = (
    <Menu
      items={[
        displayGreeting(user && user.name),
        (user && user.role && user.role.includes('Admin'))
        && {
          label: 'Truy cập trang Admin',
          icon: <AppstoreAddOutlined />,
          onClick: () => { router.push('/admin') }
        },
        (user && user.role && user.role.includes('Instructor'))
        && {
          label: 'Truy cập trang Instructor',
          icon: <AppstoreAddOutlined />,
          onClick: () => { router.push('/instructor') }
        },
        {
          label: 'Thông tin tài khoản',
          icon: <UserOutlined />,
          onClick: () => { router.push('/user') }
        },
        {
          label: 'Đăng xuất',
          icon: <LogoutOutlined />,
          onClick: () => setModalOpened(true)
        },
      ]}
    />
  );

  // functions
  function displayGreeting(name) {
    return {
      label: <h4>Xin chào {name}!</h4>,
      selectable: 'string'
    }
  }

  async function signoutHandler() {
    try {
      await axios.get('/api/auth/logout');
      window.localStorage.removeItem('user');
      dispatch({
        type: 'LOGOUT'
      });
      message.info('Đã đăng xuất');
      router.push('/');
      setModalOpened(false);
    }
    catch (error) {
      console.log('error', error);
      message.error('Có lỗi xảy ra')
      setModalOpened(false);
    }
  }

  async function getCourseInfo() {
    try {
      if (router.pathname === '/user/courses/[slug]/lesson/[lessonId]') {
        const { data } = await axios.get(`/api/course/public/${router.query.slug}`);
        setCourse(data.data);
      } else {
        setCourse({});
      }
    }
    catch (error) {
      message.error(`Có lỗi xảy ra. Chi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    ['/', '/signin', '/signup'].includes(router.pathname) && setCurrItem(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    console.log('router.pathname: ', router.pathname);  // /user/courses/[slug]/lesson/[lessonId]
    console.log(router.query);  // {slug: 'reactjs-zero-hero', lessonId: '860ba22b-30a3-4056-bb7d-8ddf891af2da'}

    getCourseInfo();
  }, [router.query])

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <Space
            direction='horizontal'
            size='large'
            split={Object.keys(course || {}).length ? '|' : null}
          >
            <Link href='/' className={styles.anchor}>
              <Image src={'/logo.png'} width={138} height={42} />
            </Link>
            {
              course && (
                <div
                  style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px', color: '#3a3d40' }}
                >
                  {course?.name}
                </div>
              )
            }
          </Space>
        </div>

        <div className={styles.container_right}>
          {
            user && (
              (user.role && !user.role.includes('Instructor') && !user.role.includes('Admin'))
              && (
                (
                  <Link href='/user/become-instructor' className={styles.container_right_label}>
                    <span>Trở thành Instructor</span>
                  </Link>
                )
              )
            )
          }
          {
            (user === null && currItem !== '/signin') && (
              <Button size='large' id={styles.btn_signin}>
                <Link href='/signin'>
                  Đăng nhập
                </Link>
              </Button>
            )
          }
          {
            (user === null && currItem !== '/signup') && (
              <Button size='large' id={styles.btn_signup}>
                <Link href='/signup'>
                  Đăng ký
                </Link>
              </Button>
            )
          }
          {
            user !== null && (
              <Dropdown
                overlayStyle={{ border: '1px solid #727272' }}
                overlay={menuItems}
              >
                <div style={{
                  display: 'flex',
                  width: '64px',
                  height: '40px',
                  padding: '6px',
                  margin: '2px 8px 0px 6px',
                  backgroundImage: 'linear-gradient(to right, rgb(255, 74, 74), rgb(255, 155, 61))',
                  alignItems: "center",
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                >
                  <a onClick={(e) => e.preventDefault(e)}>
                    <UserOutlined style={{ color: 'white', fontSize: '22px' }} />
                  </a>
                </div>
              </Dropdown>
            )
          }
          <Modal
            title='Đăng xuất'
            open={modalOpened}
            cancelText='Hủy'
            okText='Đồng ý'
            onOk={signoutHandler}
            onCancel={() => setModalOpened(false)}
          >
            <span style={{ fontSize: '15px' }}>Bạn muốn đăng xuất ?</span>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TopNav