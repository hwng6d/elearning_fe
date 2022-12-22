import { message } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import InstructorRoute from "../../components/routes/InstructorRoute";
import CourseCard from '../../components/cards/CourseCard';
import { Spin, Pagination } from "antd";
import styles from '../../styles/components/instructor/RejectedCourses.module.scss';
import { setDelay } from "../../utils/setDelay";

const RejectedCoursesPage = () => {
  // states
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // functions
  const getPublicCourses = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams({
        status: 'rejected',
        page: 1,
        limit: 12,
      }).toString();

      const { data } = await axios.get(
        `/api/course/ins?${queryString}`
      );

      setCourses(data?.data[0]?.paginatedResults);
      setTotal(data?.data[0]?.totalCount[0]?.count || 0);

      await setDelay(300);
      setLoading(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi lấy danh sách khóa học đã được xuất bản. Chi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    getPublicCourses();
  }, [currentPage]);

  return (
    <InstructorRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <h1
          className={styles.h1}
        >Các khóa học bị từ chối xuất bản</h1>
        <div
          className={styles.container_wrapper}
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
                className={styles.container_wrapper}
                style={{ width: '1408px' }}
              >
                <div
                  className={styles.container_wrapper_courses}
                >
                  {
                    !courses?.length
                      ? (
                        <p
                          style={{ fontSize: '16px' }}
                        ><i>Không có dữ liệu</i></p>
                      )
                      : (
                        courses.map(course => {
                          return (
                            (
                              <Link
                                key={course._id}
                                href={`/instructor/course/view/${course.slug}`}
                              >
                                <CourseCard
                                  course={course}
                                  disable={true}
                                />
                              </Link>
                            )
                          );
                        })
                      )
                  }
                </div>
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
    </InstructorRoute>
  )
}

export default RejectedCoursesPage;