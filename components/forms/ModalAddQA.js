import { useState, useEffect, useContext } from 'react';
import { Space, Modal, Input, Tooltip, Button, message } from 'antd';
import { Context } from '../../context';
import axios from 'axios';

const ModalAddQA = ({
  isEdit = false,
  modalAddQA,
  setModalAddQA,
  modalEditQA,
  setModalEditQA,
  newQA,
  setNewQA,
  currentLesson,
  getQAsOfLesson,
}) => {
  // global context
  const { state: { user } } = useContext(Context);

  // functions
  const onSubmitQAClick = async () => {
    try {
      console.log('newQA: ', newQA);

      if (!isEdit) {
        const { data } = await axios.post(
          `/api/qa/course/${modalAddQA?.courseId}/lesson/${currentLesson?._id}`,
          { qa: newQA }
        );

        setModalAddQA({...modalAddQA, opened: false, lessonId: ''});
        setNewQA({...newQA, content: '', title: ''});
        getQAsOfLesson();
      }
    }
    catch (error) {
      message.error(`Có lỗi xảy ra khi thêm Q&A. Chi tiết: ${error.message}.`)
    }
  }

  const closeModalHandler = () => {
    if (!isEdit) {
      setModalAddQA({...modalAddQA, opened: false});
      setNewQA({...newQA, title: '', content: ''});
    } else {
      setModalEditQA({...modalEditQA, opened: false});
    }
  }

  return (
    <Modal
      title={<b>{isEdit ? 'Cập nhật' : 'Thêm'} Hỏi đáp</b>}
      width={640}
      open={!isEdit ? modalAddQA.opened : modalEditQA.opened}
      centered={true}
      maskClosable={false}
      onCancel={closeModalHandler}
      footer={(
        <Tooltip
          title={(!newQA?.content?.length) ? 'Nội dung Q&A không hợp lệ' : 'Hoàn tất'}
        >
          <Button
            type='primary'
            disabled={!newQA?.content?.length}
            onClick={onSubmitQAClick}>Hoàn tất</Button>
        </Tooltip>
      )}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{ width: '100%' }}
        >
          <label><b>Tiêu đề</b></label>
          <Input
            value={newQA.title}
            onChange={(e) => setNewQA({...newQA, title: e.target.value})}
            placeholder='Nhập tiêu đề, ví dụ: Sự khác nhau giữa Despite, In spite of và Although là gì ?'
            style={{
              marginTop: '8px',
              border: '2px solid #b0b7bf',
              width: '100%',
              resize: 'none'
            }}
          />
        </div>
        <div
          style={{ width: '100%' }}
        >
          <label><b>Nội dung</b></label>
          <Input.TextArea
            value={newQA.content}
            onChange={(e) => setNewQA({ ...newQA, content: e.target.value })}
            placeholder='Nhập nội dung Q&A...'
            bordered={true}
            showCount={false}
            style={{
              height: newQA?.content?.length <= 148 ? '84px' : newQA?.content?.length <= 322 ? '108px' : '156px',
              width: '100%',
              marginTop: '8px',
              border: '2px solid #b0b7bf',
              resize: 'none'
            }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default ModalAddQA;