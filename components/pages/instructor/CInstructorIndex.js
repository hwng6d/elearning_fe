import React, { useContext, useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import axios from 'axios';
import CourseCard from '../../cards/CourseCard';
import styles from '../../../styles/components/instructor/InstructorIndex.module.scss';
import Link from 'next/link';

function CInstructorIndex() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getInstructorCourses();
  }, []);

  const getInstructorCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/course/ins');
      setCourses(data.data);
      setLoading(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi lấy danh sách khóa học, vui lòng thử lại.Chi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  return (
    <div
      className={styles.container}
    >
      <h1
        className={styles.h1}
      >Các khóa học hiện tại</h1>
      <div
        className={styles.container_wrapper}
        style={{ width: '1408px' }}
      >
        {
          loading
            ? (
              <div style={{ textAlign: 'center', marginTop: '32px', width: '100%' }}>
                <Spin spinning={true} size='large' />
              </div>
            )
            : (
              <div
                className={styles.container_wrapper_courses}
              >
                {
                  courses.map(course => {
                    return (
                      (
                        <Link key={course._id} href={`/instructor/course/view/${course.slug}`}>
                          <CourseCard
                            course={course}
                            disable={true}
                          />
                        </Link>
                      )
                    );
                  })
                }
              </div>
            )
        }
      </div>
    </div>
  );
}

export default React.memo(CInstructorIndex)
