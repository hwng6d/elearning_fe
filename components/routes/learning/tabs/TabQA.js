import { useState, useEffect, useContext } from 'react';
import { Context } from '../../../../context';
import SearchBar from '../../../inputs/search/SearchBar';
import SelectBar from '../../../inputs/search/SelectBar';
import Image from 'next/image';
import { Button, Input, List, message, Popconfirm, Space, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import ModalAddQA from '../../../forms/ModalAddQA';
import styles from '../../../../styles/components/routes/learning/tabs/TabQA.module.scss';
import axios from 'axios';
import { setDelay } from '../../../../utils/setDelay'
import { EllipsisOutlined, EnterOutlined, LeftOutlined } from '@ant-design/icons';

const TabQA = ({ course, currentLesson, activeTab }) => {
  // states
  const [listQA, setListQA] = useState([]);
  const [loadingQADetail, setLoadingQADetail] = useState(false);
  const [qaDetailScreen, setQADetailScreen] = useState({ opened: false, qa: {} });
  const [search, setSearch] = useState({
    content: '',
    lessonId: 'all', // ['all', 'asdf-csdf-sdc']
    other: 'all', // ['all', 'currentuser_asked', 'without_reply']
  });
  const [newQA, setNewQA] = useState({ title: '', content: '' });
  const [modalAddQA, setModalAddQA] = useState({ opened: false, courseId: course?._id, lessonId: currentLesson?._id });

  //functions
  const onSearchClick = async () => {
    try {
      console.log('search: ', search);

      const queryString = new URLSearchParams(search).toString();

      const { data } = await axios.get(
        `/api/qa/course/${course?._id}?${queryString}`
      );

      setListQA(data.data);
    }
    catch (error) {
      message.error(`Có lỗi xảy ra khi tìm kiếm Q&A. Chi tiết: ${error.message}`);
    }
  }

  const onAddQAClick = () => {
    setModalAddQA({ ...modalAddQA, opened: true })
  }

  const onDetailQAClick = async (qa) => {
    setQADetailScreen({ ...qaDetailScreen, opened: true, qa });
  }

  const getQAsOfLesson = async () => {
    try {
      const { data } = await axios.get(`/api/qa/course/${course?._id}`);

      setListQA(data.data);

      return data.data;
    }
    catch (error) {
      message.error(`Có lỗi xảy ra khi lấy danh sách Q&A của bài học. Chi tiết: ${error.message}`)
    }
  }

  useEffect(() => {
    getQAsOfLesson();
  }, [activeTab === 'tab_qa'])

  return (
    <div>
      {
        !qaDetailScreen.opened
          ? (
            <div className={styles.tabs_qa}>
              <div
                className={styles.tabs_qa_header}
              >
                <div
                  className={styles.tabs_qa_header_top}
                >
                  <SearchBar
                    field='content'
                    value={search}
                    setValue={setSearch}
                    onSearchClick={onSearchClick}
                    styles={{ width: '100%', height: '40px' }}
                  />
                </div>
                <div
                  className={`${styles.tabs_qa_header_bottom} ${styles.d_flex_col}`}
                >
                  <p><b>Bộ lọc</b></p>
                  <div className={styles.d_flex_row}>
                  <SelectBar
                    field='lessonId'
                    value={search}
                    setValue={setSearch}
                    options={[
                      {
                        value: 'all',
                        label: 'Tất cả bài học'
                      },
                      {
                        value: currentLesson._id,
                        label: 'Bài học hiện tại'
                      }
                    ]}
                    styles={{ width: '50%', height: '40px' }}
                  />
                  <SelectBar
                    field='other'
                    value={search}
                    setValue={setSearch}
                    options={[
                      {
                        value: 'all',
                        label: 'Tất cả'
                      },
                      {
                        value: 'currentuser_asked',
                        label: 'Những Q&A đã hỏi'
                      },
                      {
                        value: 'without_reply',
                        label: 'Những Q&A chưa có trả lời'
                      }
                    ]}
                    styles={{ width: '50%', height: '40px' }}
                  />
                  </div>
                </div>
              </div>
              <div
                className={styles.tabs_qa_body}
                direction='vertical'
                size='middle'
              >
                <div
                  className={styles.tabs_qa_body_create}
                >
                  <h2 className={styles.h2}><b>Các QA</b></h2>
                  <p
                    className={styles.p}
                    onClick={() => onAddQAClick()}
                    style={{ cursor: 'pointer', marginTop: '12px' }}
                  ><b>Tạo QA ở bài học này</b></p>
                  <List
                    className={styles.tabs_qa_body_create_list}
                    itemLayout='vertical'
                    dataSource={listQA}
                    split={true}
                    renderItem={(qa) => (
                      <List.Item
                        className={styles.tabs_qa_body_create_list_item}
                        key={qa._id}
                        onClick={() => onDetailQAClick(qa)}
                      >
                        <Space
                          className={styles.create_list_item_detail}
                          size='large'
                          direction='horizontal'
                        >
                          <Space
                            className={styles.create_list_item_detail_left}
                          >
                            <div style={{ width: '44px', height: '44px' }}>
                              <Image
                                src={'/user_default.svg'}
                                width={64}
                                height={64}
                                alt='avatar'
                                style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
                              />
                            </div>
                          </Space>
                          <Space
                            className={styles.create_list_item_detail_right}
                            direction='vertical'
                            size={0}
                          >
                            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{qa?.title}</h3>
                            <p style={{ marginTop: '8px' }}>{qa.content.slice(0, 150)} ...</p>
                            <Space direction='horizontal' size='middle' style={{ marginTop: '8px' }}>
                              <p style={{ color: '#401b9c', textDecoration: 'underline' }}>{qa?.user?.name}</p>
                              <p><i>{dayjs(qa?.updatedAt).format('DD/MM/YYYY')}</i></p>
                            </Space>
                          </Space>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
              </div>

              {
                modalAddQA.opened && (
                  <ModalAddQA
                    modalAddQA={modalAddQA}
                    setModalAddQA={setModalAddQA}
                    newQA={newQA}
                    setNewQA={setNewQA}
                    currentLesson={currentLesson}
                    getQAsOfLesson={getQAsOfLesson}
                  />
                )
              }
            </div>
          )
          : (
            <QADetail
              loading={loadingQADetail}
              course={course}
              qaDetailScreen={qaDetailScreen}
              setQADetailScreen={setQADetailScreen}
              getQAsOfLesson={getQAsOfLesson}
            />
          )
      }
    </div>
  )
}

const QADetail = ({
  loading,
  course,
  qaDetailScreen,
  setQADetailScreen,
  getQAsOfLesson
}) => {
  // global context
  const { state: { user } } = useContext(Context);

  // variables
  const { qa } = qaDetailScreen;
  const lessonInfo = qa?.course?.lessons.find(_ => _?._id === qa?.lessonId);
  const sectionInfo = qa?.course?.sections?.find(_ => _._id === lessonInfo?.section);

  // states
  const [currentQA, setCurrentQA] = useState({ title: qa?.title, content: qa?.content });
  const [newReply, setNewReply] = useState({ content: '', replyQAId: qa?._id });
  const [isQAEditing, setIsQAEditing] = useState(false);
  const [listReply, setListReply] = useState([]);
  const [isReplyQAEditing, setIsReplyQAEditing] = useState({ state: false, replyQAId: '' });
  const [replyQAEditing, setReplyQAEditing] = useState('');

  // functions
  const onCancelEditingClick = () => {
    setIsQAEditing(false);
    setCurrentQA({ ...currentQA, title: qa?.title, content: qa?.content });
  }

  const onReplySubmit = async () => {
    try {
      console.log('newReply', newReply);

      if (newReply.content.length) {
        await axios.post(
          `/api/qa/course/${course?._id}/lesson/${qa?.lessonId}`,
          { qa: newReply }
        );

        setNewReply({ ...newReply, content: '' });
        getQAReplies();
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi phản hồi Q&A. Chi tiết: ${error.message}`)
    }
  }

  const onSubmitEditQAClick = async () => {
    try {
      await axios.put(
        `/api/qa/course/${course?._id}/lesson/${qa?.lessonId}/${qa?._id}/update`,
        { qa: currentQA }
      );

      const listQAsOfLesson = await getQAsOfLesson();
      const [currTitle, currContent] = [listQAsOfLesson.find(_ => _._id === qa?._id).title, listQAsOfLesson.find(_ => _._id === qa?._id).content];
      setCurrentQA({ ...currentQA, title: currTitle, content: currContent });
      setQADetailScreen({ ...qaDetailScreen, qa: listQAsOfLesson.find(_ => _._id === qa?._id) })
      getQAReplies();
      setIsQAEditing(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi chỉnh sửa Q&A. Chi tiết: ${error.message}`)
    }
  }

  const onCancelReplyQAEditingClick = (reply) => {
    setIsReplyQAEditing({...isReplyQAEditing, state: false, replyQAId: ''});
    setReplyQAEditing(reply.content);
  }

  const onReplyQAEditClick = (reply) => {
    setIsReplyQAEditing({ ...isReplyQAEditing, state: true, replyQAId: reply?._id });
    setReplyQAEditing(reply?.content);
  }

  const onSubmiReplyQAtEditQAClick = async (reply) => {
    try {
      await axios.put(
        `/api/qa/course/${course?._id}/lesson/${reply?.lessonId}/${reply?._id}/update`,
        { qa: { content: replyQAEditing } }
      );

      getQAReplies();
      setIsReplyQAEditing({...isReplyQAEditing, state: false, replyQAId: ''});
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi chỉnh sửa phản hồi Q&A. Chi tiết: ${error.message}`)
    }
  }

  const onDeleteQAClick = async () => {
    try {
      await axios.put(
        `/api/qa/course/${course?._id}/lesson/${qa?.lessonId}/${qa?._id}/delete`
      );

      setQADetailScreen({ ...qaDetailScreen, opened: false });
      getQAsOfLesson();
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi xóa Q&A. Chi tiết: ${error.message}`)
    }
  }

  const onDeleteReplyQAClick = async (reply) => {
    try {
      await axios.put(
        `/api/qa/course/${course?._id}/lesson/${reply?.lessonId}/${reply?._id}/delete`
      );

      getQAReplies();
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi phản hồi của Q&A. Chi tiết: ${error.message}`)
    }
  }

  const getQAReplies = async () => {
    try {
      const { data } = await axios.get(
        `/api/qa/course/${course?._id}/qa/${qa?._id}`
      );

      setListReply(data.data);

      return data.data;
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi lấy danh sách phản hồi của Q&A hiện tại. Chi tiết: ${error.message}`)
    }
  }

  useEffect(() => {
    getQAReplies();
  }, [qaDetailScreen.opened === true])

  return (
    <div className={styles.tabs_qadetail}>
      <div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', width: '1152px' }}>
        <div className={styles.tabs_qadetail_top}>
          <Button
            className={styles.tabs_qadetail_top_button}
            onClick={() => setQADetailScreen({ ...qaDetailScreen, opened: false, qa: {} })}
          >
            <Space style={{ alignItems: 'center', fontSize: '15px', paddingRight: '8px', color: '#2a2b2e' }}>
              <LeftOutlined style={{ fontSize: '13px' }} />
              Quay lại
            </Space>
          </Button>
        </div>
        <div className={styles.tabs_qadetail_body}>
          <div
            className={`${styles.tabs_qadetail_body_question} ${styles.d_flex_row}`}
          >
            <div
              className={styles.tabs_qadetail_body_question_left}
            >
              <div style={{ width: '44px', height: '44px' }}>
                <Image
                  src={'/user_default.svg'}
                  width={64}
                  height={64}
                  alt='avatar'
                  style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div
              className={`${styles.tabs_qadetail_body_question_right} ${styles.d_flex_col}`}
            >
              <div
                className={styles.d_flex_row}
                style={{ justifyContent: 'space-between' }}
              >
                {
                  !isQAEditing
                    ? (
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{currentQA?.title}</h3>
                      </div>
                    )
                    : (
                      <div style={{ width: '100%' }}>
                        <p><b>Tiêu đề</b></p>
                        <Input
                          value={currentQA?.title}
                          onChange={(e) => setCurrentQA({ ...currentQA, title: e.target.value })}
                          style={{
                            marginTop: '8px',
                            borderColor: '#686868',
                            borderWidth: '2px'
                          }}
                        />
                      </div>
                    )
                }
                {
                  user._id === qa?.userId && (
                    <Tooltip
                      title={
                        <div className={styles.d_flex_col} style={{ gap: '4px' }}>
                          <p
                            style={{ padding: '4px 12px', cursor: 'pointer' }}
                            onClick={() => setIsQAEditing(true)}
                          ><b>Chỉnh sửa</b></p>
                          <Popconfirm
                            title='Bạn có chắc muốn xóa Q&A này ?'
                            cancelText='Hủy'
                            okText='Đồng ý'
                            onConfirm={onDeleteQAClick}
                          >
                            <p style={{ padding: '4px 12px', cursor: 'pointer' }}><b>Xóa</b></p>
                          </Popconfirm>
                        </div>
                      }
                      trigger='click'
                    >
                      <EllipsisOutlined style={{ fontSize: '20px', transform: 'rotate(90deg)', cursor: 'pointer' }} />
                    </Tooltip>
                  )
                }
              </div>
              <Space direction='horizontal' size='middle' style={{ marginTop: '8px' }}>
                <p style={{ color: '#401b9c', textDecoration: 'underline' }}>{qa?.user?.name}</p>
                <p><b>Chương {sectionInfo?.index} - {sectionInfo?.name} | Bài học {lessonInfo?.index} - {lessonInfo?.title}</b></p>
                <p><i>{dayjs(qa?.updatedAt).format('DD/MM/YYYY')}</i></p>
              </Space>
              {
                !isQAEditing
                  ? (
                    <p style={{ marginTop: '12px' }}>{currentQA?.content}</p>
                  )
                  : (
                    <div style={{ marginTop: '8px', width: '100%' }}>
                      <p><b>Nội dung</b></p>
                      <Input.TextArea
                        value={currentQA?.content}
                        onChange={(e) => setCurrentQA({ ...currentQA, content: e.target.value })}
                        style={{
                          marginTop: '8px',
                          borderColor: '#686868',
                          borderWidth: '2px',
                          height: 'fit-content',
                          height: `${currentQA.content.length <= 308
                            ? '60px' : currentQA.content.length <= 623
                              ? '108px' : currentQA.content.length <= 886
                                ? '136px' : currentQA.content.length <= 1087
                                  ? '172px' : '288px'
                            }`
                        }}
                      />
                    </div>
                  )
              }
              {
                isQAEditing && (
                  <div
                    className={styles.d_flex_row}
                    style={{ justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}
                  >
                    <Button
                      onClick={onCancelEditingClick}
                    >Hủy</Button>
                    <Popconfirm
                      title='Bạn có muốn chỉnh sửa Q&A này ?'
                      cancelText='Hủy'
                      okText='Đồng ý'
                      onConfirm={onSubmitEditQAClick}
                    >
                      <Button
                        type='primary'
                        style={{ backgroundColor: '#333333', color: 'white', borderColor: '#333333' }}
                      >Đồng ý</Button>
                    </Popconfirm>
                  </div>
                )
              }
            </div>
          </div>
          <div className={styles.tabs_qadetail_body_answer}>
            <div className={styles.tabs_qadetail_body_answer_list}>
              <p style={{ fontSize: '15px' }}><b>{listReply?.length} đã trả lời</b></p>
              <List
                className={styles.tabs_qadetail_body_answer_list_wrapper}
                dataSource={listReply}
                renderItem={(reply) => {
                  return (
                    <List.Item
                      key={reply._id}
                      className={`${styles.answer_list_wrapper_item} ${styles.d_flex_row}`}
                    >
                      <div
                        className={`${styles.answer_list_wrapper_item_left} ${styles.d_flex_row}`}
                      >
                        <div style={{ width: '40px', height: '40px' }}>
                          <Image
                            src={'/user_default.svg'}
                            width={64}
                            height={64}
                            alt='avatar'
                            style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                      <div
                        className={`${styles.answer_list_wrapper_item_right} ${styles.d_flex_col}`}
                        direction='vertical'
                        size={0}
                      >
                        <div className={styles.d_flex_row} style={{ marginTop: '8px' }}>
                          <p style={{ color: '#401b9c', fontSize: '16px' }}>{reply?.user?.name}</p>
                          <p><i>{dayjs(reply?.updatedAt).format('DD/MM/YYYY')}</i></p>
                          {
                            user._id === reply?.userId && (
                              <Tooltip
                                title={
                                  <div className={styles.d_flex_col} style={{ gap: '4px' }}>
                                    <p
                                      style={{ padding: '4px 12px', cursor: 'pointer' }}
                                      onClick={() => onReplyQAEditClick(reply)}
                                    ><b>Chỉnh sửa</b></p>
                                    <Popconfirm
                                      title='Bạn có chắc muốn xóa phản hồi này ?'
                                      cancelText='Hủy'
                                      okText='Đồng ý'
                                      onConfirm={() => onDeleteReplyQAClick(reply)}
                                    >
                                      <p style={{ padding: '4px 12px', cursor: 'pointer' }}><b>Xóa</b></p>
                                    </Popconfirm>
                                  </div>
                                }
                                trigger='click'
                              >
                                <EllipsisOutlined style={{ fontSize: '18px', transform: 'rotate(90deg)', cursor: 'pointer' }} />
                              </Tooltip>
                            )
                          }
                        </div>
                        {
                          (!isReplyQAEditing.state || reply._id !== isReplyQAEditing.replyQAId)
                            ? (
                              <p style={{ marginTop: '4px' }}>{reply?.content}</p>
                            )
                            : (
                              <Input.TextArea
                                value={replyQAEditing}
                                onChange={(e) => setReplyQAEditing(e.target.value)}
                                style={{
                                  marginTop: '8px',
                                  borderColor: '#686868',
                                  borderWidth: '2px',
                                  height: 'fit-content',
                                  height: `${currentQA.content.length <= 308
                                    ? '60px' : currentQA.content.length <= 623
                                      ? '108px' : currentQA.content.length <= 886
                                        ? '136px' : currentQA.content.length <= 1087
                                          ? '172px' : '288px'
                                    }`
                                }}
                              />
                            )
                        }
                        {
                          !(!isReplyQAEditing.state || reply._id !== isReplyQAEditing.replyQAId) && (
                            <div
                              className={styles.d_flex_row}
                              style={{ justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}
                            >
                              <Button
                                onClick={() => onCancelReplyQAEditingClick(reply)}
                              >Hủy</Button>
                              <Popconfirm
                                title='Bạn có muốn chỉnh sửa Q&A này ?'
                                cancelText='Hủy'
                                okText='Đồng ý'
                                onConfirm={() => onSubmiReplyQAtEditQAClick(reply)}
                              >
                                <Button
                                  type='primary'
                                  style={{ backgroundColor: '#333333', color: 'white', borderColor: '#333333' }}
                                >Đồng ý</Button>
                              </Popconfirm>
                            </div>
                          )
                        }
                      </div>
                    </List.Item>
                  )
                }}
              />
            </div>
            <div className={styles.tabs_qadetail_body_answer_newreply}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px' }}>
                  <Image
                    src={'/user_default.svg'}
                    width={64}
                    height={64}
                    alt='avatar'
                    style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <Input
                    placeholder='Nhập phản hồi...'
                    value={newReply.content}
                    onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
                    suffix={
                      <EnterOutlined
                        style={{ fontSize: '18px', cursor: 'pointer', color: `${newReply.content.length ? 'black' : '#bbbbbb'}` }}
                        onClick={() => onReplySubmit()}
                      />
                    }
                    style={{ borderColor: '#b0b7bf', height: '40px', width: '100%', borderWidth: '2px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabQA;