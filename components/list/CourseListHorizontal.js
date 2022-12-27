import { useState, useEffect } from 'react';
import { Avatar, Button, List, Rate, Space, Tooltip } from 'antd';
import Image from 'next/image';
import styles from '../../styles/components/list/CourseList.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { calculateAverage } from '../../utils/calculateAverage';
import { secondsToHms } from '../../utils/secondsToHms';
import lodash from 'lodash';

const CourseListHorizontal = ({
  courses,
  hidePrice = false,
  hidePopup = false,
}) => {
  // router
  const router = useRouter();

  // functions
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
            <Link href={`/user/courses/${course?.courseInfo?.slug}`}>
              <div
                className={`${styles.container_list_item_wrapper} ${styles.d_flex_row}`}
                style={{ alignItems: 'flex-start' }}
              >
                <div
                  className={`${styles.container_list_item_wrapper_left} ${styles.d_flex_row}`}
                >
                  <div
                    className={styles.container_list_item_wrapper_left_left}
                  >
                    <Image
                      alt='courseImage'
                      src={course?.courseInfo?.image?.Location}
                      width={224}
                      height={126}
                      style={{
                        objectFit: 'cover',
                        border: '1px solid',
                        width: '-webkit-fill-available',
                        height: '-webkit-fill-available'
                      }}
                    />
                  </div>
                  <div
                    className={`${styles.container_list_item_wrapper_left_right} ${styles.d_flex_col}`}
                  >
                    <p
                      style={{ fontSize: '16px' }}
                    ><b>{course?.courseInfo?.name}</b></p>
                    <Tooltip title={course?.courseInfo?.summary}>
                      <p className={styles.left_right_summary}>
                        {course?.courseInfo?.summary}
                      </p>
                    </Tooltip>
                    <p style={{ color: '#6a6f73' }}>
                      {course?.courseInfo?.instructorInfo?.name}
                    </p>
                    <div className={styles.d_flex_row}>
                      <div style={{ color: '#b4690e', fontWeight: 600 }}>
                        {
                          isNaN(calculateAverage(course?.courseInfo?.reviewList?.map(_ => _?.star)))
                            ? <p><i>Chưa có đánh giá</i></p>
                            : (
                              <div className={styles.d_flex_row}>
                                <p>{`${calculateAverage(course?.courseInfo?.reviewList?.map(_ => _?.star))} sao`}</p>
                                <Rate
                                  disabled={true}
                                  allowHalf={true}
                                  value={calculateAverage(course?.courseInfo?.reviewList?.map(_ => _?.star))}
                                  style={{ fontSize: '15px' }}
                                />
                              </div>
                            )
                        }
                      </div>
                    </div>
                    <div className={styles.d_flex_row} style={{ gap: '4px' }}>
                      <p>{secondsToHms(lodash.sum(course?.courseInfo?.lessons?.map(_ => _?.duration)))}</p>
                      <span>|</span>
                      <p>{course?.courseInfo?.lessons?.length} bài học</p>
                      <span>|</span>
                      <p>{course?.courseInfo?.quizzes?.length} bài quiz</p>
                    </div>
                  </div>
                </div>
                {
                  !hidePrice
                  ? (
                    <div
                  className={`${styles.container_list_item_wrapper_right} ${styles.d_flex_row}`}
                >
                  <p style={{ fontSize: '16px' }}><b>{course?.courseInfo?.price} vnđ</b></p>
                </div>
                  )
                  : null
                }
              </div>
            </Link>
          </List.Item>)}
      />
    </div>
  )
}

export default CourseListHorizontal;