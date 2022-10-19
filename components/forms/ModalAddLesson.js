import { Button, Input, Modal, Space, Upload, Progress, Tooltip, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { CheckOutlined, ToTopOutlined, UploadOutlined } from '@ant-design/icons';
import Plyr from 'plyr-react';
import styles from '../../styles/components/forms/ModalAddLesson.module.scss';

const ModalAddLesson = ({
  modalAddLessonOpened,
  setModalAddLessonOpened,
  videoChangeHandler,
  newLesson,
  setNewLesson,
  videosUpload,
  progressUploadVideo,
  videoRemoveHandler,
  uploadVideoHandler,
  addLessonHandler,
  validateMessage,
  setValidateMessage,
}) => {

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
          title={(!newLesson.title || !Object.keys(newLesson.video_link).length) ? 'Tiêu đề và video là bắt buộc' : 'Hoàn tất'}
        >
          <Button
            type='primary'
            disabled={!newLesson.title || !Object.keys(newLesson.video_link).length}
            onClick={addLessonHandler}>Hoàn tất</Button>
        </Tooltip>
      )}
    >
      <form
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
              onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
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
      </form>
    </Modal>
  )
}

export default React.memo(ModalAddLesson);