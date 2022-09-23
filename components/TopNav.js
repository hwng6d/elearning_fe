import { useRouter } from 'next/router'
import { Button, Menu, Dropdown, Space } from 'antd';
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../styles/TopNav.module.scss';
import { Context } from '../context';

const TopNav = () => {
  const router = useRouter();
  const { state: { user }, dispatch } = useContext(Context);
  const [currItem, setCurrItem] = useState('/');

  const menuItems = (
    <Menu
      items={[
        {
          label: 'Thông tin tài khoản',
          icon: <UserOutlined />,
          onClick: () => { router.push('/user') }
        },
        {
          label: 'Đăng xuất',
          icon: <LogoutOutlined />,
          onClick: signoutHandler
        },
      ]}
    />
  );

  useEffect(() => {
    ['/', '/signin', '/signup'].includes(router.pathname) && setCurrItem(router.pathname);
  }, [router.pathname]);

  async function signoutHandler() {
    const { data } = await axios.get('/api/auth/logout');
    window.localStorage.removeItem('user');
    dispatch({
      type: 'LOGOUT'
    });
    toast(data.message);
    router.push('/')
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
                width: '124px',
                textAlign: 'right',
                border: '2px solid #b0b0b0',
                padding: '5px 8px',
                margin: '2px 6px 0px 6px',
                borderRadius: '5px'
              }}
              >
                <Dropdown
                  overlayStyle={{ border: '1px solid #727272' }}
                  overlay={menuItems}
                >
                  <a onClick={(e) => e.preventDefault(e)}>
                    <Space>
                      <UserOutlined />
                      {user?.name}
                    </Space>
                  </a>
                </Dropdown>
              </div>
            )
          }
        </div>
      </div>
    </div>)
}

export default TopNav