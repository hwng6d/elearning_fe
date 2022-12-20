import { useState, useEffect, useMemo, useContext } from 'react';
import { Context } from '../../context';
import { Button, Modal, Input, List, message, Space } from 'antd';
import { useRouter } from 'next/router';
import axios from 'axios';

const ModalAddQuiz = ({
  isEdit,
  course,
  setCourse,
  modalEditQuiz,  // edit { opened, lessonId, quizId }
  setModalEditQuiz, // edit
  modalAddQuiz, // { opened, lessonId }
  setModalAddQuiz,
  getCourseBySlug,
}) => {
  // global context
  const { state: { user } } = useContext(Context);

  // router
  const router = useRouter();

  // states
  const [lesson, setLesson] = useState({});
  const [quiz, setQuiz] = useState({ question: '', answer: [], correctAnswer: [] });  // answer: [{ index, answer }] ; correctAnswer: [{ index, correctAnswer }]
  const [answer, setAnswer] = useState({ '1': '', '2': '', '3': '', '4': '' });
  const [correctAnswer, setCorrectAnswer] = useState({ '1': false, '2': false, '3': false, '4': false, value: '' });

  // functions
  const getLessonInfo = () => {
    const lessonId = modalAddQuiz?.lessonId || modalEditQuiz?.lessonId;
    const _lesson = course?.lessons?.find(item => item._id === lessonId);
    setLesson(_lesson);
  }

  const fetchQuiz = () => {
    const quiz = course?.quizzes?.find(item => item.lesson === modalEditQuiz.lessonId);
    setQuiz({
      ...quiz,
      question: quiz?.question,
      answer: quiz?.answer, // [{index, value}]
      correctAnswer: quiz?.correctAnswer  // [{index, value}]
    });
    let answerObj = {};

    quiz?.answer?.forEach(item => answerObj[item?.index?.toString()] = item?.value);
    setAnswer(answerObj);

    const _ = quiz?.correctAnswer?.find(item => item?.value === true);
    setCorrectAnswer({
      ...correctAnswer,
      value: _?.index === 1 ? 'A' : _?.index === 2 ? 'B' : _?.index === 3 ? 'C' : _?.index === 4 ? 'D' : ''
    })
  }

  const closeModalHandler = () => {
    if (!isEdit) {
      setModalAddQuiz({ ...modalAddQuiz, opened: false, lessonId: '' });
    } else {
      setModalEditQuiz({ ...modalEditQuiz, opened: false, lessonId: '', quizId: '' });
    }

    setQuiz({ question: '', answer: [], correctAnswer: [] })
    setAnswer({ '1': '', '2': '', '3': '', '4': '' })
    setCorrectAnswer({ '1': false, '2': false, '3': false, '4': false, value: '' });
  }

  const addQuizHandler = async () => {
    try {
      if (!isEdit) {
        await axios.post(
          `/api/course/ins/${course._id}/lesson/${modalAddQuiz.lessonId}/quiz`,
          { quiz, instructorId: user._id }
        );

        getCourseBySlug();
        setQuiz({...quiz, question: '', answer: [], correctAnswer: []})
        setModalAddQuiz({...modalAddQuiz, opened: false, lessonId: ''});
        message.success('Thêm quiz thành công');
      } else {
        console.log('quiz: ', quiz);

        await axios.put(
          `/api/course/ins/${course._id}/lesson/${modalEditQuiz.lessonId}/quiz/${modalEditQuiz.quizId}/update`,
          { quiz, instructorId: user._id }
        )

        getCourseBySlug();
        setQuiz({...quiz, question: '', answer: [], correctAnswer: []})
        setModalEditQuiz({...modalAddQuiz, opened: false, lessonId: '', quizId: ''});
        message.success('Chỉnh sửa quiz thành công');
      }
    }
    catch (error) {
      console.log('error: ', error);
      if (error?.response?.data?.message === `Current lesson has already had quiz, try updating or deleting instead`)
        message.error('Bài học hiện tại đã có quiz, hãy thử cập nhật hoặc xóa')
      else
        message.error(`Có lỗi xảy ra khi ${!isEdit ? 'Thêm' : 'Chỉnh sửa'} quiz. Chi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getLessonInfo();
      if (isEdit)
        fetchQuiz();
    }
  }, [modalAddQuiz, modalEditQuiz]);

  useEffect(() => {
    let _answer = [];
    for (let i = 0; i < 4; i++) {
      const [index, value] = [Object.keys(answer)[i], Object.values(answer)[i]];
      _answer.push({ index: +index, value });
    }
    setQuiz({...quiz, answer: _answer});
  }, [answer]);

  useEffect(() => {
    let _correctAnswer = [];
    for (let i = 0; i < 4; i++) {
      const [index, value] = [Object.keys(correctAnswer)[i], Object.values(correctAnswer)[i]];
      _correctAnswer.push({ index: +index, value });
    }
    setQuiz({...quiz, correctAnswer: _correctAnswer});
  }, [correctAnswer]);

  return (
    <Modal
      className='container'
      title={!isEdit ? 'Thêm Quiz' : 'Sửa Quiz'}
      open={!isEdit ? modalAddQuiz.opened : modalEditQuiz.opened}
      centered={true}
      maskClosable={false}
      onCancel={closeModalHandler}
      footer={(
        <Button
          type='primary'
          disabled={!quiz.question || !Object.keys(quiz.answer).length || !Object.keys(quiz.correctAnswer).length}
          onClick={addQuizHandler}>Hoàn tất</Button>
      )}
    >
      <Space
        className='form'
        direction='vertical'
        size='middle'
      >
        <p>Quiz của <b>Chương {lesson?.section?.index} | Bài {lesson?.index}</b></p>
        <Space
          className='form_question'
          direction='vertical'
        >
          <label><b>Câu hỏi</b></label>
          <Input
            value={quiz.question}
            onChange={(e) => setQuiz({ ...quiz, question: e.target.value })}
            style={{ width: '100%' }}
          />
        </Space>
        <Space
          className='form_answer'
          direction='vertical'
        >
          <label><b>Các lựa chọn</b></label>
          <Space direction='horizontal' size='middle'>
            <p><b>A</b></p>
            <Input
              value={answer['1']}
              onChange={(e) => setAnswer({ ...answer, '1': e.target.value })}
            />
          </Space>
          <Space direction='horizontal' size='middle'>
            <p><b>B</b></p>
            <Input
              value={answer['2']}
              onChange={(e) => setAnswer({ ...answer, '2': e.target.value })}
            />
          </Space>
          <Space direction='horizontal' size='middle'>
            <p><b>C</b></p>
            <Input
              value={answer['3']}
              onChange={(e) => setAnswer({ ...answer, '3': e.target.value })}
            />
          </Space>
          <Space direction='horizontal' size='middle'>
            <p><b>D</b></p>
            <Input
              value={answer['4']}
              onChange={(e) => setAnswer({ ...answer, '4': e.target.value })}
            />
          </Space>
        </Space>
        <Space
          className='form_correctAnswer'
          direction='vertical'
        >
          <label><b>Đáp án đúng</b></label>
          <Input
            maxLength={1}
            placeholder='Nhập 1 kí tự: A hoặc B hoặc C hoặc D'
            value={correctAnswer.value}
            onChange={(e) => {
              const value = e.target.value;
              ['A', 'a'].includes(value)
                ? setCorrectAnswer({ ...correctAnswer, '1': true, '2': false, '3': false, '4': false, value })
                : ['B', 'b'].includes(value)
                  ? setCorrectAnswer({ ...correctAnswer, '2': true, '1': false, '3': false, '4': false, value })
                  : ['C', 'c'].includes(value)
                    ? setCorrectAnswer({ ...correctAnswer, '3': true, '1': false, '2': false, '4': false, value })
                    : ['D', 'd'].includes(value)
                      ? setCorrectAnswer({ ...correctAnswer, '4': true, '1': false, '2': false, '3': false, value })
                      : setCorrectAnswer({ ...correctAnswer, '1': false, '2': false, '3': false, '4': false, value: '' })
            }}
            style={{ width: '100%' }}
          />
        </Space>
      </Space>
    </Modal>
  )
}

export default ModalAddQuiz;