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
  const router = useRouter();
  const { state: { user }, dispatch } = useContext(Context);
  const [currItem, setCurrItem] = useState('/');
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  const menuItems = (
    <Menu
      items={[
        displayGreeting(user && user.name),
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

  useEffect(() => {
    ['/', '/signin', '/signup'].includes(router.pathname) && setCurrItem(router.pathname);
  }, [router.pathname]);

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

  return (
    <div>
      {/* <Menu
        selectedKeys={currItem ? [currItem] : []}
        style={{ justifyContent: 'flex-end', padding: '0px 16px' }}
        theme='dark'
        mode='horizontal'
        items={items}
        onSelect={(info) => router.replace(`${info.key}`)}
      /> */}

      <div className={styles.container}>
        <div className={styles.container_left}>
          <Link href='/'>
            <a className={styles.anchor}><Image src={'/logo.png'} width='138px' height='42px' /></a>
          </Link>
        </div>

        <div className={styles.container_right}>
          {
            user && (
              (user.role && !user.role.includes('Instructor'))
              && (
                <Link href='/user/become-instructor'>
                  <a className={styles.container_right_label}>
                    <span>Trở thành Instructor</span>
                  </a>
                </Link>
              )
            )
          }
          {
            (user === null && currItem !== '/signin') && (
              <Button size='large' id={styles.btn_signin}>
                <Link href='/signin'>
                  <a>Đăng nhập</a>
                </Link>
              </Button>
            )
          }
          {
            (user === null && currItem !== '/signup') && (
              <Button size='large' id={styles.btn_signup}>
                <Link href='/signup'>
                  <a>Đăng ký</a>
                </Link>
              </Button>
            )
          }
          {
            user !== null && (
              <div style={{
                display: 'flex',
                width: '64px',
                height: '40px',
                textAlign: 'right',
                padding: '6px',
                margin: '2px 8px 0px 6px',
                backgroundImage: 'linear-gradient(to right, rgb(255, 74, 74), rgb(255, 155, 61))',
                alignItems: "center",
                justifyContent: 'center',
              }}
              >
                <Dropdown
                  overlayStyle={{ border: '1px solid #727272' }}
                  overlay={menuItems}
                >
                  <a onClick={(e) => e.preventDefault(e)}>
                    <Space style={{ width: '22px' }}>
                      <UserOutlined style={{ color: 'white', fontSize: '22px' }}/>
                    </Space>
                  </a>
                </Dropdown>
              </div>
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
    </div>)
}

export default TopNav