import { useState } from 'react';
import { Space, Descriptions,  } from 'antd';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import {
  YoutubeFilled,
  TwitterOutlined,
  LinkedinFilled
} from '@ant-design/icons';
import styles from '../../../../styles/components/routes/learning/tabs/TabOverview.module.scss';

const TabOverview = ({ course, currentLesson, activeTab }) => {
  const [isDesSeeMore, setIsDesSeeMore] = useState(false);

  return (
    <div
      className={`${styles.tabs_overview}`}
    >
      <div
        className={styles.tabs_overview}
      >
        <div
          className={styles.tabs_overview_lesson}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Bài học hiện tại</h2>
          <Descriptions
            bordered={true}
            style={{ marginTop: '20px' }}
          >
            <Descriptions.Item
              label={<b>Bài học</b>}
              labelStyle={{ width: '108px', backgroundColor: '#e9e9e9' }}
            >{currentLesson?.title}</Descriptions.Item>
            <Descriptions.Item
              label={<b>Mô tả</b>}
              labelStyle={{ width: '108px', backgroundColor: '#e9e9e9' }}
            >{currentLesson?.content}</Descriptions.Item>
          </Descriptions>
        </div>
        <hr style={{ margin: '24px 0px', borderColor: 'white' }} />
        <div
          className={styles.tabs_overview_course}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Về khóa học</h2>
          <h3 style={{ marginTop: '16px', fontSize: '18px' }}><b>Tóm tắt</b></h3>
          <div
            className={styles.tabs_overview_course_summary}
          >
            <p>{course.summary}</p>
          </div>
          <h3 style={{ marginTop: '16px', fontSize: '18px' }}><b>Mô tả</b></h3>
          <div
            className={styles.tabs_overview_course_description}
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
          className={styles.tabs_overview_instructor}
          direction='vertical'
          size='small'
        >
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Về Instructor</h2>
          <Space
            className={styles.tabs_overview_instructor_wrapper}
            direction='vertical'
            size='middle'
          >
            <Space
              className={styles.tabs_overview_instructor_info}
              direction='horizontal'
              size='large'
              style={{ marginTop: '4px', gap: '40px' }}
            >
              <div
                className={styles.tabs_overview_instructor_info_img}
              >
                <Image
                  src='/no-photo.png'
                  width={108}
                  height={108}
                  alt='instructor_avatar'
                  objectFit='cover'
                  style={{ width: 'inherit', height: 'inherit' }}
                />
              </div>
              <Space
                className={styles.tabs_overview_instructor_info_personal}
                direction='vertical'
              >
                <p><b>{course?.instructor?.name}</b></p>
                <p><b>Chức danh:</b> {course?.instructor?.instructor_information?.position}</p>
                {/* <p><b>Về bản thân:</b> {course?.instructor?.instructor_information?.summary}</p> */}
                <p><b>Kinh nghiệm:</b> {course?.instructor?.instructor_information?.yoe} năm</p>
              </Space>
            </Space>
            <Space
              className={styles.tabs_overview_instructor_social}
              direction='horizontal'
              size='middle'
            >
              <Link
                href='https://twitter.com/elonmusk'
                target="_blank"
                rel="noopener noreferrer">

                <div
                  className={styles.tabs_overview_instructor_social_item}
                >
                  <TwitterOutlined />
                </div>

              </Link>
              <Link
                href='https://www.youtube.com/user/Apple'
                target="_blank"
                rel="noopener noreferrer">

                <div
                  className={styles.tabs_overview_instructor_social_item}
                >
                  <YoutubeFilled />
                </div>

              </Link>
              <Link
                href='https://vn.linkedin.com/company/vng-corporation'
                target="_blank"
                rel="noopener noreferrer">

                <div
                  className={styles.tabs_overview_instructor_social_item}
                >
                  <LinkedinFilled />
                </div>

              </Link>
            </Space>
          </Space>
        </Space>
      </div>
    </div>
  );
}

export default TabOverview;