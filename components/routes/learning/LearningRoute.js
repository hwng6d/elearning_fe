import React, { useState, useEffect, useMemo, useContext } from "react";
import { useRouter } from "next/router";
import { Context } from "../../../context/index";
import { Layout, Menu, Space, Spin, Tabs, message, Tooltip, Breadcrumb, Radio, Button } from 'antd';
const { Content, Sider } = Layout;
import Plyr from "plyr-react";
import Link from "next/link";
import {
  CloseOutlined,
  CheckSquareFilled,
  BorderOutlined,
  PlayCircleFilled,
  TrophyFilled,
  LeftOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import Image from "next/image";
import styles from '../../../styles/components/routes/learning/LearningRoute.module.scss';
import axios from "axios";
import TabOverview from './tabs/TabOverview'
import TabQA from './tabs/TabQA'
import TabReview from './tabs/TabReview'

const LearningRoute = ({ loading, course, currentLesson }) => {
  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // router
  const router = useRouter();
  const { lessonId } = router.query;

  // states
  const [hide, setHide] = useState({ courses: false, lesson: false });
  const [sidebarItems, setSidebarItems] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [activeTab, setActiveTab] = useState('tab_overview');
  const [isQuizScreen, setIsQuizScreen] = useState({ opened: false, quiz: {} });
  const [quizAnswered, setQuizAnswered] = useState(0) //index
  const [quizResult, setQuizResult] = useState({ status: 'waiting', message: '' }) //state: ['waiting', true, false]

  // variables
  const tabItems = useMemo(() => {
    return [
      {
        label: <p style={{ fontSize: '15px', fontWeight: '600', color: '#6a6f73' }}>Tổng quan</p>,
        key: 'tab_overview',
        children: <TabOverview course={course} currentLesson={currentLesson} activeTab={activeTab} />
      },
      {
        label: <p style={{ fontSize: '15px', fontWeight: '600', color: '#6a6f73' }}>Q&A</p>,
        key: 'tab_qa',
        children: <TabQA course={course} currentLesson={currentLesson} activeTab={activeTab} />
      },
      {
        label: <p style={{ fontSize: '15px', fontWeight: '600', color: '#6a6f73' }}>Review</p>,
        key: 'tab_review',
        children: <TabReview course={course} currentLesson={currentLesson} activeTab={activeTab} />
      }
    ]
  }, [course]);

  // components
  const PlyrPlayer = useMemo(() => {
    return (
      <div>
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
      </div>
    )
  }, [currentLesson]);

  // functions
  const menuItemClickHandler = ({ item, key }) => {
    setIsQuizScreen({ ...isQuizScreen, opened: false, quiz: {} });
    setQuizResult({ ...quizResult, status: 'waiting', message: '' });
    setQuizAnswered('');
    setActiveTab('tab_overview');
    router.push(`/user/courses/${course?.slug}/lesson/${key}`);
  }

  const tabChangeHandler = (activeKey) => {
    console.log('activeKey: ', activeKey);
    setActiveTab(activeKey);
  }

  const onKeyOpenChange = (keys) => {
    const deleteUndefined = keys.filter(key => key);
    setOpenKeys(deleteUndefined)
  }

  const getABCDAnswer = (index) => {
    let result = '';
    ['A', 'B', 'C', 'D'].forEach((letter, _index) => { if (_index + 1 === index) result = letter });
    return result;
  }

  const onDoQuizClick = (event, lessonId, quizId) => {
    event.stopPropagation();

    if (user._id === course?.instructor?._id) {
      const quiz = course?.quizzes?.find(quiz => quiz?._id === quizId);
      setIsQuizScreen({ ...quizId, opened: true, quiz });
    } else {
      if (!user.courses.find(_ => _.courseId === course?._id).completedLessons.includes(lessonId)) {
        message.error('Hãy hoàn thành việc học trước khi làm bài quiz');
        return;
      }

      const quiz = course?.quizzes?.find(quiz => quiz?._id === quizId);
      setIsQuizScreen({ ...quizId, opened: true, quiz });
    }
  }

  const onSubmitQuizClick = async (event, quizId) => {
    try {
      event.stopPropagation();
      console.log('quizAnswered: ', quizAnswered);

      const { data: result } = await axios.post(
        `/api/user/quiz-answer/${course?._id}/${quizId}`,
        { quiz: { index: quizAnswered } }
      );
      if (result.success) {
        setQuizResult({ ...quizResult, status: true, message: 'Bạn đã trả lời đúng, hãy đến bài học tiếp theo.' });

        dispatch({
          type: 'LOGIN',
          payload: result.data
        });
        window.localStorage.setItem('user', JSON.stringify(result.data));
      } else {
        setQuizResult({ ...quizResult, status: false, message: 'Bạn đã trả lời sai, hãy thử lại.' });

        dispatch({
          type: 'LOGIN',
          payload: result.data
        });
        window.localStorage.setItem('user', JSON.stringify(result.data));
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi nộp bài. Chi tiết: ${error.message}`);
    }
  }

  const completionHandler = async (event, isCompleted, lessonId) => {
    try {
      event.stopPropagation();
      console.log('currentLesson: ', currentLesson._id);
      console.log(`lessonName|lessonId: ${course?.lessons?.find(_ => _._id === lessonId)?.title}|${lessonId}`)

      if (currentLesson._id === lessonId) {
        if (!isCompleted) {  //user want to mark lesson to be completed
          const { data } = await axios.post(
            `/api/user/enrolled-courses/${course?._id}/lesson/${currentLesson._id}/mark-complete`
          );
          dispatch({
            type: 'LOGIN',
            payload: data.data
          });
          window.localStorage.setItem('user', JSON.stringify(data.data));
          setIsQuizScreen({ ...isQuizScreen, opened: false, quiz: {} });
        } else {  //user want to mark lesson to be incompleted
          const { data } = await axios.post(
            `/api/user/enrolled-courses/${course?._id}/lesson/${currentLesson._id}/mark-incomplete`
          );
          dispatch({
            type: 'LOGIN',
            payload: data.data
          });
          window.localStorage.setItem('user', JSON.stringify(data.data));
          setQuizAnswered('');
          setQuizResult({ ...quizResult, status: 'waitin', message: '' })
          setIsQuizScreen({ ...isQuizScreen, opened: false, quiz: {} });
        }
      }
    }
    catch (error) {
      message.error(`Có lỗi khi đánh dấu đã xong/chưa xong. Chi tiết: ${error.message}`);
    }
  }

  const __setSidebarItems = async (ms) => {
    const currentSection = course?.lessons?.find(lesson => lesson?._id === lessonId)?.section;
    setOpenKeys([...openKeys, currentSection?._id]);

    setSidebarItems(course?.sections?.map(section => {
      let totalLessons = 0, totalDuration = 0;
      course?.lessons?.forEach(lesson => {
        if (lesson?.section?._id === section?._id) {
          totalLessons += 1;
          totalDuration += lesson?.duration || 0;
        }
      });

      return (
        <Menu.SubMenu
          className={`${styles.container_sider_lessonlist_itemsection} container_learninglist`}
          key={section?._id}
          title={
            <Space size={8} direction="vertical" style={{ lineHeight: '28px' }}>
              <Tooltip title={section?.name}>
                <p><b>Chương {section?.index}: {section?.name}</b></p>
              </Tooltip>
              <Space size={8} direction='horizontal' split='|' style={{ lineHeight: '20px' }}>
                <p>0/{totalLessons}</p>
                <p>{totalDuration}s</p>
              </Space>
            </Space>
          }
        >
          {
            course?.lessons?.map(lesson => {
              if (lesson?.section?._id === section?._id) {
                const isCompleted = user?.courses?.find(item => item?.courseId === course?._id)?.completedLessons?.includes(lesson._id);
                const isQuiz = course?.quizzes?.findIndex(quiz => quiz.lesson === lesson._id);
                const quiz = isQuiz < 0 ? undefined : course?.quizzes[isQuiz];
                const completeIconStyles = {
                  fontSize: '18px',
                  cursor: currentLesson._id === lesson._id ? 'pointer' : 'no-drop'
                };

                return (
                  <Menu.Item
                    className={styles.container_sider_lessonlist_itemlesson}
                    key={lesson._id}
                    label={lesson.title}
                    title={lesson.title}
                  >
                    <div
                      className={styles.container_sider_lessonlist_itemlesson_wrapper}
                      direction='horizontal'
                    >
                      {
                        user?._id !== course?.instructor?._id && (
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
                              onClick={(event) => completionHandler(event, isCompleted, lesson._id)}
                            >
                              {
                                isCompleted
                                  ? <CheckSquareFilled
                                    style={completeIconStyles}
                                  />
                                  : <BorderOutlined
                                    style={completeIconStyles}
                                  />
                              }
                            </div>
                          </Tooltip>
                        )
                      }
                      <div
                        style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                      >
                        <p>{lesson.title}</p>
                        <div
                          style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PlayCircleFilled style={{ fontSize: '16px', color: '#313131' }} />
                            <p>{lesson.duration}s</p>
                          </div>
                          {
                            quiz && (
                              <Tooltip title={`${user._id === course?.instructor._id ? 'Xem quiz' : 'Làm bài quiz'}`}>
                                <div
                                  className={styles.container_sider_lessonlist_itemlesson_infoquiz}
                                  style={{ gap: '12px' }}
                                  onClick={(event) => onDoQuizClick(event, lesson._id, quiz._id)}
                                >
                                  <TrophyFilled style={{}} />
                                  <p>
                                    {`${user._id === course?.instructor._id ? 'Xem quiz' : `Let's quiz`}`}
                                  </p>
                                  {
                                    user?.courses?.find(_ => _?.courseId === course?._id)?.completedQuizzes?.includes(quiz._id) && (
                                      <CheckOutlined style={{ color: 'green', fontSize: '18px' }} />
                                    )
                                  }
                                </div>
                              </Tooltip>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </Menu.Item>
                )
              }
            })
          }
        </Menu.SubMenu>
      )
    }))
  }

  useEffect(() => {
    __setSidebarItems();
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
          <CloseOutlined
            style={{ fontSize: '16px' }}
          />
        </div>
        <div
          className='container_sider_lessonlist'
        >
          <Menu
            className={styles.container_sider_lessonlist_list}
            mode='inline'
            openKeys={openKeys}
            selectedKeys={lessonId}
            onOpenChange={onKeyOpenChange}
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
        {/* video / quiz section */}
        <div
          className={styles.container_content_videosection}
          style={{
            backgroundColor: `${(loading || isQuizScreen.opened) ? 'white' : '#1c1d1f'}`,
            border: `${(loading || isQuizScreen.opened) ? '10px solid #1c1d1f' : 'none'}`
          }}
        >
          {
            isQuizScreen.opened
              ? (
                // quiz
                <div
                  className={styles.container_content_videosection_quiz}
                >
                  <div
                    className={styles.container_content_videosection_quiz_header}
                  >
                    <Space direction="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Breadcrumb>
                        <Breadcrumb.Item>
                          <b>{`Chương ${course?.lessons?.find(_ => _._id === lessonId)?.section?.index} - Bài ${course?.lessons?.find(_ => _._id === lessonId)?.index}`}</b>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item><b>Quiz</b></Breadcrumb.Item>
                      </Breadcrumb>
                      <Space>
                        <LeftOutlined />
                        <p
                          style={{ cursor: 'pointer', color: '#262626' }}
                          onClick={() => setIsQuizScreen({ ...isQuizScreen, opened: false, quiz: {} })}
                        >
                          <b>Quay lại bài học</b>
                        </p>
                      </Space>
                    </Space>
                    <p style={{ marginTop: '8px' }}><b>{course?.lessons?.find(_ => _._id === lessonId)?.title}</b></p>
                  </div>
                  <hr style={{ margin: '16px 0px' }} />
                  <div
                    className={styles.container_content_videosection_quiz_body}
                  >
                    <p><b>Câu hỏi:</b></p>
                    <p style={{ marginTop: '8px', padding: '0px 8px' }}>{isQuizScreen.quiz.question}</p>
                    <p style={{ marginTop: '12px' }}><b>Các lựa chọn:</b></p>
                    <Radio.Group
                      value={quizAnswered}
                      disabled={quizResult.status === true || user._id === course?.instructor?._id}
                      onChange={(e) => setQuizAnswered(e.target.value)}
                      style={{ marginTop: '12px', padding: '0px 8px', display: 'grid', gap: '20px' }}
                    >
                      {isQuizScreen.quiz.answer.map(item => {
                        return (
                          <Radio key={item._id} value={item.index}>
                            <p><b>{`${String.fromCharCode(64 + item.index)}. `}</b>{item.value}</p>
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                    {
                      user._id === course?.instructor?._id && (
                        <div>
                          <p style={{ marginTop: '12px' }}><b>Đáp án:</b></p>
                          <p>
                            {getABCDAnswer(course?.quizzes?.find(_ => _.lesson === lessonId)?.correctAnswer?.find(_ => _.value === true)?.index)}
                          </p>
                        </div>
                      )
                    }
                    {
                      user._id !== course?.instructor?._id && <div
                        className={styles.container_content_videosection_quiz_body_submit}
                        style={{ marginTop: '16px' }}
                      >
                        <Button
                          className={styles.quiz_body_submit_button}
                          type='primary'
                          disabled={quizResult.status === true}
                          onClick={(e) => onSubmitQuizClick(e, isQuizScreen.quiz._id)}
                        >Nộp bài</Button>
                      </div>
                    }
                    <div
                      className={styles.container_content_videosection_quiz_body_resultmessage}
                    >
                      {
                        quizResult.status === false
                          ? <p style={{ marginTop: '12px', fontSize: '15px', color: 'red', fontWeight: '600' }}>Rất tiếc, bạn đã trả lời sai</p>
                          : quizResult.status === true
                            ? <p style={{ marginTop: '12px', fontSize: '15px', color: 'green', fontWeight: '600' }}>Chính xác, bạn có thể di chuyển đến bài học tiếp theo</p>
                            : null
                      }
                    </div>
                    <hr style={{ margin: '16px 0px' }} />
                    <p style={{ fontSize: '14px' }}><b>Chú ý:</b> Để xem được bài học tiếp theo, bạn phải hoàn thành bài quiz</p>
                  </div>
                </div>
              )
              : (
                // video
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
              )
          }
        </div>

        {/* body section */}
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
              defaultActiveKey='tab_overview'
              activeKey={activeTab}
              onChange={tabChangeHandler}
              type='card'
            />
          </div>
        </div>

      </Content>
    </Layout>
  )
}

export default LearningRoute;