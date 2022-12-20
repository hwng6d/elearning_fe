import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, Input, Select, Pagination, message } from 'antd';
import CourseCard from '../components/cards/CourseCard';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.scss';

export default function Home({ courses, total }) {
  // router
  const router = useRouter();

  // states
  const [loading, setLoading] = useState({ courses: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState({ category: '', keyword: '' });

  // functions
  const getCategories = async () => {
    try {
      if (router.isReady) {
        setLoading(true);

        const { data } = await axios.get(`/api/category/public`);

        setCategories(data.data);
        setLoading(false);
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi lấy danh sách phân loại. Chi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  const fetDataForCurrentPage = async () => {
    router.push(
      `?page=${currentPage}&limit=16`
    );
  }

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    fetDataForCurrentPage();
  }, [currentPage]);

  return (
    <div
      style={{ padding: '8px' }}
    >
      <div
        className={styles.carousel}
        style={{ width: '1280px', height: '35%' }}
      >
        <Carousel autoplay={true} effect='fade'>
          <Image
            alt='carousel_1'
            width={1280}
            height={312}
            src='/carousels/carousel_1.svg'
          />
          <Image
            alt='carousel_2'
            width={1280}
            height={312}
            src='/carousels/carousel_2.svg'
          />
        </Carousel>
      </div>
      <div
        className={styles.container}
        style={{ padding: '12px 24px', width: '1280px' }}
      >
        <h2
          className={styles.h2}
          style={{ marginTop: '12px' }}
        >
          Các khóa học mới nhất
        </h2>
        <p className={styles.h2p}>Hơn 100 khóa học được cập nhật mỗi tháng</p>
        <div
          className={styles.container_cardcourses}
        >
          {
            courses.map((course, index) => (
              <Link key={index} href={`/course/${course.slug}`}>
                <CourseCard
                  course={course}
                  index={index}
                />
              </Link>
            ))
          }
        </div>
        <div
          className={styles.container_pagination}
        >
          <Pagination
            current={currentPage}
            pageSize={16}
            total={total}
            onChange={(page, pagesize) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let query = { page: 1, limit: 16 };
  if (context.query.page) query['page'] = context.query.page;
  if (context.query.limit) query['limit'] = context.query.limit;

  const queryString = new URLSearchParams(query).toString();

  const { data } = await axios.get(`${process.env.API_URL}/course/public?${queryString}`);

  return {
    props: {
      courses: data?.data[0]?.paginatedResults,
      total: data?.data[0]?.totalCount[0]?.count || 0
    }
  }
}
