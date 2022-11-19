import React, { useState, useEffect, useMemo, useContext } from "react";
import { useRouter } from "next/router";
import { Context } from "../../context";
import { Layout, Menu, Space, Spin, Tabs, Descriptions, message, Tooltip } from 'antd';
const { Content, Sider } = Layout;
import Plyr from "plyr-react";
import Link from "next/link";
import {
  CloseOutlined,
  PlaySquareOutlined,
  TwitterOutlined,
  LinkedinFilled,
  YoutubeFilled,
  CheckSquareFilled,
  BorderOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import Image from "next/image";
import styles from '../../styles/components/routes/LearningRoute.module.scss';
import axios from "axios";

const LearningRoute = ({ loading, course, currentLesson }) => {
  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // router
  const router = useRouter();

  // states
  const [hide, setHide] = useState({ courses: false, lesson: false });
  const [sidebarItems, setSidebarItems] = useState([]);

  // variables
  const tabItems = useMemo(() => {
    return [
      {
        label: <p style={{ fontSize: '15px', fontWeight: '600', color: '#6a6f73' }}>Tổng quan</p>,
        key: 'tab_overview',
        children: <TabOverview course={course} currentLesson={currentLesson} />
      },
      {
        label: <p style={{ fontSize: '15px', fontWeight: '600', color: '#6a6f73' }}>Q&A</p>,
        key: 'tab_qa',
        children: <TabQA course={course} currentLesson={currentLesson} />
      },
      {
        label: <p style={{ fontSize: '15px', fontWeight: '600', color: '#6a6f73' }}>Review</p>,
        key: 'tab_review',
        children: <TabReview course={course} currentLesson={currentLesson} />
      }
    ]
  }, [course]);

  // components
  const PlyrPlayer = useMemo(() => {
    return (
      <Plyr
        source={{
          type: 'video',
          sources: [
            {
              src: currentLesson?.video_link?.Location,
              provider: 'html5'
            }
          ]
        }}
      />
    )
  }, [currentLesson]);

  // functions
  const menuItemClickHandler = ({ item, key }) => {
    router.push(`/user/courses/${course.slug}/lesson/${key}`);
  }

  const tabChangeHandler = (activeKey) => {
    console.log('activeKey: ', activeKey);
  }

  const completionHandler = async (event, isCompleted, lessonId) => {
    try {
      event.stopPropagation();

      if (currentLesson._id === lessonId) {
        if (!isCompleted) {  //user want to mark lesson to be completed
          const { data } = await axios.post(
            `/api/user/enrolled-courses/${course._id}/lesson/${currentLesson._id}/mark-complete`
          );
          dispatch({
            type: 'LOGIN',
            payload: data.data
          });
          window.localStorage.setItem('user', JSON.stringify(data.data));
        } else {  //user want to mark lesson to be incompleted
          const { data } = await axios.post(
            `/api/user/enrolled-courses/${course._id}/lesson/${currentLesson._id}/mark-incomplete`
          );
          dispatch({
            type: 'LOGIN',
            payload: data.data
          });
          window.localStorage.setItem('user', JSON.stringify(data.data));
        }
      }
    }
    catch (error) {
      message.error(`Có lỗi khi đánh dấu đã xong/chưa xong. Chi tiết: ${error.message}`);
    }
  }

  const _setSidebarItems = async (ms) => {
    setSidebarItems(course?.lessons?.map(lesson => {
      const isCompleted = user?.courses?.find(item => item.courseId === course._id).completedLessons.includes(lesson._id);
      const iconStyles = {
        fontSize: '18px',
        cursor: currentLesson._id === lesson._id ? 'pointer' : 'no-drop'
      };

      return (
        <Menu.Item
          className={styles.container_sider_lessonlist_list_item}
          key={lesson._id}
          label={lesson.title}
          title={lesson.title}
        >
          <Space
            direction='horizontal'
            size='small'
            style={{ alignItems: 'flex-start' }}
          >
            <Tooltip
              title={
                currentLesson._id !== lesson._id
                  ? 'Hiện đang không ở bài học này'
                  : isCompleted
                    ? 'Đánh dấu chưa học'
                    : 'Đánh dấu đã học'
              }
            >
              <div
                className={styles.container_sider_lessonlist_list_item_iccheckcomplete}
                onClick={(event) => completionHandler(event, isCompleted, lesson._id)}
              >
                {
                  isCompleted
                    ? <CheckSquareFilled
                      style={iconStyles}
                    />
                    : <BorderOutlined
                      style={iconStyles}
                    />
                }
              </div>
            </Tooltip>
            <Space
              direction='vertical'
              size='0px'
            >
              <p>{lesson.title}</p>
              <Space
                size='small'
                style={{ lineHeight: '24px' }}
              >
                <PlaySquareOutlined style={{ fontSize: '16px' }} />
                <p>{lesson.duration}s</p>
              </Space>
            </Space>
          </Space>
        </Menu.Item>
      );
    }));
  }

  useEffect(() => {
    _setSidebarItems(500);
  }, [course, user]);

  return (
    <Layout
      className={styles.container}
    >
      <Sider
        className={styles.container_sider}
        theme='light'
        width={384}
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        <div
          className={styles.container_sider_header}
        >
          <p>Nội dung khóa học</p>
          <CloseOutlined style={{ fontSize: '16px' }} />
        </div>
        <div
          className='container_sider_lessonlist'
        >
          <Menu
            className={styles.container_sider_lessonlist_list}
            mode='vertical'
            selectedKeys={[currentLesson._id]}
            onClick={menuItemClickHandler}
          >
            {sidebarItems}
          </Menu>
        </div>
      </Sider>
      <Content
        className={styles.container_content}
        style={{
          margin: 0,
          minHeight: 'calc(100vh - 80px)'
        }}
      >
        <div
          className={styles.container_content_videosection}
          style={{
            backgroundColor: `${loading ? 'white' : '#1c1d1f'}`,
            border: `${loading ? '10px solid #1c1d1f' : 'none'}`
          }}
        >
          <div
            className={styles.container_content_videosection_video}
          >
            {
              loading
                ? (
                  <Spin
                    spinning={true}
                    size='large'
                    style={{
                      height: '756px',
                      textAlign: 'center',
                      display: 'flex',
                      width: 'inherit',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  />
                )
                : (
                  <div>
                    {PlyrPlayer}
                  </div>
                )
            }
          </div>
        </div>
        <div
          className={styles.container_content_bodysection}
          style={{ padding: '12px 24px' }}
        >
          <div
            className='container_content_bodysection_tabs_wrapper'
          >
            <Tabs
              className={styles.container_content_bodysection_tabs}
              items={tabItems}
              onChange={tabChangeHandler}
              type='card'
              style={{ transition: '0.3s' }}
            />
          </div>

          <div
            style={{ marginTop: '32px', opacity: '0.3' }}
          >
            <button onClick={() => setHide({ ...hide, courses: !hide.courses })}>{hide.courses ? 'Ẩn courses' : 'Hiện courses'}</button>
            <button onClick={() => setHide({ ...hide, lesson: !hide.lesson })}>{hide.lesson ? 'Ẩn lesson' : 'Hiện lesson'}</button>
            {hide.courses && <pre>{JSON.stringify(course, null, 4)}</pre>}
            {hide.lesson && <pre>{JSON.stringify(currentLesson, null, 4)}</pre>}
          </div>
        </div>

      </Content>
    </Layout>
  )
}

export default LearningRoute;

const TabOverview = ({ course, currentLesson }) => {
  const [isDesSeeMore, setIsDesSeeMore] = useState(false);

  return (
    <Space
      className={styles.container_content_bodysection_tabs_overview}
    >
      <div
        className={styles.container_content_bodysection_tabs_overview}
      >
        <div
          className={styles.container_content_bodysection_tabs_overview_lesson}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Bài học hiện tại</h2>
          <Descriptions
            bordered={true}
            style={{ marginTop: '20px' }}
          >
            <Descriptions.Item
              label={<b>Bài học</b>}
              labelStyle={{ width: '108px', backgroundColor: '#e9e9e9' }}
            >{currentLesson.title}</Descriptions.Item>
            <Descriptions.Item
              label={<b>Mô tả</b>}
              labelStyle={{ width: '108px', backgroundColor: '#e9e9e9' }}
            >{currentLesson.content}</Descriptions.Item>
          </Descriptions>
        </div>
        <hr style={{ margin: '24px 0px', borderColor: 'white' }} />
        <div
          className={styles.container_content_bodysection_tabs_overview_course}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Về khóa học</h2>
          <h3 style={{ marginTop: '16px', fontSize: '18px' }}><b>Tóm tắt</b></h3>
          <div
            className={styles.overview_course_summary}
          >
            <p>{course.summary}</p>
          </div>
          <h3 style={{ marginTop: '16px', fontSize: '18px' }}><b>Mô tả</b></h3>
          <div
            className={styles.overview_course_description}
            style={{ marginTop: '12px' }}
          >
            {
              isDesSeeMore
                ? <ReactMarkdown children={course?.description} disallowedElements={['h1', 'h2']} />
                : <ReactMarkdown children={course?.description?.substring(0, 500)} disallowedElements={['h1', 'h2']} />
            }
            {
              course?.description?.length > 300 && (
                <div>
                  <hr style={{ borderTop: '1px dashed grey' }} />
                  <label
                    style={{ fontSize: '16px', cursor: 'pointer', color: 'blueviolet' }}
                    onClick={() => setIsDesSeeMore(!isDesSeeMore)}
                  >...{isDesSeeMore ? 'Rút gọn' : 'Xem thêm'}</label>
                </div>
              )
            }
          </div>
        </div>
        <hr style={{ margin: '24px 0px', borderColor: 'white' }} />
        <Space
          className={styles.container_content_bodysection_tabs_overview_instructor}
          direction='vertical'
          size='small'
        >
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Về Instructor</h2>
          <Space
            className={styles.overview_instructor_wrapper}
            direction='vertical'
            size='middle'
          >
            <Space
              className={styles.overview_instructor_info}
              direction='horizontal'
              size='large'
              style={{ marginTop: '4px' }}
            >
              <div
                className={styles.overview_instructor_info_img}
              >
                <Image
                  src='/no-photo.png'
                  width='108px'
                  height='108px'
                  alt='instructor_avatar'
                  objectFit='cover'
                />
              </div>
              <Space
                className={styles.overview_instructor_info_personal}
                direction='vertical'
              >
                <p><b>{course?.instructor?.name}</b></p>
                <p>Chức danh......(bổ sung sau trên backend)</p>
              </Space>
            </Space>
            <Space
              className={styles.overview_instructor_social}
              direction='horizontal'
              size='middle'
            >
              <Link href='https://twitter.com/elonmusk'>
                <a target="_blank" rel="noopener noreferrer">
                  <div
                    className={styles.overview_instructor_social_item}
                  >
                    <TwitterOutlined />
                  </div>
                </a>
              </Link>
              <Link href='https://www.youtube.com/user/Apple'>
                <a target="_blank" rel="noopener noreferrer">
                  <div
                    className={styles.overview_instructor_social_item}
                  >
                    <YoutubeFilled />
                  </div>
                </a>
              </Link>
              <Link href='https://vn.linkedin.com/company/vng-corporation'>
                <a target="_blank" rel="noopener noreferrer">
                  <div
                    className={styles.overview_instructor_social_item}
                  >
                    <LinkedinFilled />
                  </div>
                </a>
              </Link>
            </Space>
          </Space>
        </Space>
      </div>
    </Space>
  )
}

const TabQA = ({ course, currentLesson }) => {

  return (
    <div
      className='container_content_bodysection_tabs_qa'
      style={{

      }}
    >
      tab q&a
    </div>
  )
}

const TabReview = ({ course, currentLesson }) => {

  return (
    <div
      className='container_content_bodysection_tabs_review'
      style={{

      }}
    >
      tab review
    </div>
  )
}