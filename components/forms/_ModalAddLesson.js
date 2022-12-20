import { Button, Input, Modal, Space, Upload, Progress, Tooltip, Switch, message, InputNumber, Select } from 'antd';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Context } from '../../context';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import Plyr from 'plyr-react';
import loadVideo from '../../utils/loadVideo';
import axios from 'axios';
import { findMax } from '../../utils/findMax';
import styles from '../../styles/components/forms/ModalAddLesson.module.scss';

const _ModalAddLesson = ({
  isEdit = false, // isEdit
  modalEditLesson,  // isEdit { opened, sectionId, lessonId }
  setModalEditLesson, // isEdit
  course,
  setCourse,
  modalAddLesson, // { opened, sectionId }
  setModalAddLesson,
  getCourseBySlug,
}) => {
  // global context
  const { state: { user } } = useContext(Context);

  // router
  const router = useRouter();

  // states
  const [newLesson, setNewLesson] = useState({
    index: -1,
    section: !isEdit ? modalAddLesson.sectionId : modalEditLesson.sectionId,
    title: '',
    content: '',
    duration: 0,
    video_link: {},
    free_preview: false
  });
  const [originAtEdit, setOriginAtEdit] = useState({ section: -1, index: -1 });
  const [validateMessage, setValidateMessage] = useState('');
  const [progressUploadVideo, setProgressUploadVideo] = useState(0);
  const [videosUpload, setVideosUpload] = useState([]);

  // variables
  let lessonIndexInSection = [];
  course?.lessons?.forEach(lesson => {
    if (modalAddLesson)
      if (lesson?.section?._id === modalAddLesson.sectionId)
        lessonIndexInSection.push(lesson?.index ? +lesson?.index : -1);
  });
  const maxLessonIndexInSection = findMax(lessonIndexInSection);

  const sectionsSelectItems = course?.sections?.map(section => {
    return {
      value: section?._id,
      label: <Space size='large' split='|'><p>Chương {section?.index}</p><p>{section?.name}</p></Space>,
      index: section?.index // just use for sorting below
    }
  }).sort((a, b) => a.index - b.index);

  // functions
  const PlyrPlayer = useMemo(() => {
    return (
      <Plyr
        source={{
          type: 'video',
          sources: [
            {
              src: newLesson?.video_link?.Location,
              provider: 'html5'
            }
          ]
        }}
      />
    )
  }, [newLesson.video_link]);

  const videoChangeHandler = async ({ file, fileList, event }) => {
    setVideosUpload(fileList);
    setValidateMessage(<div></div>);
  }

  const videoRemoveHandler = () => {
    setProgressUploadVideo(0);
    setVideosUpload([])
  }

  const getLessonInfo = () => {
    const lesson = course?.lessons?.find(lesson => lesson?._id === modalEditLesson.lessonId);
    setOriginAtEdit({ ...originAtEdit, section: lesson?.section?._id, index: lesson?.index });
    setNewLesson({
      ...newLesson,
      index: lesson?.index,
      title: lesson?.title,
      content: lesson?.content,
      duration: lesson?.duration,
      video_link: lesson?.video_link,
      free_preview: lesson?.free_preview,
      section: lesson?.section?._id,
    });
  }

  const onSectionChange = (sectionId) => {
    if (sectionId !== originAtEdit.section) {
      const lessonIndexes = course?.lessons?.filter(lesson => lesson?.section?._id === sectionId)?.map(lesson => lesson?.index);
      const maxLessonIndexes = findMax(lessonIndexes);
      setNewLesson({...newLesson, section: sectionId, index: maxLessonIndexes + 1});
    } else {
      setNewLesson({...newLesson, section: sectionId, index: originAtEdit.index});
    }
  }

  const closeModalHandler = async () => {
    try {
      if (!isEdit) {
        // delete current uploaded video
        if (Object.keys(newLesson.video_link).length)
          await axios.post(
            `/api/course/ins/delete-video/${course.instructor._id}`,
            { video_link: newLesson.video_link }
          );

        setModalAddLesson({ ...modalAddLesson, opened: false, sectionId: '' })
      } else {
        setModalEditLesson({ ...modalEditLesson, opened: false, sectionId: '', lessonId: '' })
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi đóng cửa sổ, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  const uploadVideoHandler = async () => {
    try {
      setValidateMessage(<span style={{ color: '#4e96ff', padding: '4px 0px' }}>Đang tải lên video...</span>);
      const file = videosUpload[0]?.originFileObj;
      if (!file) {
        setValidateMessage(<span style={{ color: 'red', padding: '4px 0px' }}>Vui lòng chọn video</span>);
        return;
      }

      const videoInfo = await loadVideo(file);

      // set video file for uploading to s3
      const videoData = new FormData();
      videoData.append("video", file);

      // send request to BE to upload video
      const { data: videoResponse } = await axios.post(
        `/api/course/ins/upload-video/${user._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            // console.log('e onUploadProgress: ', e);
            setProgressUploadVideo(30);
          }
        }
      );

      setProgressUploadVideo(100);
      setNewLesson({ ...newLesson, duration: Math.round(videoInfo.duration), video_link: videoResponse.data });
      setValidateMessage('');
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi tải lên video, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  const addLessonHandler = async () => {
    try {
      // validate
      if (!newLesson.section) {
        setValidateMessage(<span style={{ color: 'red', padding: '4px 0px' }}>Vui lòng chọn chương</span>);
        return;
      }
      if (!newLesson.title) {
        setValidateMessage(<span style={{ color: 'red', padding: '4px 0px' }}>Vui lòng nhập tiêu đề</span>);
        return;
      }
      if (!videosUpload.length && !isEdit) {
        setValidateMessage(<span style={{ color: 'red', padding: '4px 0px' }}>Vui lòng chọn video</span>);
        return;
      }
      if (!Object.keys(newLesson.video_link).length) {
        setValidateMessage(<span style={{ color: 'red', padding: '4px 0px' }}>Vui lòng tải lên video</span>);
        return;
      }

      console.log('newLesson: ', newLesson);

      if (!isEdit) {
        // send request to BE to add new lesson
        await axios.post(
          `/api/course/ins/${course._id}/lesson`,
          // { ...newLesson, instructorId: course.instructor._id, video_link: newLesson.video_link }
          { ...newLesson, instructorId: user._id }
        );

        getCourseBySlug();

        // notify and set everything to be original
        setNewLesson({ index: -1, section: '', title: '', content: '', duration: 0, video_link: {}, free_preview: false });
        setVideosUpload([]);
        setValidateMessage('');
        setProgressUploadVideo(0);
        setModalAddLesson({ ...modalAddLesson, opened: false, sectionId: '' });
        message.success('Thêm bài học thành công !');
      } else {
        // send request to BE to edit lesson
        await axios.put(
          `/api/course/ins/${course._id}/lesson/${modalEditLesson.lessonId}/update`,
          {
            lesson: newLesson,
            instructorId: user._id,
            sameIndexAcceptable:
              (newLesson.index === originAtEdit.index && newLesson.section === originAtEdit.section)
                ? true
                : false
          }
        );

        getCourseBySlug();

        // notify and set everything to be original
        setNewLesson({ index: -1, section: '', title: '', content: '', duration: 0, video_link: {}, free_preview: false });
        setVideosUpload([]);
        setValidateMessage('');
        setProgressUploadVideo(0);
        setOriginAtEdit({ ...originAtEdit, section: -1, index: -1 });
        setModalEditLesson({ ...modalEditLesson, opened: false, sectionId: '', lessonId: '' });
        message.success('Cập nhật bài học thành công !');
      }
    }
    catch (error) {
      if (error?.response?.data?.message === `Index is taken, please choose another one`)
        message.error('Số thứ tự đã tồn tại trong chương này, vui lòng thử lại');
      else
        message.error(`Xảy ra lỗi khi thêm bài học, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      if (!isEdit) {
        setNewLesson({ ...newLesson, index: maxLessonIndexInSection + 1 });
      } else {
        getLessonInfo();
      }
    }
  }, [modalAddLesson, modalEditLesson]);

  return (
    <Modal
      className={styles.container}
      title={<b>{isEdit ? 'Cập nhật' : 'Thêm'} bài học</b>}
      open={!isEdit ? modalAddLesson.opened : modalEditLesson.opened}
      centered={true}
      maskClosable={false}
      onCancel={closeModalHandler}
      footer={(
        <Tooltip
          title={(!newLesson.title || !Object.keys(newLesson.video_link).length) ? 'Tiêu đề và video là bắt buộc' : 'Hoàn tất'}
        >
          <Button
            type='primary'
            disabled={!newLesson.title || !Object.keys(newLesson.video_link).length}
            onClick={addLessonHandler}>Hoàn tất</Button>
        </Tooltip>
      )}
    >
      <div
        className={styles.form}
      >
        <div
          className={styles.form_section}
        >
          <div
            className={styles.d_flex_col}
          >
            <label><b>Chương *</b></label>
            <Select
              disabled={!isEdit}
              options={sectionsSelectItems}
              defaultValue={
                newLesson.section
              }
              style={{ width: '100%', marginTop: '8px' }}
              onChange={(value) => onSectionChange(value)}
            />
          </div>
        </div>
        <div
          className={styles.form_lessonIndex}
          style={{ marginTop: '12px' }}
        >
          <div
            className={styles.d_flex_col}
          >
            <label><b>Số thứ tự bài *</b></label>
            <InputNumber
              placeholder='Chọn số thứ tự bài'
              min={1}
              value={newLesson.index}
              onChange={(value) => {
                setNewLesson({ ...newLesson, index: value });
              }}
              style={{ width: '100%', fontSize: '16px', marginTop: '8px' }}
            />
          </div>
        </div>
        <div
          className={styles.form_title}
          style={{ marginTop: '12px' }}
        >
          <div
            className={styles.d_flex_col}
          >
            <label><b>Tiêu đề *</b></label>
            <Input
              placeholder='Nhập tiêu đề'
              value={newLesson.title}
              onChange={(e) => {
                e.preventDefault();
                setNewLesson({ ...newLesson, title: e.target.value });
                setValidateMessage(!e.target.value && <span style={{ color: 'red', padding: '4px 0px' }}>Vui lòng nhập tiêu đề</span>)
              }}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>
        </div>
        <div
          className={styles.form_content}
          style={{ marginTop: '12px' }}
        >
          <div
            className={styles.d_flex_col}
          >
            <label><b>Tóm tắt nội dung</b></label>
            <Input.TextArea
              placeholder='Nhập tóm tắt nội dung'
              value={newLesson.content}
              onChange={(e) => {
                e.preventDefault();
                setNewLesson({ ...newLesson, content: e.target.value })
              }}
              style={{ height: '128px', width: '100%', marginTop: '8px' }}
            />
          </div>
        </div>
        <div
          className={styles.form_freepreview}
          style={{ marginTop: '12px' }}
        >
          <Space
            direction='horizontal'
            size='middle'
          >
            <label><b>Cho phép xem trước ?</b></label>
            <Switch
              checked={newLesson.free_preview}
              onChange={(value) => setNewLesson({ ...newLesson, free_preview: value })}
            />
          </Space>
        </div>
        <div
          className={styles.form_video}
          style={{ marginTop: '12px' }}
        >
          <Space
            direction='horizontal'
          >
            <label><b>Video *</b></label>
            <Upload
              className={styles.form_video_upload}
              type='file'
              accept='video/*'
              maxCount={1}
              fileList={videosUpload}
              onChange={videoChangeHandler}
              onRemove={videoRemoveHandler}
            >
              <Button icon={<UploadOutlined />} style={{ border: 'none', padding: '4px 0px' }} >Chọn video</Button>
            </Upload>
            {videosUpload.length !== 0 && <Button
              disabled={progressUploadVideo === 100}
              onClick={uploadVideoHandler}
            >Tải lên video</Button>}
            {progressUploadVideo === 100 && <CheckOutlined style={{ color: 'green', fontSize: '16px' }} />}
          </Space>
          {progressUploadVideo > 0 && progressUploadVideo !== 100 && (
            <Progress
              percent={progressUploadVideo}
            />
          )}
          {(progressUploadVideo === 100 || isEdit) && (
            <div style={{ width: '100%', marginTop: '12px' }}>
              {PlyrPlayer}
            </div>
          )}
        </div>
        {validateMessage && (
          <p style={{ color: 'red', padding: '4px 0px' }}>{validateMessage}</p>
        )}
      </div>
    </Modal>
  )
}

export default React.memo(_ModalAddLesson);