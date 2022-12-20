import { Button, Input, Modal, Space, Tooltip, message, InputNumber } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Context } from '../../context/index';
import axios from 'axios';
import styles from '../../styles/components/forms/ModalAddSection.module.scss';

const ModalAddSection = ({
  isEdit = false, // isEdit
  sectionId = '', // isEdit
  getCourseBySlug,
  course,
  setCourse,
  modalAddSection,
  setModalAddSection,
}) => {
  // router
  const router = useRouter();

  // global context
  const { state: { user } } = useContext(Context);

  // states
  const [newSection, setNewSection] = useState({ index: 0, name: '' });
  const [originIndexAtEdit, setOriginIndexAtEdit] = useState(-1);  // just use for checking duplicate when editting

  // functions
  const closeModalHandler = async () => {
    try {
      setNewSection({ ...newSection, index: 1, name: '' });

      setModalAddSection({...modalAddSection, opened: false});
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi đóng cửa sổ này, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  const addSectionHandler = async () => {
    try {
      if (!isEdit) {
        await axios.post(
          `/api/course/ins/${course._id}/section`,
          { ...newSection, instructorId: user._id }
        );

        getCourseBySlug();

        setNewSection({ ...newSection, index: 1, name: '' });
        setModalAddSection({...modalAddSection, opened: false});
      } else {
        await axios.post(
          `/api/course/ins/${course._id}/section/${sectionId}/update`,
          {
            ...newSection,
            instructorId: user._id,
            sameIndexAcceptable: newSection.index === originIndexAtEdit ? true : false
          }
        );

        getCourseBySlug();

        setNewSection({ ...newSection, index: 1, name: '' });
        setOriginIndexAtEdit(-1);
        setModalAddSection({...modalAddSection, opened: false});
      }
    }
    catch (error) {
      if (error?.response?.data?.message === 'Exist current section index in this course')
        message.error('Số thứ tự chương hiện tại đã tồn tại trong khóa học này, vui lòng chọn lại.')
      else
        message.error(`Xảy ra lỗi khi ${isEdit ? 'sửa nội dung' : 'thêm'} chương, vui lòng thử lại.\nChi tiết: ${error}`)
    }
  }

  const getSectionInfo = async () => {
    const section = course?.sections?.find(item => item._id === sectionId);
    setNewSection({ ...newSection, index: section?.index, name: section?.name });
    setOriginIndexAtEdit(section?.index);
  }

  useEffect(() => {
    if (router.isReady) {
      if (isEdit) {
        getSectionInfo();
      }
    }
  }, [modalAddSection?.opened])

  return (
    <Modal
      className={styles.container}
      title={<b>{isEdit ? 'Sửa chương' : 'Thêm chương'}</b>}
      open={modalAddSection?.opened}
      centered={true}
      maskClosable={false}
      onCancel={closeModalHandler}
      footer={(
        <Tooltip
          title={(!newSection.index < 0 || !newSection.name) ? 'Thứ tự và tên chương là bắt buộc' : 'Hoàn tất'}
        >
          <Button
            type='primary'
            disabled={!newSection.index < 0 || !newSection.name}
            onClick={addSectionHandler}>Hoàn tất</Button>
        </Tooltip>
      )}
    >
      <div
        className={styles.form}
      >
        <div
          className={styles.form_sectionindex}
        >
          <div
            className={styles.d_fle_col}
          >
            <label><b>Số thứ tự chương *</b></label>
            <InputNumber
              placeholder='Chọn số thứ tự chương'
              min={0}
              value={newSection.index}
              onChange={(value) => {
                setNewSection({ ...newSection, index: value });
              }}
              style={{ width: '100%', fontSize: '16px', marginTop: '8px' }}
            />
          </div>
        </div>
        <div
          className={styles.form_sectionname}
        >
          <label><b>Tên chương *</b></label>
          <Input
            placeholder='Nhập tên chương'
            value={newSection.name}
            allowClear={true}
            onChange={(e) => {
              e.preventDefault();
              setNewSection({ ...newSection, name: e.target.value });
            }}
            style={{ marginTop: '8px', fontSize: '16px' }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default React.memo(ModalAddSection);