import { Button, Input, Modal, Space, Upload, Progress, Tooltip, Switch, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { CheckOutlined, ToTopOutlined, UploadOutlined } from '@ant-design/icons';
import Plyr from 'plyr-react';
import loadVideo from '../../utils/loadVideo';
import axios from 'axios';
import styles from '../../styles/components/forms/ModalAddLesson.module.scss';

const ModalAddLesson = ({
  course,
  setCourse,
  modalAddLessonOpened,
  setModalAddLessonOpened,
}) => {
  // const [newLesson, setNewLesson] = useState({ title: '', content: '', video_link: {}, duration: 0, free_preview: false });
  const [newLesson, setNewLesson] = useState({ title: '', content: '', duration: 0, free_preview: false });
  const [videoLink, setVideoLink] = useState({});
  const [validateMessage, setValidateMessage] = useState('');
  const [progressUploadVideo, setProgressUploadVideo] = useState(0);
  const [videosUpload, setVideosUpload] = useState([]);

  const videoChangeHandler = async ({ file, fileList, event }) => {
    setVideosUpload(fileList);
    setValidateMessage(<div></div>);
  }

  const videoRemoveHandler = () => {
    setProgressUploadVideo(0);
    setVideosUpload([])
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
        `/api/course/upload-video/${course.instructor._id}`,
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
      setNewLesson({ ...newLesson, duration: Math.round(videoInfo.duration) });
      setVideoLink(videoResponse.data);
      setValidateMessage(<div></div>);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi tải lên video, vui lòng thử lại\nChi tiết: ${error.message}`)
    }
  }

  const addLessonHandler = async () => {
    console.log('newLesson: ', newLesson);
    try {
      // validate
      if (!newLesson.title) {
        setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng nhập tiêu đề</p>);
        return;
      }
      if (!videosUpload.length) {
        setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng chọn video</p>);
        return;
      }
      if (!Object.keys(videoLink).length) {
        setValidateMessage(<p style={{ color: 'red', padding: '4px 0px' }}>Vui lòng tải lên video</p>);
        return;
      }

      // send request to BE to add new lesson
      const { data: lessonResponse } = await axios.post(
        `/api/course/${course._id}/lesson`,
        { ...newLesson, instructorId: course.instructor._id, video_link: videoLink }
      );

      // notify and set everything to be original
      message.success('Thêm bài học thành công !');
      setCourse(lessonResponse.data);
      // setNewLesson({ title: '', content: '', duration: 0, video_link: {}, free_preview: false });
      setNewLesson({ title: '', content: '', duration: 0, free_preview: false });
      setVideoLink({})
      setVideosUpload([]);
      setValidateMessage(<div></div>);
      setProgressUploadVideo(0);
      setModalAddLessonOpened(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi tải lên video, vui lòng thử lại\nChi tiết: ${error.message}`)
    }
  }

  return (
    <Modal
      className={styles.container}
      title={<b>Thêm bài học</b>}
      open={modalAddLessonOpened}
      centered={true}
      maskClosable={false}
      onCancel={() => setModalAddLessonOpened(false)}
      footer={(
        <Tooltip
          title={(!newLesson.title || !Object.keys(videoLink).length) ? 'Tiêu đề và video là bắt buộc' : 'Hoàn tất'}
        >
          <Button
            type='primary'
            disabled={!newLesson.title || !Object.keys(videoLink).length}
            onClick={addLessonHandler}>Hoàn tất</Button>
        </Tooltip>
      )}
    >
      <div
        className={styles.form}
      >
        <div
          className={styles.form_title}
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
                      src: videoLink.Location,
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