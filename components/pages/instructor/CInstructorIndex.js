import React, { useContext, useEffect, useState } from 'react';
import { message, Spin, Pagination } from 'antd';
import axios from 'axios';
import CourseCard from '../../cards/CourseCard';
import Link from 'next/link';
import { setDelay } from '../../../utils/setDelay';
import styles from '../../../styles/components/instructor/InstructorIndex.module.scss';

function CInstructorIndex() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getInstructorCourses();
  }, [currentPage]);

  const getInstructorCourses = async () => {
    try {
      setLoading(true);

      const query = { page: currentPage, limit: 12 };
      const queryString = new URLSearchParams(query).toString();
      const { data } = await axios.get(`/api/course/ins?${queryString}`);
      setCourses(data?.data[0]?.paginatedResults);
      setTotal(data?.data[0]?.totalCount[0]?.count || 0);

      await setDelay(300);
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
                  courses?.map(course => {
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
      <div
        className={styles.container_pagination}
      >
        <Pagination
          current={currentPage}
          pageSize={12}
          total={total}
          showSizeChanger={false}
          showTotal={(total) => `Tổng cộng: ${total}.`}
          onChange={(page, pagesize) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default React.memo(CInstructorIndex)
