import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, Card, Carousel, message } from 'antd';
import CourseCard from '../components/cards/CourseCard';
import styles from '../styles/index.module.scss';
import axios from 'axios';

export default function Home({ courses }) {
  // const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState({ courses: false });

  // useEffect(() => {
  //   getPublishedCourses();
  // }, []);

  // const getPublishedCourses = async () => {
  //   setLoading({ ...loading, courses: true });
  //   try {
  //     const { data } = await axios.get('/api/course/public');
  //     setCourses(data.data);
  //     setLoading({ ...loading, courses: false });
  //   }
  //   catch (error) {
  //     setLoading({ ...loading, courses: false });
  //     console.log('Đã xảy ra lỗi khi lấy thông tin khóa học, vui lòng thử lại');
  //   }
  // }

  return (
    <div
      style={{ padding: '8px' }}
    >
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Maven+Pro&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className={styles.carousel}
        style={{ width: '1280px', height: '35%' }}
      >
        <Carousel autoplay={true} effect='fade'>
          <Image
            alt='carousel_1'
            width='1280px'
            height='312px'
            src='/carousel_1.svg'
          />
          <Image
            alt='carousel_2'
            width='1280px'
            height='312px'
            src='/carousel_2.svg'
          />
        </Carousel>
      </div>
      <div
        className={styles.container}
        style={{ padding: '24px', width: '1280px' }}
      >
        <h2 className={styles.h2}>
          Các khóa học mới nhất
        </h2>
        <p className={styles.h2p}>Hơn 100 khóa học được cập nhật mỗi tháng</p>
        <div
          className={styles.card_courses}
        >
          {
            courses.map((course, index) => (
              <Link href={`/course/${course.slug}`}>
                <a>
                  <CourseCard
                    course={course}
                    index={index}
                    loading={loading.courses}
                  />
                </a>
              </Link>

            ))
          }
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API_URL}/course/public`);
  return {
    props: {
      courses: data.data
    }
  }
}
