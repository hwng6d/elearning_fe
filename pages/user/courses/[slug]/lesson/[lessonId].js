import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { Context } from '../../../../../context';
import axios from 'axios';
import { setDelay } from '../../../../../utils/setDelay';
import LearningRoute from '../../../../../components/routes/learning/LearningRoute';

const UserSingleLessonView = () => {
  // global context
  const { state: { user } } = useContext(Context);

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

      console.log('dataCourse: ', dataCourse);
      // check permission
      // 0. if user is current instructor, skip check permission
      if (user._id === dataCourse.instructor._id) {
        setCurrentLesson(dataCourse.lessons.find(item => item._id === lessonId));
        await setDelay(500);
        setLoading(false);
        return;
      }
      // 1. count previous quizzes of the current lesson (lessonId)
      const currentLesson = dataCourse?.lessons?.find(_ => _?._id === lessonId);
      let previousQuizzes = [];
      dataCourse?.quizzes?.forEach(quiz => {
        const lessonOfQuiz = dataCourse?.lessons?.find(lesson => lesson?._id === quiz.lesson);
        if (lessonOfQuiz.section.index < currentLesson.section.index) {
          previousQuizzes.push(quiz);
        } else if (lessonOfQuiz.section.index === currentLesson.section.index) {
          if (lessonOfQuiz.index < currentLesson.index) {
            previousQuizzes.push(quiz);
          }
        }
      });
      // 2.1 if count <= 0, allow to route
      if (previousQuizzes.length <= 0) {
        setCurrentLesson(dataCourse.lessons.find(item => item._id === lessonId));
        await setDelay(500);
        setLoading(false);
      }
      // 2.2 if count  > 0, assure that amount of previusQuizzes done of user is equal to previousQuizzes.length
      else {
        let done = 0;
        previousQuizzes.forEach(quiz => {
          if (user.courses.find(_ => _.courseId === dataCourse._id).completedQuizzes.includes(quiz._id))
            done += 1;
        });

        if (done === previousQuizzes.length) {
          setCurrentLesson(dataCourse.lessons.find(item => item._id === lessonId));
          await setDelay(500);
          setLoading(false);
        } else {
          message.error('Hãy hoàn thiện các bài quiz của bài học trước đó trước khi truy cập bài học này');
        }
      }
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