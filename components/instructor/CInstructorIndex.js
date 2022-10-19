import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Tooltip } from 'antd';
import Image from 'next/image';
import { CheckCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import styles from '../../styles/components/instructor/InstructorIndex.module.scss';
import Link from 'next/link';

function CInstructorIndex() {
  const [hide, setHide] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getInstructorCourses();
  }, []);

  const getInstructorCourses = async () => {
    const { data } = await axios.get('/api/course/instructor-courses');
    setCourses(data.data);
  }

  return (
    <div
    >
      <h1>Các khóa học hiện tại</h1>
      <div
        className={styles.container}
      >
        {
          courses.map(course => {
            return (
              <Link key={course._id} href={`/instructor/course/view/${course.slug}`}>
                <a>
                  <Card
                    className={styles.container_card}
                    key={course._id}
                    hoverable={true}
                    cover={<img
                      loading='lazy'
                      alt={course.name}
                      src={course.image ? course?.image?.Location : '/no-photo.png'}
                      height='176px'
                      style={{ objectFit: course?.image?.Location ? 'cover' : 'scale-down' }} />}
                  >
                    <Card.Meta
                      className={styles.container_card_meta}
                      title={(<Tooltip title={course.name}>
                        <p className={styles.course_name}>{course.name}</p>
                      </Tooltip>)}
                      description={
                        <Space direction='vertical'>
                          <p>{course.lessons.length} bài học</p>
                          <Space size={24} direction='horizontal' style={{ width: '100%', justifyContent: 'space-between' }}>
                            {
                              course.lessons.length < 5
                                ? (
                                  <p
                                    style={{ color: '#ff9a31', fontSize: '13px' }}
                                  >Khóa học phải có ít nhất 5 bài học để xuất bản</p>
                                )
                                : (
                                  course.published
                                    ? (
                                      <p
                                        style={{ color: 'green', fontSize: '13px' }}
                                      >Khóa học này đang được bán</p>
                                    )
                                    : (
                                      <p
                                        style={{ color: 'blue', fontSize: '13px' }}
                                      >Khóa học này đã sẵn sàng để được xuất bản</p>
                                    )
                                )
                            }
                            <Tooltip title={course.published ? 'Đã xuất bản' : 'Chưa xuất bản'}>
                              <CheckCircleFilled
                                style={{
                                  fontSize: '18px',
                                  color: course.published ? 'green' : 'gray'
                                }}
                              />
                            </Tooltip>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </a>
              </Link>
            )
          })
        }
      </div>
      <button onClick={() => setHide(!hide)}>{hide ? 'Ẩn' : 'Hiện'}</button>
      {hide && <pre>{JSON.stringify(courses, null, 4)}</pre>}
    </div>
  )
}

export default CInstructorIndex
