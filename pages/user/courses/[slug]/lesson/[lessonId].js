import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { message } from 'antd';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { setDelay } from '../../../../../utils/setDelay';
import LearningRoute from '../../../../../components/routes/LearningRoute';

const UserSingleLessonView = () => {
  // router
  const router = useRouter();
  const { slug, lessonId } = router.query;

  // state
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [currentLesson, setCurrentLesson] = useState({});

  // functions
  const getLessonDetail = async () => {
    try {
      setLoading(true);
      const { data: { data: dataCourse } } = await axios.get(`/api/user/enrolled-courses/${slug}`);
      setCourse(dataCourse);
      setCurrentLesson(dataCourse.lessons.find(item => item._id === lessonId));
      await setDelay(500);
      setLoading(false);
    }
    catch (error) {
      message.error(`Có lỗi khi lấy thông tin bài học đã mua/tham gia. Chi tiết: ${error.message}`);
      await setDelay(2000);
      router.push(`/course/${slug}`)
      setLoading(false);
    }
  }

  useEffect(() => {
    if (router.isReady) getLessonDetail();
  }, [slug, lessonId]);

  return (
    <div>
      <LearningRoute
        loading={loading}
        course={course}
        currentLesson={currentLesson}
      />
    </div>
  )
};

export default UserSingleLessonView;