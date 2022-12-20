import { message } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import InstructorRoute from "../../components/routes/InstructorRoute";
import CourseCard from '../../components/cards/CourseCard';
import { Spin } from "antd";
import styles from '../../styles/components/instructor/EditingCourses.module.scss';

const EditingCoursesPage = () => {
  // states
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  // functions
  const getPublicCourses = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams({
        status: 'unpublic',
        page: 1,
        limit: 16,
      }).toString();

      const { data } = await axios.get(
        `/api/course/ins?${queryString}`
      );

      setCourses(data?.data[0]?.paginatedResults);
      setLoading(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi lấy danh sách khóa học đã được xuất bản. Chi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    getPublicCourses();
  }, []);

  return (
    <InstructorRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <h1
          className={styles.h1}
        >Các khóa học đang chỉnh sửa</h1>
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
                        <p>Không có dữ liệu</p>
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
    </InstructorRoute>
  )
}

export default EditingCoursesPage;