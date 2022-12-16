import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from 'antd';
import CourseCard from '../components/cards/CourseCard';
import styles from '../styles/index.module.scss';
import axios from 'axios';

export default function Home({ courses }) {
  const [loading, setLoading] = useState({ courses: false });

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
            src='/carousel_1.svg'
          />
          <Image
            alt='carousel_2'
            width={1280}
            height={312}
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
              <Link key={index} href={`/course/${course.slug}`}>
                <CourseCard
                  course={course}
                  index={index}
                />
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API_URL}/course/public`);
  
  return {
    props: {
      courses: data.data
    }
  }
}
