import { useState, useEffect } from "react";
import { Button, List, Popover } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import styles from '../../styles/components/cards/CourseCard.module.scss';

const CourseCard = ({
  course,
  index,
  loading,
}) => {
  const popoverBody = () => {
    return (
      <div
        className={styles.popover_container}
        style={{ width: '312px', maxHeight: '312px', minHeight: '290px' }}
      >
        <p
          className={styles.popover_container_coursename}
        >
          {course.name}
        </p>
        <p
          className={styles.popover_container_coursedate}
        >
          Cập nhật tháng <b>{dayjs(course.updatedAt).month() + 1}/{dayjs(course.updatedAt).year()}</b>
        </p>
        <p
          className={styles.popover_container_courselessons}
        >
          12 bài học
        </p>
        <p
          className={styles.popover_container_coursecategory}
        >
          Thể loại: {course.category}
        </p>
        <div
          className={styles.popover_container_coursecommitment}
        >
          <p>Cam kết:</p>
          <ul style={{ lineHeight: '24px' }}>
            <li>Uy tín, chất lượng</li>
            <li>Mức giá hợp lý</li>
          </ul>
        </div>
        <Button
          className={styles.popover_container_addtocart}
          type='primary'
        >
          <b>Thêm vào giỏ hàng</b>
        </Button>
      </div>
    )
  }

  return (
    <Popover
      trigger='hover'
      placement={index % 2 === 0 ? 'right' : 'left'}
      title={null}
      content={popoverBody}
    >
      <div
        className={styles.container}
        // style={{ width: '256px', height: '280px' }}
        style={{ width: '288px', height: '280px' }}
      >
        {/* header */}
        <div
          className={styles.container_header}
          style={{ height: '163px', border: '1px solid #d9d9d9' }}
        >
          <Image
            width='288px'
            height='162px'
            alt='course-cover'
            src={course.image.Location}
            style={{ objectFit: 'cover' }}
          />
        </div>
        {/* body */}
        <div
          className={styles.container_body}
        >
          <p
            className={styles.container_body_coursename}
          >
            {course.name}
          </p>
          <p
            className={styles.container_body_courseinstructor}
          >
            Instructor {course.instructor.name}
          </p>
          <p
            className={styles.container_body_courseprice}
          >
            {course.paid
            ? `${course.price} vnđ`
            : 'Miễn phí'}
          </p>
        </div>
        {/* footer */}
        <div
          className={styles.container_footer}
        >

        </div>
      </div>
    </Popover>
  )
}

export default CourseCard