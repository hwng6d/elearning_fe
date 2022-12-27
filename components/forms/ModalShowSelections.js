import { Modal, Space } from "antd"
import { useState, useEffect } from 'react';

const ModalShowSelections = ({
  course,
  modalShowSelections,
  setModalShowSelections,
}) => {
  // states
  const [quiz, setQuiz] = useState({});

  // functions
  const getQuiz = () => {
    const _quiz = course?.quizzes?.find(item => item?._id === modalShowSelections.quizId);
    setQuiz(_quiz);
  }

  useEffect(() => {
    getQuiz();
  }, [modalShowSelections])

  return (
    <Modal
      width={480}
      title='Các lựa chọn'
      open={modalShowSelections.opened}
      footer={null}
      onCancel={() => setModalShowSelections({ ...modalShowSelections, opened: false, quizId: '' })}
    >
      <Space
        direction='vertical'
        style={{ width: '100%' }}
      >
        {
          quiz?.answer?.map(item => {
            return (
              <Space key={item?.index} direction='horizontal' size='small'>
                <span ><b>{item?.index === 1 ? 'A.' : item?.index === 2 ? 'B.' : item?.index === 3 ? 'C.' : item?.index === 4 ? 'D' : ''}</b></span>
                <span >{item?.value}</span>
              </Space>
            )
          })
        }
      </Space>
    </Modal>
  )
};

export default ModalShowSelections;