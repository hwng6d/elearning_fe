import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useRouter } from 'next/router'
import { Button, Menu, Dropdown, Space, message, Modal, Input, Popover } from 'antd';
import { Context } from '../../context/index';
import { AppstoreAddOutlined, LogoutOutlined, RightOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import styles from '../../styles/components/nav/TopNav.module.scss';
import { SearchBox } from '@fluentui/react';
// import { initializeIcons } from '@fluentui/react';

const TopNav = () => {
  // initializeIcons();

  // router
  const router = useRouter();

  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // states
  const [currItem, setCurrItem] = useState('/');
  const [modalOpened, setModalOpened] = useState(false);
  const [course, setCourse] = useState({}); // this states only used when in learning route
  const [categories, setCategories] = useState([]); // this states used when in publich route for searching, filtering...
  const [search, setSearch] = useState('');

  // variables
  const menuItems = (
    <Menu
      items={[
        displayGreeting(user?.name, user?.role),
        (user?.role?.includes('Admin'))
        && {
          label: 'Truy cập trang Admin',
          icon: <AppstoreAddOutlined />,
          onClick: () => { router.push('/admin') }
        },
        (user?.role?.includes('Instructor'))
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
  function displayGreeting(name, role) {
    const plan_type = user?.instructor_information?.plan_type;
    const style = {
      padding: '2px 8px',
      borderRadius: '10px',
      color: 'white',
      fontWeight: 600,
      fontSize: '12px',
      backgroundImage: `linear-gradient(
        to left,
        #${plan_type === 'premium' ? 'ffa190' : plan_type === 'silver' ? 'c9d1da' : plan_type === 'gold' ? 'f3c783' : 'ffff'},
        #f3633a)`,
    }

    return {
      label: (
        <div className={styles.d_flex_row}>
          <h4>Xin chào {name}!</h4>
          {
            role?.includes('Instructor')
              && (
                <div
                  style={style}
                >
                  {user?.instructor_information?.plan_type?.toUpperCase()}
                </div>
              )
          }
        </div>
      ),
      selectable: 'string'
    }
  }

  const onSearchEnter = async (value) => {
    router.replace(
      `/course?keyword=${value}`
    )
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
      if (router.isReady) {
        setCategories([]);
        const { data } = await axios.get(`/api/course/public/${router.query.slug}`);
        setCourse(data.data);
      }
    }
    catch (error) {
      message.error(`Không lấy được tên khóa học. Chi tiết: ${error.message}`);
    }
  }

  async function getCategoriesInfo() {
    try {
      if (router.isReady) {
        setCourse({});
        const { data } = await axios.get(`/api/category/public`);
        setCategories(data.data);
      }
    }
    catch (error) {
      message.error(`Không lấy được danh sách phân loại. Chi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    ['/', '/signin', '/signup'].includes(router.pathname) && setCurrItem(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    // console.log('router.pathname: ', router.pathname);  // /user/courses/[slug]/lesson/[lessonId]
    // console.log(router.query);  // {slug: 'reactjs-zero-hero', lessonId: '860ba22b-30a3-4056-bb7d-8ddf891af2da'}

    if (router.pathname === '/user/courses/[slug]/lesson/[lessonId]')
      getCourseInfo();
    else
      getCategoriesInfo();
  }, [router.pathname]);

  // useEffect(() => {
  //   if (router.pathname !== '/user/courses/[slug]/lesson/[lessonId]')
  //     getCategoriesInfo();
  // }, [router.pathname && user])

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <Space
            direction='horizontal'
            size='large'
            split={Object.keys(course || {}).length ? '|' : null}
            style={{ alignItems: 'center' }}
          >
            <Link href='/' className={styles.anchor}>
              <Image
                alt='web_logo'
                src={'/logo.png'}
                width={138}
                height={42}
                onClick={() => setSearch('')}
              />
            </Link>
            {
              Object.keys(course || {}).length
                ? (
                  <div
                    style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px', color: '#3a3d40' }}
                  >
                    {course?.name}
                  </div>
                )
                : null
            }
            {
              categories?.length
                ? (
                  <div style={{ marginTop: '4px', marginLeft: '8px' }}>
                    <Popover
                      trigger='hover'
                      title={null}
                      placement='bottomRight'
                      content={
                        <div
                          className={styles.popover_category}
                        >
                          {
                            categories?.map((cate, index) => {
                              return (
                                <Link
                                  key={`cate_${index}`}
                                  href={`/category/${cate?.slug}`}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      cursor: 'pointer',
                                      color: 'black'
                                    }}
                                  >
                                    <p
                                      key={`cate_${index}`}
                                      style={{ padding: '12px 12px' }}
                                    >
                                      {cate?.name}
                                    </p>
                                    <RightOutlined style={{ fontSize: '10px' }} />
                                  </div>
                                </Link>
                              )
                            })
                          }
                        </div>
                      }
                    >
                      <p style={{ fontSize: '18px', color: '#4e4e4e' }}><b>Phân loại</b></p>
                    </Popover>
                  </div>
                )
                : null
            }
            {
              categories?.length
              ? (
                <div
                  style={{ margin: '4px 0px 0px 16px', width: '1024px' }}
                >
                  <SearchBox
                    className='topnav_searchbox'
                    placeholder='Nhập từ khóa...'
                    value={search}
                    onChange={(_, value) => setSearch(value)}
                    onSearch={onSearchEnter}
                    style={{ height: '36px' }}
                  />
                </div>
              )
              : null
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