import { message } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import InstructorRoute from "../../components/routes/InstructorRoute";
import CourseCard from '../../components/cards/CourseCard';
import { Spin, Pagination } from "antd";
import { SearchBox } from '@fluentui/react';
import styles from '../../styles/components/instructor/PublicCourses.module.scss';
import { setDelay } from "../../utils/setDelay";

const PublicCoursesPage = () => {
  // states
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState({ keyword: '' });

  // functions
  const onSearchEnter = async () => {
    getPublicCourses();
  }

  const getPublicCourses = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams({
        published: true,
        status: 'public',
        page: 1,
        limit: 12,
        name: search.keyword,
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
        <div className={styles.d_flex_row} style={{ gap: '32px' }}>
          <h1
            className={styles.h1}
          >Các khóa học đang được xuất bản</h1>
          <SearchBox
            placeholder='Nhập từ khóa...'
            value={search.keyword}
            onChange={(_, value) => setSearch({ ...search, keyword: value })}
            onSearch={onSearchEnter}
            style={{ width: '512px' }}
          />
        </div>
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

export default PublicCoursesPage;