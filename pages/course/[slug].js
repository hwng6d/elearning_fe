import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Context } from "../../context";
import Link from "next/link";
import {
  Space,
  Tag,
  List,
  Button,
  BackTop,
  Tooltip,
  Popconfirm,
  message,
  Spin,
  Menu,
  Rate,
  Progress,
} from "antd";
import axios from "axios";
import {
  CheckOutlined,
  CompressOutlined,
  GlobalOutlined,
  HeartFilled,
  PlayCircleFilled,
  PlaySquareOutlined,
  ReadOutlined,
  WifiOutlined,
  DashOutlined,
  RightOutlined,
} from "@ant-design/icons";
import ReactMarkdown from 'react-markdown';
import Image from "next/image";
import ModalFreePreview from "../../components/forms/ModalFreePreview";
import ModalShowReviews from "../../components/forms/ModalShowReviews";
import { setDelay } from "../../utils/setDelay";
import { loadStripe } from "@stripe/stripe-js";
import dayjs from "dayjs";
import styles from '../../styles/course/[slug].module.scss';


const SingleCourseView = ({ course }) => {
  // router
  const router = useRouter();

  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // states
  const [isDesSeeMore, setIsDesSeeMore] = useState(false);
  const [isFreePreview, setIsFreePreview] = useState({ opened: false, which: {} });
  const [isAllReview, setIsAllReview] = useState({ opened: false, which: '' })  // which: courseId
  const [listReview, setListReview] = useState({ total: [], list: [] });
  const [menuItems, setMenuItems] = useState([]);
  const [enrolled, setEnrolled] = useState({});
  const [msg, setMsg] = useState('');

  // variables
  // var. calculate total of all videos duration
  let totalDuration = 0;
  course?.lessons?.forEach(lesson => totalDuration += lesson?.duration);

  // functions
  const calculateAverage = (array) => array.reduce((p, c) => p + c, 0) / array.length;

  const onShowAllReviewClick = () => {
    setIsAllReview({ ...isAllReview, opened: true, which: course?._id })
  }

  const paidEnrollmentHandler = async () => {
    try {
      if (!user) {
        router.push('/signin');
        return;
      }

      if (enrolled?.success) {
        message.info('Bạn đã tham gia khóa học này');
        return;
      }

      if (user._id === course?.instructorInfo?._id) {
        message.info('Bạn hiện là Instructor của khóa học này');
        return;
      }

      setMsg('Đang thực hiện...');
      await setDelay(3000);
      const { data } = await axios.post(`/api/user/enrollment/paid/${course?._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
      stripe.redirectToCheckout({ sessionId: data.data.id });
    }
    catch (error) {
      message.error(`Có lỗi xảy ra, hãy thử lại\nChi tiết: ${error.message}`);
    }
  }

  const freeEnrollmentHandler = async () => {
    try {
      if (!user)
        router.push('/signin')

      if (enrolled?.success) {
        message.info('Bạn đã tham gia khóa học này');
        return;
      }

      if (user._id === course?.instructor?._id) {
        message.info('Bạn hiện là Instructor của khóa học này');
        return;
      }

      setMsg('Đang thực hiện...');
      await setDelay(3000);
      const { data } = await axios.post(`/api/user/enrollment/free/${course?._id}`);
      dispatch({
        type: 'LOGIN',
        payload: data.data
      });
      window.localStorage.setItem('user', JSON.stringify(data.data));
      setMsg('Đã xong');
      await setDelay(2000);
      setMsg('');
      message.success('Tham gia khóa học thành công !')
    }
    catch (error) {
      message.error(`Có lỗi xảy ra, hãy thử lại\nChi tiết: ${error.message}`);
    }
  }

  const checkEnrolled = async () => {
    const { data } = await axios.post(`/api/user/check-enrollment/${course?._id}`);
    setEnrolled({ ...enrolled, data: data.data });
  }

  const getReviewsOfCourse = async () => {
    try {
      const { data } = await axios.get(`/api/review/public/course/${course?._id}`);

      setListReview({ ...listReview, total: data.data.total, list: data.data.list });
    }
    catch (error) {
      message.error(`Lấy danh sách review của khóa học lỗi. Chi tiết: ${error.message}`);
    }
  }

  const _setMenuItems = () => {
    setMenuItems(course?.sections?.map(section => {
      let totalLessons = 0, totalDuration = 0;
      course?.lessons?.forEach(lesson => {
        if (lesson?.section?._id === section?._id) {
          totalLessons += 1;
          totalDuration += lesson?.duration || 0;
        }
      });

      return (
        <Menu.SubMenu
          className={`${styles.container_body_wrapper_courseoutline_list_section} container_learninglist public_view`}
          key={section?._id}
          title={
            <div
              className={styles.d_flex_row}
              style={{ justifyContent: 'space-between', padding: '0px 16px 0px 8px', lineHeight: '48px' }}
            >
              <Tooltip title={section?.name}>
                <p><b>Chương {section?.index}: {section?.name}</b></p>
              </Tooltip>
              <Space size={8} direction='horizontal' split='|' style={{ lineHeight: '48px' }}>
                <p><b>{totalLessons} bài học</b></p>
                <p><b>{totalDuration}s</b></p>
              </Space>
            </div>
          }
        >
          {
            course?.lessons?.map(lesson => {
              if (lesson?.section?._id === section?._id) {
                return (
                  <Menu.Item
                    className={styles.courseoutline_list_section_lesson}
                    key={lesson._id}
                    label={lesson.title}
                    title={lesson.title}
                  >
                    <div
                      className={`${styles.courseoutline_list_section_lesson_wrapper} ${styles.d_flex_row}`}
                      style={{ justifyContent: 'space-between' }}
                    >
                      <p
                        onClick={() => setIsFreePreview({ ...isFreePreview, opened: true, which: lesson })}
                        style={{
                          color: `${lesson.free_preview ? '#5624d0' : '#000000'}`,
                          textDecoration: `${lesson.free_preview ? 'underline' : 'none'}`,
                          cursor: `${lesson.free_preview ? 'pointer' : 'auto'}`
                        }}
                      >{lesson.title}</p>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                      >
                        {
                          lesson?.free_preview && (
                            <div
                              onClick={() => setIsFreePreview({ ...isFreePreview, opened: true, which: lesson })}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                cursor: `${lesson.free_preview ? 'pointer' : 'auto'}`
                              }}>
                              <span
                                style={{
                                  marginBottom: '2px',
                                  color: '#5624d0',
                                  textDecoration: `${lesson.free_preview ? 'underline' : 'none'}`
                                }}
                              >Xem preview miễn phí</span>
                              <PlayCircleFilled style={{ fontSize: '16px', color: '#313131' }} />
                            </div>
                          )
                        }
                        <p>{lesson.duration}s</p>
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
    if (user) checkEnrolled();
  }, [user]);

  useEffect(() => {
    _setMenuItems();
    getReviewsOfCourse();
  }, [course])

  return (
    <div
      className={styles.container}
    >
      <Spin
        spinning={msg}
        size='large'
        style={{ position: 'absolute', marginTop: '-48px', marginLeft: '50%' }}
      />
      <BackTop />
      <div
        className={styles.container_general}
      >
        <div
          className={styles.container_general_wrapper}
          style={{ width: '1152px' }}
        >
          <div
            className={styles.container_general_wrapper_left}
          >
            <div className={styles.d_flex_row}>
              <p style={{ color: 'white', fontSize: '18px' }}><b>{course?.categoryInfo?.name}</b></p>
              <span><RightOutlined /></span>
              <Space size='small' className={styles.container_general_wrapper_left_tag}>
                {course?.tags?.map((item, index) => <Tag key={`${index}_tag`} color="orange">{item}</Tag>)}
              </Space>
            </div>
            <h1
              className={styles.container_general_wrapper_left_coursename}
            >{course?.name}</h1>
            <p
              className={styles.container_general_wrapper_left_coursesummary}
            >{course?.summary}</p>
            <p
              className={styles.container_general_wrapper_left_courseinstructor}
            >Giảng viên <b>{course?.instructorInfo?.name}</b></p>
            <Space
              direction="horizontal"
              size='small'
              className={styles.container_general_wrapper_left_courselanguage}
            >
              <GlobalOutlined />
              <Space split='|'>{course?.languages?.map(lang => <p key={`${lang}_lang`}>{lang}</p>)}</Space>
            </Space>
          </div>
          <div
            className={styles.container_general_wrapper_right}
          >
            <div
              className={styles.container_general_wrapper_right_image}
              onClick={() => setIsFreePreview({ ...isFreePreview, opened: true, which: {} })}
            >
              <div
                className={styles.container_general_wrapper_right_image_detail}
              >
                <Image
                  src={course?.image?.Location}
                  width={320}
                  height={180}
                  style={{ objectFit: 'cover' }}
                  alt='cover_image'
                />
              </div>
              <div
                className={styles.container_general_wrapper_right_image_playbutton}
              >
                <Image
                  src='/play_button.svg'
                  width={52}
                  height={52}
                  alt='button_cover_image'
                />
              </div>
              <p
                className={styles.container_general_wrapper_right_image_text}
              >Xem preview</p>
            </div>
            <div
              className={styles.container_general_wrapper_right_price}
            >{course?.paid ? `${course?.price} vnđ` : 'Miễn phí'}</div>
          </div>
        </div>
      </div>
      <div
        className={styles.container_body}
      >
        <div
          className={styles.container_body_wrapper}
          style={{ width: '1152px' }}
        >
          <div
            className={styles.container_body_wrapper_top}
          >
            <div
              className={styles.container_body_wrapper_top_left}
            >
              <div
                className={styles.container_body_wrapper_top_left_coursegoal}
              >
                <h2
                  className={styles.h2}
                >
                  Sau khóa học, bạn sẽ:
                </h2>
                <List
                  size="small"
                  split={false}
                  dataSource={course?.goal}
                  style={{ margin: '4px' }}
                  renderItem={item => (
                    <List.Item
                      style={{ fontSize: '16px' }}
                    ><CheckOutlined style={{ fontSize: '16px', color: 'green', marginRight: '8px' }} /> {item}
                    </List.Item>
                  )}
                />
              </div>
            </div>
            <div
              className={styles.container_body_wrapper_top_right}
            >
              {
                (user?._id === course?.instructorInfo?._id)
                  ? (
                    <Button
                      className={styles.container_body_wrapper_top_right_buttonrollin}
                      type='primary'
                      onClick={() => router.push(`/user/courses/${course?.slug}`)}
                    >
                      Đi đến khóa học
                    </Button>
                  )
                  : (
                    !enrolled?.data
                      ? (
                        <Popconfirm
                          disabled={false}
                          title={
                            course?.paid
                              ? <div>
                                <p>Bạn muốn thực hiện lệnh mua khóa học này ?</p>
                                {msg && <p style={{ color: 'green' }}>{msg}</p>}
                              </div>
                              : <div>
                                <p>Bạn muốn tham gia khóa học miễn phí này ?</p>
                                {msg && <p style={{ color: 'green' }}>{msg}</p>}
                              </div>
                          }
                          onConfirm={course?.paid ? paidEnrollmentHandler : freeEnrollmentHandler}
                          okText='Đồng ý'
                          cancelText='Hủy'
                        >
                          <Button
                            className={styles.container_body_wrapper_top_right_buttonrollin}
                            type='primary'
                          >
                            {
                              course?.paid
                                ? 'Mua ngay'
                                : 'Học miễn phí'
                            }
                          </Button>
                        </Popconfirm>
                      )
                      : (
                        <Button
                          className={styles.container_body_wrapper_top_right_buttonrollin}
                          type='primary'
                          onClick={() => router.push(`/user/courses/${course?.slug}`)}
                        >
                          Vào học
                        </Button>
                      )
                  )
              }
            </div>
          </div>
          <div
            className={styles.container_body_wrapper_bottom}
          >
            <div
              className={styles.container_body_wrapper_bottom_left}
            >
              <div
                className={styles.container_body_wrapper_bottom_left_courseinfocard}
              >
                <div
                  className={styles.courseinfocard_item}
                >
                  <PlaySquareOutlined style={{ fontSize: '28px', color: '#2c2b2b' }} />
                  {totalDuration} s
                </div>
                <div
                  className={styles.courseinfocard_item}
                >
                  <ReadOutlined style={{ fontSize: '28px', color: '#2c2b2b' }} />
                  {course?.lessons.length} bài học
                </div>
                <div
                  className={styles.courseinfocard_item}
                >
                  <GlobalOutlined style={{ fontSize: '28px', color: '#2c2b2b' }} />
                  {course?.languages.length} ngôn ngữ
                </div>
                <div
                  className={styles.courseinfocard_item}
                >
                  <WifiOutlined style={{ fontSize: '28px', color: '#2c2b2b' }} />
                  Truy cập mọi lúc
                </div>
              </div>
              <div
                className={styles.container_body_wrapper_bottom_left_buttonpreview}
              >
                <Button
                  type="primary"
                  onClick={() => setIsFreePreview({ ...isFreePreview, opened: true, which: '' })}
                  style={{ height: 'fit-content', width: '672px', backgroundColor: '#000000', border: 'none', padding: '8px 0px' }}
                ><b>Xem preview</b></Button>
              </div>
            </div>
            <div
              className={styles.container_body_wrapper_bottom_right}
            >
              <div
                className={styles.container_body_wrapper_bottom_right_courserequirements}
              >
                <List
                  header={
                    <Space
                      size='middle'
                      split={<HeartFilled />}
                      style={{ padding: '0px 24px' }}
                    >
                      <h2 className={styles.h2}>Yêu cầu trước khóa học</h2>
                    </Space>
                  }
                  dataSource={course?.requirements}
                  style={{ border: '1px solid #d1d7dc', marginTop: '12px' }}
                  renderItem={(item) => (
                    <List.Item
                      style={{ fontSize: '14px', backgroundColor: '#fbfdff', padding: '12px 20px', cursor: 'pointer' }}
                    >
                      <Space size='large'>
                        <CompressOutlined style={{ color: 'grey' }} />{item}
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
          <div
            className={styles.container_body_wrapper_courseoutline}
          >
            <h2
              className={styles.h2}
            >
              Nội dung khóa học:
            </h2>
            {
              Object.keys(enrolled?.data || {}).length
                ? (
                  <Space style={{ color: 'green', fontWeight: '600', fontSize: '16px', marginTop: '8px' }}>
                    <CheckOutlined />
                    <p>Bạn đã tham gia khóa học này, hãy đến<span> </span>
                      <Link href={`/user/courses/${course?.slug}`}>
                        <span
                          style={{
                            borderBottom: '2px dotted green',
                            textDecoration: 'none',
                            color: 'green'
                          }}>địa chỉ</span>
                      </Link> dành cho học viên đã đăng ký cho khóa học
                    </p>
                  </Space>
                )
                : null
            }
            <Menu // 137
              className={styles.container_body_wrapper_courseoutline_list}
              mode='inline'
              selectedKeys={[]}
              selectable={false}
            >
              {menuItems}
            </Menu>
            <div
              className={styles.container_body_wrapper_coursedescription}
            >
              <h2
                className={styles.h2}
              >
                Mô tả:
              </h2>
              <div
                className={styles.container_body_wrapper_coursedescription_detail}
              >
                {
                  isDesSeeMore
                    ? <ReactMarkdown children={course?.description} disallowedElements={['h1', 'h2']} />
                    : <ReactMarkdown children={course?.description?.substring(0, 300)} disallowedElements={['h1', 'h2']} />
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
            <div
              className={styles.container_body_wrapper_coursereview}
            >
              <h2
                className={styles.h2}
              >
                Đánh giá:
              </h2>
              <div
                className={styles.container_body_wrapper_coursereview_detail}
              >
                <div
                  className={`${styles.container_body_wrapper_coursereview_detail_overall} ${styles.d_flex_row}`}
                >
                  {/* average */}
                  <div
                    className={`${styles.coursereview_detail_overall_average} ${styles.d_flex_col}`}
                    style={{ gap: '12px' }}
                  >
                    <p
                      style={{ fontSize: '76px', color: '#b4690e', fontWeight: '700', lineHeight: '64px' }}
                    >
                      {
                        isNaN((Math.floor(calculateAverage(listReview.total.map(_ => _.star)) * 10) / 10).toFixed(1))
                          ? <DashOutlined />
                          : (Math.floor(calculateAverage(listReview.total.map(_ => _.star)) * 10) / 10).toFixed(1)
                      }
                    </p>
                    <Rate
                      allowHalf={true}
                      value={(Math.floor(calculateAverage(listReview.total.map(_ => _.star)) * 10) / 10).toFixed(1)}
                      disabled={true}
                      style={{ fontSize: '18px' }}
                    />
                  </div>
                  {/* progressbar | statistic */}
                  <div
                    className={styles.coursereview_detail_overall_progressbarstatistic}
                  >
                    {
                      [1, 2, 3, 4, 5].map(number => {
                        return (
                          <div key={number} className={styles.d_flex_row} style={{ gap: '28px' }}>
                            <Progress
                              type='line'
                              showInfo={false}
                              percent={((listReview?.total?.filter(_ => _.star === number).length) / (listReview?.total?.length) * 100)}
                              strokeColor='#6a6f73'
                              trailColor="#d1d7dc"
                              style={{ width: '60%' }}
                            />
                            <Rate
                              value={number}
                              style={{ fontSize: '18px' }}
                            />
                            <p>
                              {
                                listReview?.total?.length
                                  ? `${((listReview?.total?.filter(_ => _.star === number).length) / (listReview?.total?.length) * 100).toFixed(1)} %`
                                  : '---'
                              }
                            </p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                <div
                  className={styles.container_body_wrapper_coursereview_detail_content}
                >
                  <p style={{ marginTop: '12px', fontSize: '16px' }}>
                    <b>Các đánh giá mới nhất</b>
                  </p>
                  <div
                    className={styles.coursereview_detail_content_mostrecent}
                  >
                    {
                      listReview.list.map((review, index) => {
                        if (index < 4)
                          return (
                            <div
                              className={styles.coursereview_detail_content_mostrecent_item}
                              key={review._id}
                            >
                              <div
                                className={`${styles.coursereview_detail_content_mostrecent_item_info} ${styles.d_flex_row}`}
                              >
                                {/* image */}
                                <div style={{ width: '44px', height: '44px' }}>
                                  <Image
                                    src={'/user_default.svg'}
                                    width={44}
                                    height={44}
                                    alt='avatar'
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                                {/* info */}
                                <div className={styles.d_flex_col} style={{ gap: '2px' }}>
                                  <p style={{ fontWeight: '700' }}>{review?.user?.name}</p>
                                  <div className={styles.d_flex_row}>
                                    <Rate
                                      value={review?.star}
                                      disabled={true}
                                      style={{ fontSize: '14px' }}
                                    />
                                    <p><i>{dayjs(review?.updatedAt).format('DD/MM/YYYY')}</i></p>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={styles.coursereview_detail_content_mostrecent_item_content}
                              >
                                {review?.content}
                              </div>
                            </div>
                          )
                      })
                    }
                  </div>
                  <div
                    className={styles.coursereview_detail_content_button}
                    onClick={onShowAllReviewClick}
                  >
                    <label
                      style={{ fontSize: '14px', cursor: 'pointer' }}
                    ><b>Xem thêm...</b></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        isFreePreview.opened && (
          <ModalFreePreview
            isFreePreview={isFreePreview}
            setIsFreePreview={setIsFreePreview}
            course={course}
          />
        )
      }

      {
        isAllReview.opened && (
          <ModalShowReviews
            isAllReview={isAllReview}
            setIsAllReview={setIsAllReview}
            listReview={listReview}
          />
        )
      }
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res, query } = context;

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=1'
  )

  const { data } = await axios.get(`${process.env.API_URL}/course/public/${query.slug}`);

  return {
    props: {
      course: data.data
    }
  }
}

export default SingleCourseView;