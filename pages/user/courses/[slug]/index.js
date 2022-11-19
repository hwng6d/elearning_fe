import { SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../../../../context/index';
import { message } from 'antd';

const UserSingleCourseView = () => {
  // router info
  const router = useRouter();
  const { slug } = router.query;

  // global context info
  const { state: { user } } = useContext(Context);

  // functions
  const checkEnrollement = async () => {
    try {
      // get course info to get course._id
      const { data: { data: dataCourse } } = await axios.get(`/api/course/public/${slug}`);

      // check enrollment
      const { data: dataEnrolled } = await axios.post(`/api/user/check-enrollment/${dataCourse._id}`);
      if (dataEnrolled.success) {
        const currentUserCourse = user.courses.find(item => item.courseId === dataCourse._id);
        const completedLessonsLength = currentUserCourse.completedLessons.length;
        if (completedLessonsLength <= 0) {
          const { data: dataLesson } = await axios.get(`/api/user/enrolled-courses/${slug}`);
          const firstLessonId = dataLesson.data.lessons[0]._id;
          router.replace(
            `/user/courses/${slug}/lesson/${firstLessonId}`
          );
        } else {
          router.replace(
            `/user/courses/${slug}/lesson/${currentUserCourse.completedLessons[completedLessonsLength - 1]}`
          );
        }
      } else {
        console.log('success FALSE triggered');
        router.push(`/course/${slug}`);
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi kiểm tra thông tin khóa học, vui lòng thử lại\nChi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    checkEnrollement();
  }, [router.isReady])

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '400px',
        fontSize: '32px',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ff5d47'
      }}
    >
      <SyncOutlined spin={true} />
    </div>
  )
};

export default UserSingleCourseView;