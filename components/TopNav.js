import { useRouter } from 'next/router'
import { Menu } from 'antd';
import { HomeOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from 'antd';
import Link from 'next/link';
import styles from '../styles/TopNav.module.scss';

const items = [
  {
    icon: <HomeOutlined />,
    label: 'Home',
    key: '/'
  },
  {
    icon: <LoginOutlined />,
    label: 'Sign In',
    key: '/signin',
  },
  {
    icon: <UserAddOutlined />,
    label: 'Sign Up',
    key: '/signup'
  },
];

const TopNav = () => {
  const router = useRouter();
  const [currItem, setCurrItem] = useState('/');

  useEffect(() => {
    ['/', '/signin', '/signup'].includes(router.pathname) && setCurrItem(router.pathname);
  }, [router.pathname])

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
            <a className={styles.anchor}><Image src={'/logo.png'} width='138px' height='30px' /></a>
          </Link>
        </div>

        <div className={styles.container_right}>
          {
            currItem !== '/signin' && (
              <Button size='large' id={styles.btn_signin}>
                <Link href='/signin'>
                  <a>Đăng nhập</a>
                </Link>
              </Button>
            )
          }
          {
            currItem !== '/signup' && (
              <Button size='large' id={styles.btn_signup}>
                <Link href='/signup'>
                  <a>Đăng ký</a>
                </Link>
              </Button>
            )
          }
        </div>
      </div>
    </div>)
}

export default TopNav