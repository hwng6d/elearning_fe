import { Button, Input, Modal, Space, Upload, Progress, Tooltip, Switch, message, Select, InputNumber } from 'antd';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CheckOutlined, ToTopOutlined, UploadOutlined } from '@ant-design/icons';
import Plyr from 'plyr-react';
import loadVideo from '../../utils/loadVideo';
import axios from 'axios';
import { findMax } from '../../utils/findMax';
import styles from '../../styles/components/forms/ModalAddLesson.module.scss';

const ModalAddLesson = ({
  isEdit = false, // isEdit
  sectionId,  // isEdit
  course,
  setCourse,
  modalAddLessonOpened,
  setModalAddLessonOpened,
}) => {
  // router
  const router = useRouter();

  // variables
  const lessonIndexes = course?.lessons?.map(lesson => { if (!lesson?.index) return -1; else return +lesson?.index });
  const maxLessonIndex = findMax(lessonIndexes);

  // states
  const [newLesson, setNewLesson] = useState({ index: -1, section: '', title: '', content: '', duration: 0, video_link: {}, free_preview: false });
  const [validateMessage, setValidateMessage] = useState('');
  const [progressUploadVideo, setProgressUploadVideo] = useState(0);
  const [videosUpload, setVideosUpload] = useState([]);

  const sectionsSelectItems = course?.sections?.map(section => {
    return {
      value: section?._id,
      label: <Space size='large' split='|'><p>Chương {section?.index}</p><p>{section?.name}</p></Space>,
      index: section?.index // just use for sorting below
    }
  }).sort((a, b) => a.index - b.index);

  // functions
  const videoChangeHandler = async ({ file, fileList, event }) => {
    setVideosUpload(fileList);
    setValidateMessage(<div></div>);
  }

  const videoRemoveHandler = () => {
    setProgressUploadVideo(0);
    setVideosUpload([])
  }

  const closeModalHandler = async () => {
    try {
      // delete current uploaded video
      if (Object.keys(newLesson.video_link).length)
        await axios.post(
          `/api/course/ins/delete-video/${course.instructor._id}`,
          { video_link: newLesson.video_link }
        );

      setModalAddLessonOpened(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi đóng cửa sổ, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  const uploadVideoHandler = async () => {
    try {
      setValidateMessage(<p style={{ color: '#4e96ff', padding: '4px 0px' }}>Đang tải lên video...</p>);
      const file = videosUpload[0]?.originFileObj;
      if (!file) {
        setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng chọn video</p>);
        return;
      }

      const videoInfo = await loadVideo(file);

      // set video file for uploading to s3
      const videoData = new FormData();
      videoData.append("video", file);

      // send request to BE to upload video
      const { data: videoResponse } = await axios.post(
        `/api/course/ins/upload-video/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            console.log('e onUploadProgress: ', e);
            setProgressUploadVideo(30);
          }
        }
      );

      setProgressUploadVideo(100);
      // setNewLesson({ ...newLesson, duration: Math.round(videoInfo.duration), video_link: videoResponse.data });
      setNewLesson({ ...newLesson, duration: Math.round(videoInfo.duration), video_link: videoResponse.data });
      setValidateMessage(<div></div>);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi tải lên video, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  const addLessonHandler = async () => {
    console.log('newLesson: ', newLesson);
    try {
      // validate
      if (!newLesson.section) {
        setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng chọn chương</p>);
        return;
      }
      if (!newLesson.title) {
        setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng nhập tiêu đề</p>);
        return;
      }
      if (!videosUpload.length) {
        setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng chọn video</p>);
        return;
      }
      if (!Object.keys(newLesson.video_link).length) {
        setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng tải lên video</p>);
        return;
      }

      // send request to BE to add new lesson
      const { data: lessonResponse } = await axios.post(
        `/api/course/ins/${course._id}/lesson`,
        { ...newLesson, instructorId: course.instructor._id, video_link: newLesson.video_link }
      );

      // notify and set everything to be original
      message.success('Thêm bài học thành công !');
      setCourse(lessonResponse.data);
      // setNewLesson({ title: '', content: '', duration: 0, video_link: {}, free_preview: false });
      setNewLesson({ title: '', content: '', duration: 0, video_link: {}, free_preview: false });
      setVideosUpload([]);
      setValidateMessage(<div></div>);
      setProgressUploadVideo(0);
      setModalAddLessonOpened(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi thêm bài học, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  return (
    <Modal
      className={styles.container}
      title={<b>Thêm bài học</b>}
      open={modalAddLessonOpened}
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
          <Space
            direction='vertical'
          >
            <label><b>Chương *</b></label>
            <Select
              labelInValue={true}
              options={sectionsSelectItems}
              defaultValue={
                isEdit && sectionsSelectItems.find(item => item.value === sectionId).value
              }
              value={newLesson.section}
              style={{ width: '100%' }}
              onChange={(value) => setNewLesson({...newLesson, section: value.key})}
            />
          </Space>
        </div>
        <div
          className={styles.form_lessonIndex}
          style={{ marginTop: '12px' }}
        >
          <Space
            direction='vertical'
          >
            <label><b>Số thứ tự bài *</b></label>
            <InputNumber
              placeholder='Chọn số thứ tự bài'
              min={1}
              defaultValue={maxLessonIndex + 1}
              // value={newLesson.index}
              onChange={(value) => {
                setNewLesson({ ...newLesson, index: value });
              }}
              style={{ width: '100%', fontSize: '16px' }}
            />
          </Space>
        </div>
        <div
          className={styles.form_title}
          style={{ marginTop: '12px' }}
        >
          <Space
            direction='vertical'
          >
            <label><b>Tiêu đề *</b></label>
            <Input
              placeholder='Nhập tiêu đề'
              value={newLesson.title}
              onChange={(e) => {
                e.preventDefault();
                setNewLesson({ ...newLesson, title: e.target.value });
                setValidateMessage(!e.target.value && <p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng nhập tiêu đề</p>)
              }}
            />
          </Space>
        </div>
        <div
          className={styles.form_content}
          style={{ marginTop: '12px' }}
        >
          <Space
            direction='vertical'
          >
            <label><b>Tóm tắt nội dung</b></label>
            <Input.TextArea
              placeholder='Nhập tóm tắt nội dung'
              style={{ height: '128px' }}
              value={newLesson.content}
              onChange={(e) => {
                e.preventDefault();
                setNewLesson({ ...newLesson, content: e.target.value })
              }}
            />
          </Space>
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
              defaultChecked={false}
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
          {progressUploadVideo === 100 && (
            <div style={{ width: '-webkit-fill-available', marginTop: '12px' }}>
              <Plyr
                source={{
                  type: 'video',
                  sources: [
                    {
                      src: newLesson.video_link.Location,
                      provider: 'html5'
                    }
                  ]
                }}
              />
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

export default React.memo(ModalAddLesson);