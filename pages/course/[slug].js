import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Context } from "../../context";
import Link from "next/link";
import { Space, Tag, List, Button, BackTop, Tooltip, Popconfirm, message, Spin } from "antd";
import axios from "axios";
import { CheckOutlined, CompressOutlined, DownOutlined, GlobalOutlined, HeartFilled, PlayCircleFilled, PlaySquareOutlined, ReadOutlined, WifiOutlined } from "@ant-design/icons";
import ReactMarkdown from 'react-markdown';
import Image from "next/image";
import ModalFreePreview from "../../components/forms/ModalFreePreview";
import { setDelay } from "../../utils/setDelay";
import { loadStripe } from "@stripe/stripe-js";
import styles from '../../styles/course/[slug].module.scss';


const SingleCourseView = ({ course }) => {
  // router
  const router = useRouter();

  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // states
  const [isDesSeeMore, setIsDesSeeMore] = useState(false);
  const [isFreePreview, setIsFreePreview] = useState({ opened: false, which: {} });
  const [enrolled, setEnrolled] = useState({});
  const [msg, setMsg] = useState('');
  const [hide, setHide] = useState(false);

  // calculate total of all videos duration
  let totalDuration = 0;
  course.lessons.forEach(lesson => totalDuration += lesson.duration);

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

      if (user._id === course.instructor._id) {
        message.info('Bạn hiện là Instructor của khóa học này');
        return;
      }

      setMsg('Đang thực hiện...');
      await setDelay(3000);
      const { data } = await axios.post(`/api/user/enrollment/paid/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
      stripe.redirectToCheckout({ sessionId: data.data.id });
    }
    catch (error) {
      message.error(`Có lỗi xảy ra, hãy thử lại\nChi tiết: ${error.message}`);
    }
  }

  const freeEnrollmentHandler = async () => {
    console.log('free enrollment triggered!')

    try {
      if (!user)
        router.push('/signin')

      if (enrolled?.success) {
        message.info('Bạn đã tham gia khóa học này');
        return;
      }

      if (user._id === course.instructor._id) {
        message.info('Bạn hiện là Instructor của khóa học này');
        return;
      }

      setMsg('Đang thực hiện...');
      await setDelay(3000);
      const { data } = await axios.post(`/api/user/enrollment/free/${course._id}`);
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
    const { data } = await axios.post(`/api/user/check-enrollment/${course._id}`);
    console.log('public checkEnrolled: ', data);
    setEnrolled({ ...enrolled, data: data.data });
  }

  useEffect(() => {
    if (user) checkEnrolled();
  }, [user]);

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
            <Space size='small' className={styles.container_general_wrapper_left_tag}>
              {course?.category?.map((item, index) => <Tag key={index} color="orange">{item}</Tag>)}
            </Space>
            <h1
              className={styles.container_general_wrapper_left_coursename}
            >{course.name}</h1>
            <p
              className={styles.container_general_wrapper_left_coursesummary}
            >{course.summary}</p>
            <p
              className={styles.container_general_wrapper_left_courseinstructor}
            >Giảng viên <b>{course.instructor.name}</b></p>
            <Space
              direction="horizontal"
              size='small'
              className={styles.container_general_wrapper_left_courselanguage}
            >
              <GlobalOutlined />
              <Space split='|'>{course.languages.map(lang => <p key={lang}>{lang}</p>)}</Space>
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
                  src={course.image.Location}
                  objectFit='cover'
                  width={320}
                  height={180}
                />
              </div>
              <div
                className={styles.container_general_wrapper_right_image_playbutton}
              >
                <Image
                  src='/play_button.svg'
                  width={52}
                  height={52}
                />
              </div>
              <p
                className={styles.container_general_wrapper_right_image_text}
              >Xem preview</p>
            </div>

            <div
              className={styles.container_general_wrapper_right_price}
            >{course.paid ? `${course.price} vnđ` : 'Miễn phí'}</div>
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
                  dataSource={course.goal}
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
                !enrolled?.data && (
                  <Popconfirm
                    disabled={false}
                    title={
                      course.paid
                        ? <div>
                          <p>Bạn muốn thực hiện lệnh mua khóa học này ?</p>
                          {msg && <p style={{ color: 'green' }}>{msg}</p>}
                        </div>
                        : <div>
                          <p>Bạn muốn tham gia khóa học miễn phí này ?</p>
                          {msg && <p style={{ color: 'green' }}>{msg}</p>}
                        </div>
                    }
                    onConfirm={course.paid ? paidEnrollmentHandler : freeEnrollmentHandler}
                    okText='Đồng ý'
                    cancelText='Hủy'
                  >
                    <Button
                      className={styles.container_body_wrapper_top_right_buttonrollin}
                      type='primary'
                    >
                      {
                        course.paid
                          ? 'Mua ngay'
                          : 'Học miễn phí'
                      }
                    </Button>
                  </Popconfirm>
                )
              }
              {
                enrolled?.data && (
                  <Button
                    className={styles.container_body_wrapper_top_right_buttonrollin}
                    type='primary'
                    onClick={() => router.push(`/user/courses/${course.slug}`)}
                  >
                    Vào học
                  </Button>
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
                  {course.lessons.length} bài học
                </div>
                <div
                  className={styles.courseinfocard_item}
                >
                  <GlobalOutlined style={{ fontSize: '28px', color: '#2c2b2b' }} />
                  {course.languages.length} ngôn ngữ
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
                  dataSource={course.requirements}
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
                ? <Space style={{ color: 'green', fontWeight: '600', fontSize: '16px', marginTop: '4px' }}>
                  <CheckOutlined />
                  <p>Bạn đã tham gia khóa học này, hãy đến
                    <Link href={`/user/courses/${course.slug}`}>
                      <span
                        style={{
                          borderBottom: '2px dotted green',
                          textDecoration: 'none',
                          color: 'green'
                        }}> địa chỉ</span>
                    </Link> dành cho học viên đã đăng ký cho khóa học
                  </p>
                </Space>
                : null
            }
            <List
              dataSource={course.lessons}
              header={
                <Space
                  size='middle'
                  split={<HeartFilled />}
                  style={{ padding: '6px 24px' }}
                >
                  <p>{course.lessons.length} bài</p>
                  <p>Tổng thời lượng: {totalDuration} s</p>
                </Space>
              }
              style={{ border: '1px solid #d1d7dc', borderRadius: '8px', marginTop: '12px' }}
              renderItem={(item) => (
                <List.Item
                  extra={item.free_preview && (
                    <Tooltip title='Xem preview bài học này'>
                      <PlayCircleFilled
                        onClick={() => setIsFreePreview({ ...isFreePreview, opened: true, which: item })}
                        style={{ fontSize: '16px' }}
                      />
                    </Tooltip>
                  )}
                  style={{ fontSize: '15px', backgroundColor: '#f7f9fa', padding: '12px 20px', cursor: 'pointer' }}
                >
                  <Space size='large'>
                    <DownOutlined style={{ color: 'grey' }} /><b>{item.title}</b>
                  </Space>
                </List.Item>
              )}
            />
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
                  course.description.length > 300 && (
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
          </div>
        </div>
      </div>

      <ModalFreePreview
        isFreePreview={isFreePreview}
        setIsFreePreview={setIsFreePreview}
        course={course}
      />

      <button onClick={() => setHide(!hide)}>Ẩn/hiện</button>
      {hide && <pre>{JSON.stringify(course, null, 4)}</pre>}
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