import React, { useState, useEffect, useContext } from 'react';
import { Table, Tooltip, Space, Switch, Popconfirm, message, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, MinusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Context } from '../../context';
import axios from 'axios';
import ModalAddSection from '../forms/ModalAddSection';
import _ModalAddLesson from '../forms/_ModalAddLesson';
import styles from '../../styles/components/tables/TableSection.module.scss';
import ModalVideo from '../forms/ModalVideo';
import ModalAddQuiz from '../forms/ModalAddQuiz';
import ModalShowSelections from '../forms/ModalShowSelections';

const TableSection = ({
  isViewing = false,
  course,
  setCourse,
}) => {
  // global context
  const { state: { user } } = useContext(Context);

  // states
  const [modalEditSection, setModalEditSection] = useState({ opened: false, sectionId: '' });
  const [modalAddLesson, setModalAddLesson] = useState({ opened: false, sectionId: '' });
  const [modalEditLesson, setModalEditLesson] = useState({ opened: false, sectionId: '', lessonId: '' });
  const [modalVideo, setModalVideo] = useState({ opened: false, lessonId: '' });
  const [modalAddQuiz, setModalAddQuiz] = useState({ opened: false, lessonId: '' });
  const [modalEditQuiz, setModalEditQuiz] = useState({ opened: false, lessonId: '' });
  const [modalShowSelections, setModalShowSelections] = useState({ opened: false, quizId: '' });

  // functions
  const onEditSectionClick = (sectionId) => {
    setModalEditSection({ ...modalEditSection, opened: true, sectionId: sectionId });
  }

  const onDeleteSectionClick = async (sectionId) => {
    try {
      const { data } = await axios.post(
        `/api/course/ins/${course._id}/section/${sectionId}/delete`,
        { instructorId: user._id }
      );

      setCourse(data.data);
      message('Xóa bài học thành công');
    }
    catch (error) {
      if (error?.response?.data?.message === `This section is containing at least 1 lesson, make sure there's no lesson and try again`)
        message.error('Chương này đang chứa bài học, hãy đảm bảo chương không còn bài học nào và thử lại')
      else
        message.error(`Xảy ra lỗi khi xóa chương, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  const onAddLessonClick = (sectionId) => {
    setModalAddLesson({ ...modalAddLesson, opened: true, sectionId: sectionId });
  }

  const onEditLessonClick = (sectionId, lessonId) => {
    setModalEditLesson({ ...modalEditLesson, opened: true, sectionId: sectionId, lessonId: lessonId });
  }

  const onRemoveLessonClick = async (lessonId) => {
    try {
      // xóa video của bài học
      await axios.post(
        `/api/course/ins/delete-video/${user._id}`,
        {
          video_link: course?.lessons?.find(item => item._id === lessonId)?.video_link,
          instructorId: user._id
        }
      );

      // xóa bài học
      const { data } = await axios.put(
        `/api/course/ins/${course._id}/lesson/${lessonId}/delete`,
        { instructorId: user._id }
      );

      setCourse(data.data);
      message.success('Xóa bài học thành công');
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi xóa bài học, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  const onAddQuizClick = (lessonId) => {
    setModalAddQuiz({ ...modalAddQuiz, opened: true, lessonId });
  }

  const onEditQuizClick = (lessonId, quizId) => {
    setModalEditQuiz({ ...modalEditQuiz, opened: true, lessonId, quizId })
  }

  const onRemoveQuizClick = async (lessonId, quizId) => {
    try {
      const { data } = await axios.put(
        `/api/course/ins/${course._id}/lesson/${lessonId}/quiz/${quizId}/delete`,
        { instructorId: user._id }
      );

      setCourse(data.data);
      message.success('Xóa quiz thành công');
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi xóa quiz, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  // table realted: quiz
  const quizTableRender = (record, index, indent, expanded) => {
    const quizTableColumns = [
      {
        dataIndex: 'question',
        title: 'Câu hỏi',
      },
      {
        dataIndex: 'answer',
        title: 'Các lựa chọn',
        width: '172px',
        align: 'center'
      },
      {
        dataIndex: 'correctAnswer',
        title: 'Câu trả lời đúng',
        width: '172px',
        align: 'center'
      },
      !isViewing
        ? {
          dataIndex: 'operation',
          title: 'Thao tác',
          width: '128px',
          align: 'center'
        }
        : {}
    ];

    const quizTableData = [];
    course?.quizzes?.forEach(item => {
      if (item?.lesson === record.key) {
        const CorrectAnswerDisplay = ({ correctanswer }) => {
          const _ = correctanswer?.find(item => item?.value === true);

          return <p style={{ fontSize: '16px' }}>
            <b>{_?.index === 1 ? 'A' : _?.index === 2 ? 'B' : _?.index === 3 ? 'C' : _?.index === 4 && 'D'}</b>
          </p>
        }

        quizTableData.push({
          key: item?._id,
          question: item?.question,
          answer: <EyeOutlined
            style={{ cursor: 'pointer', fontSize: '16px' }}
            onClick={() => setModalShowSelections({ ...modalShowSelections, opened: true, quizId: item?._id })}
          />,
          correctAnswer: <CorrectAnswerDisplay correctanswer={item?.correctAnswer} />,
          operation: (
            <Space diretion='horizontal' size='small'>
              <Tooltip title='Chỉnh sửa'>
                <EditOutlined
                  className={styles.operation_icon}
                  style={{ cursor: 'pointer', fontSize: '16px', color: 'orange' }}
                  onClick={() => onEditQuizClick(record.key, item?._id)}
                />
              </Tooltip>
              <Popconfirm
                title={<p>Bạn có chắc muốn xóa quiz này ?</p>}
                okText='Đồng ý'
                cancelText='Hủy'
                onConfirm={() => onRemoveQuizClick(record.key, item?._id)}
              >
                <MinusCircleOutlined
                  className={styles.operation_icon}
                  style={{ cursor: 'pointer', fontSize: '16px', color: 'red' }}
                />
              </Popconfirm>
            </Space>
          )
        })
      }
    });

    return (
      <Table
        columns={quizTableColumns}
        dataSource={quizTableData}
        pagination={false}
        rowClassName='quiz_row'
      />
    )
  }

  // table related: lesson
  const lessonTableRender = (record, index, indent, expanded) => {
    const lessonTableColumns = [
      {
        dataIndex: 'index',
        title: 'Bài số',
        width: '92px',
        align: 'right'
      },
      {
        dataIndex: 'title',
        title: 'Tên bài',
        width: '256px'
      },
      {
        dataIndex: 'content',
        title: 'Tóm tắt nội dung',
        width: '832px'
      },
      {
        dataIndex: 'video_link',
        title: 'Video',
        align: 'center'
      },
      {
        dataIndex: 'free_preview',
        title: 'Xem trước ?',
        align: 'center',
        width: '132px'
      },
      !isViewing
        ? {
          dataIndex: 'operation',
          title: 'Thao tác',
          width: '156px',
          align: 'center'
        }
        : {}
    ];

    const lessonTableData = [];
    course?.lessons?.forEach(item => {
      let numOfQuizzes = 0;
      course?.quizzes?.forEach(_item => { if (_item.lesson === item._id) numOfQuizzes += 1 });

      if (item?.section?._id === record.key)
        lessonTableData.push({
          key: item._id,
          numOfQuizzes, //used for checking expandable
          index: item.index,
          title: <Tooltip title={item.title}>{item.title}</Tooltip>,
          content: <Tooltip title={item.content}>{item.content}</Tooltip>,
          video_link: <div>
            <Tooltip title='Xem video'>
              <EyeOutlined
                className={styles.operation_icon}
                style={{ cursor: 'pointer', fontSize: '18px' }}
                onClick={() => setModalVideo({ ...modalVideo, opened: true, lessonId: item?._id })}
              />
            </Tooltip>
          </div>,
          free_preview: <div>
            {/* <Switch checked={item.free_preview} /> */}
            <Checkbox checked={item.free_preview} />
          </div>,
          operation: (
            <Space diretion='horizontal' size='small'>
              <Tooltip title='Chỉnh sửa'>
                <EditOutlined
                  className={styles.operation_icon}
                  style={{ cursor: 'pointer', fontSize: '16px', color: 'orange' }}
                  onClick={() => onEditLessonClick(record.key, item._id)}
                />
              </Tooltip>
              <Tooltip title={numOfQuizzes > 0 ? 'Hiện tại bài học này đã có quiz' : 'Thêm quiz mới'}>
                <PlusOutlined
                  className={styles.operation_icon}
                  style={{ cursor: 'pointer', fontSize: '16px', color: 'green' }}
                  onClick={numOfQuizzes <= 0 && (() => onAddQuizClick(item?._id))}
                />
              </Tooltip>
              <Popconfirm
                title={<p>Bạn có chắc muốn xóa bài <b>{item.title}</b>?</p>}
                okText='Đồng ý'
                cancelText='Hủy'
                onConfirm={() => onRemoveLessonClick(item?._id)}
              >
                <MinusCircleOutlined
                  className={styles.operation_icon}
                  style={{ cursor: 'pointer', fontSize: '16px', color: 'red' }}
                />
              </Popconfirm>
            </Space>
          )
        })
    });
    lessonTableData.sort((a, b) => a.index - b.index)

    return (
      <Table
        columns={lessonTableColumns}
        dataSource={lessonTableData}
        pagination={false}
        expandable={{
          expandedRowRender: quizTableRender,
          rowExpandable: (record) => record.numOfQuizzes > 0
        }}
        rowClassName='lesson_row'
      />
    )
  }

  const columns = [
    {
      dataIndex: 'index',
      title: 'Chương số',
      width: '132px',
      align: 'right',
    },
    {
      dataIndex: 'name',
      title: 'Tên Chương'
    },
    !isViewing
      ? {
        dataIndex: 'operation',
        title: 'Thao tác',
        width: '224px',
        align: 'center'
      }
      : {}
  ];

  const dataSource = [];
  course?.sections?.forEach((itemSection) => {
    let numOfLessons = 0;
    course?.lessons?.forEach(item => { if (item?.section?._id === itemSection?._id) numOfLessons += 1 });

    dataSource.push({
      key: itemSection._id,
      numOfLessons, // used for checking expandableRow
      index: itemSection.index,
      name: <Space direction='horizontal' style={{ width: '100%', justifyContent: 'space-between' }}>
        <Tooltip title={itemSection.name}>{itemSection.name}</Tooltip>
        <p>({numOfLessons} bài học)</p>
      </Space>,
      operation: (
        <Space diretion='horizontal' size='small'>
          <Tooltip title='Chỉnh sửa'>
            <EditOutlined
              className={styles.operation_icon}
              style={{ cursor: 'pointer', fontSize: '16px', color: 'orange' }}
              onClick={() => onEditSectionClick(itemSection._id)}
            />
          </Tooltip>
          <Tooltip title='Thêm bài học mới'>
            <PlusOutlined
              className={styles.operation_icon}
              style={{ cursor: 'pointer', fontSize: '16px', color: 'green' }}
              onClick={() => onAddLessonClick(itemSection._id)}
            />
          </Tooltip>
          <Tooltip title={numOfLessons <= 0 ? 'Xóa' : 'Bạn không thể xóa chương này vì đang có bài học'}>
            <Popconfirm
              disabled={numOfLessons <= 0 ? false : true} // if that sections container at least 1 lesson, disable
              title={<p>Bạn có muốn xóa Chương <b>{itemSection.index}</b></p>}
              okText='Đồng ý'
              cancelText='Hủy'
              onConfirm={() => onDeleteSectionClick(itemSection._id)}
            >
              <MinusCircleOutlined
                className={styles.operation_icon}
                style={{ cursor: 'pointer', fontSize: '16px', color: 'red' }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    })
  });
  dataSource.sort((a, b) => a.index - b.index);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        expandable={{
          expandedRowRender: lessonTableRender,
          rowExpandable: (record) => record.numOfLessons > 0
        }}
        pagination={false}
        rowClassName='section_row'
      />

      <ModalAddSection
        isEdit={true} // isEdit
        sectionId={modalEditSection.sectionId}  // isEdit
        course={course}
        setCourse={setCourse}
        modalAddSection={modalEditSection}
        setModalAddSection={setModalEditSection}
      />

      {
        modalVideo.opened && (
          <ModalVideo
            course={course}
            modalVideo={modalVideo}
            setModalVideo={setModalVideo}
          />
        )
      }

      {
        modalShowSelections.opened && (
          <ModalShowSelections
            course={course}
            modalShowSelections={modalShowSelections}
            setModalShowSelections={setModalShowSelections}
          />
        )
      }

      {
        modalAddLesson.opened && (
          <_ModalAddLesson
            course={course}
            setCourse={setCourse}
            modalAddLesson={modalAddLesson} // { opened, sectionId }
            setModalAddLesson={setModalAddLesson}
          />
        )
      }

      {
        modalEditLesson.opened && (
          <_ModalAddLesson
            isEdit={true}
            course={course}
            setCourse={setCourse}
            modalEditLesson={modalEditLesson} // { opened, sectionId, lessonId }
            setModalEditLesson={setModalEditLesson}
          />
        )
      }

      {
        modalAddQuiz && (
          <ModalAddQuiz
            course={course}
            setCourse={setCourse}
            modalAddQuiz={modalAddQuiz}
            setModalAddQuiz={setModalAddQuiz}
          />
        )
      }

      {
        modalEditQuiz && (
          <ModalAddQuiz
            isEdit={true}
            course={course}
            setCourse={setCourse}
            modalEditQuiz={modalEditQuiz}
            setModalEditQuiz={setModalEditQuiz}
          />
        )
      }
    </div>
  )
}

export default TableSection;