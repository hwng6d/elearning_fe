import { useState, useEffect } from 'react';
import { Avatar, Button, List, Space } from 'antd';
import Image from 'next/image';
import styles from '../../styles/components/list/CourseList.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CourseListHorizontal = ({ courses }) => {
  console.log('courses: ', courses);

  const router = useRouter();

  const qandaHandler = () => {
    
  }

  return (
    <div
      className={styles.container}
    >
      <List
        className={styles.container_list}
        itemLayout='vertical'
        dataSource={courses}
        renderItem={(course) => (
          <List.Item
            key={course?._id}
            className={styles.container_list_item}
          >
            <Space
              direction='horizontal'
              size='large'
            >
              <div
                className={styles.container_list_item_image}
                onClick={() => router.push(`/user/courses/${course?.courseId?.slug}`)}
              >
                <Image
                  src={course?.courseId?.image?.Location}
                  width={224}
                  height={126}
                  objectFit='cover'
                />
              </div>
              <div
                className={styles.container_list_item_content}
              >
                <Space
                  direction='vertical'
                  size='small'
                >
                  <h2
                    onClick={() => router.push(`/user/courses/${course?.courseId?.slug}`)}
                    style={{ fontSize: '20px', cursor: 'pointer' }}
                  >
                    {course?.courseId?.name}
                  </h2>
                  <p>Instructor: {course?.courseId?.instructor?.name}</p>
                  <p>...% hoàn thành</p>
                  <p>
                    <Space size='middle'>
                      ... sao
                      <b
                        onClick={qandaHandler}
                        style={{ cursor: 'pointer' }}>Để lại bình luận</b>
                    </Space>
                  </p>
                </Space>
              </div>
            </Space>
          </List.Item>)}
      />
    </div>
  )
}

export default CourseListHorizontal;