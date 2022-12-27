import { useEffect } from "react";
import { Modal, Input, Button, Tooltip, Rate, message } from "antd";
import axios from "axios";

const ModalAddReview = ({
  isEdit = false,
  modalEditReview,  // isEdit { opened, courseId, review }
  setModalEditReview,
  modalAddReview, // { opened, courseId },
  setModalAddReview,
  newReview,
  setNewReview,
  getReviewsOfCourse,
}) => {
  // functions 
  const onSubmitReviewClick = async () => {
    try {
      if (newReview.star <= 0 || !newReview.content.length) {
        message.error('Số sao hoặc nội dung không hợp lệ, vui lòng thử lại');
        return;
      }

      if (!isEdit) {
        await axios.post(
          `/api/review/course/${modalAddReview.courseId}`,
          { review: newReview }
        );
  
        setNewReview({...newReview, content: '', star: 0});
        setModalAddReview({...modalAddReview, opened: false});
      } else {
        await axios.put(
          `/api/review/course/${modalEditReview.courseId}/${modalEditReview.review._id}/update`,
          { review: newReview }
        );
  
        setModalEditReview({...modalEditReview, opened: false});
      }

      getReviewsOfCourse();
    }
    catch (error) {
      message.error(`Đã xảy ra lỗi khi thêm đánh giá. Chi tiết: ${error.message}`)
    }
  }

  const closeModalHandler = () => {
    if (!isEdit) {
      setModalAddReview({ ...modalAddReview, opened: false });
      setNewReview({...newReview, content: '', star: 0});
    } else {
      setModalEditReview({ ...modalEditReview, opened: false });
      setNewReview({...newReview, content: '', star: 0});
    }
  }

  const fetchUserReview = () => {
    setNewReview({...newReview, content: modalEditReview?.review?.content, star: modalEditReview?.review?.star});
  }

  useEffect(() => {
    fetchUserReview();
  }, [modalEditReview?.opened === true])

  return (
    <Modal
      title={<b>{isEdit ? 'Cập nhật' : 'Thêm'} Review</b>}
      open={!isEdit ? modalAddReview.opened : modalEditReview.opened}
      centered={true}
      maskClosable={false}
      onCancel={closeModalHandler}
      footer={(
        <Tooltip
          title={(!newReview?.star || !newReview?.content?.length) ? 'Số sao hoặc nội dung không hợp lệ' : 'Hoàn tất'}
        >
          <Button
            type='primary'
            disabled={!newReview?.star || !newReview?.content?.length}
            onClick={onSubmitReviewClick}>Hoàn tất</Button>
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
        >
          <Rate
            value={newReview.star}
            onChange={(value) => setNewReview({ ...newReview, star: value })}
            style={{ fontSize: '32px' }}
          />
        </div>
        <div
          style={{ width: '100%' }}
        >
          <Input.TextArea
            value={newReview.content}
            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
            placeholder='Nhập đánh giá của riêng bạn...'
            bordered={true}
            showCount={false}
            style={{
              height: newReview?.content?.length <= 148 ? '84px' : newReview?.content?.length <= 322 ? '108px' : '156px',
              border: '2px solid #b0b7bf',
              width: '100%',
              resize: 'none'
            }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default ModalAddReview;