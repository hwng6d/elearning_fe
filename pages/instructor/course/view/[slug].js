import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Popover, Space, Tooltip, Avatar, message, Modal, Upload, Button, Image, List, Popconfirm, BackTop } from 'antd';
import { EditOutlined, PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import ReactMarkdown from 'react-markdown';
// import ModalAddLesson from '../../../../components/forms/ModalAddLesson';
// import ModalEditLesson from '../../../../components/forms/ModalEditLesson';
import ModalEditCourse from '../../../../components/forms/ModalEditCourse';
import { getBase64 } from '../../../../utils/getBase64';
import ModalAddSection from '../../../../components/forms/ModalAddSection';
import TableSection from '../../../../components/tables/TableSection';
import styles from '../../../../styles/components/instructor/course/view/[slug].module.scss';

function CourseView() {
  const router = useRouter();
  const { slug } = router.query;

  // #region ***** STATES *****

  // #region | current component
  const [course, setCourse] = useState({});
  const [hide, setHide] = useState(false);
  const [isDesSeeMore, setIsDesSeeMore] = useState(false);
  const [previewImgObj, setPreviewImgObj] = useState({
    previewImgs: [],
    currentPreviewImg: '',
    modalImgOpened: false,
    modalPreviewImgOpened: false,
    uploadLoading: false,
  });
  const [modalAddLessonOpened, setModalAddLessonOpened] = useState(false);
  const [modalEditCourse, setModalEditCourse] = useState({ opened: false, which: '' });
  const [modalEditLesson, setModalEditLesson] = useState({ opened: false, which: '' });

  const [modalAddSection, setModalAddSection] = useState({ opened: false, sectionId: '' });
  // #endregion

  // #endregion

  // #region ***** FUNCTIONS *****

  // #region | current component
  const getCourseBySlug = async () => {
    const { data } = await axios.get(`/api/course/ins/${slug}`);
    setCourse(data.data);
  }

  const seeDesMoreHandler = (isSeeMore) => setIsDesSeeMore(isSeeMore);

  const updateImageHandler = async (e) => {
    setPreviewImgObj({ ...previewImgObj, uploadLoading: true });
    try {
      const base64 = await getBase64(previewImgObj.previewImgs[0].originFileObj);

      // delete current image if have
      course.image &&
        (await axios.post('/api/course/ins/remove-image', { image: course.image }));

      // upload to s3
      const { data: uploadImgReponse } = await axios.post('/api/course/ins/upload-image', { image: base64 });

      // update image of course
      const { data: updateCourseReponse } = await axios.put(`/api/course/ins/${course._id}`, { image: uploadImgReponse.data });

      // set stuffs...
      message.success(`Cập nhật thành công khóa học ${updateCourseReponse.data.name}`);
      setCourse(updateCourseReponse.data);
      setPreviewImgObj({ ...previewImgObj, modalImgOpened: false, previewImgs: [], currentPreviewImg: '', uploadLoading: false });
    }
    catch (error) {
      console.log('error: ', error);
      message.error(`Tải hình lên thất bại, hãy thử lại.\nChi tiết: ${error.message}`);
      setPreviewImgObj({ ...previewImgObj, modalImgOpened: false, previewImgs: [], currentPreviewImg: '', uploadLoading: false });
    }
  }

  const previewImageHandler = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImgObj({ ...previewImgObj, currentPreviewImg: file.url || file.preview, modalPreviewImgOpened: true });
  }

  const deleteLessonHandler = async (lessonId, video_link) => {
    try {
      // xóa video của bài học
      await axios.post(
        `/api/course/ins/delete-video/${course.instructor._id}`,
        { video_link, instructorId: course.instructor._id }
      );

      // xóa bài học
      await axios.put(
        `/api/course/ins/${course._id}/lesson/${lessonId}/delete`,
        { instructorId: course.instructor._id }
      );
      getCourseBySlug();
      message.success('Xóa bài học thành công!')
    }
    catch (error) {
      message.error(`Xảy ra lỗi xóa khóa học, vui lòng thử lại\nChi tiết: ${error.message}`)
    }
  }
  // #endregion

  // #endregion

  useEffect(() => {
    getCourseBySlug();
  }, [slug]);

  return (
    <InstructorRoute hideSidebar={false}>
      <BackTop />
      <div
        className={styles.container}
      >
        <div
          className={styles.container_overview}
        >
          <div
            className={styles.container_overview_left}
          >
            <div
              className={styles.overview_detail}
            >
              <div
                className={styles.overview_detail_left}
              >
                <Popover
                  color='#6b96ff'
                  placement='right'
                  content={(
                    <div>
                      <Tooltip title={course?.image ? 'Chỉnh sửa ảnh bìa' : 'Thêm ảnh bìa'}>
                        <EditOutlined
                          style={{ fontWeight: '600', fontSize: '24px', color: 'white', cursor: 'pointer' }}
                          onClick={() => setPreviewImgObj({ ...previewImgObj, modalImgOpened: true })}
                        />
                      </Tooltip>
                    </div>)}
                >
                  <img
                    height={!course?.image ? '64px' : '210px'}
                    src={course?.image ? course?.image?.Location : '/no-photo.png'}
                    style={{ width: 'inherit', height: 'inherit', objectFit: course?.image?.Location ? 'cover' : 'scale-down' }}
                  />
                </Popover>
              </div>
              <div
                className={styles.overview_detail_right}
              >
                <Space size='middle' direction='vertical'>
                  <h1 className={styles.h1}>{course?.name}</h1>
                  <p style={{ fontSize: '16px' }}><b>Giá |</b> {course?.price}</p>
                  <p style={{ fontSize: '16px' }}><b>Tag |</b> {course?.category}</p>
                  <p style={{ fontSize: '16px' }}><b>{course?.lessons?.length}</b> bài học</p>
                </Space>
              </div>
            </div>
          </div>
          <div
            className={styles.container_overview_right}
          >
            <Tooltip title='Chỉnh sửa' style={{ backgroundColor: 'red' }} >
              <EditOutlined
                className={styles.btn_edit_middle}
                style={{ color: 'red', fontSize: '24px', cursor: 'pointer' }}
                onClick={() => setModalEditCourse({ ...modalEditCourse, opened: true, which: 'general' })}
              />
            </Tooltip>
            {/* <Tooltip title='Hoàn tất'>
              <CheckOutlined className={styles.span} style={{ color: 'green', fontSize: '24px' }} />
            </Tooltip> */}
          </div>
        </div>
        <div
          className={styles.container_detail}
        >
          {/* Tóm tắt section */}
          <div
            className={styles.container_detail_summary}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className={styles.h2}>Tóm tắt</h2>
              <Tooltip title='Chỉnh sửa'>
                <EditOutlined
                  className={styles.btn_edit_small}
                  style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                  onClick={() => setModalEditCourse({ ...modalEditCourse, opened: true, which: 'summary' })}
                />
              </Tooltip>
            </div>
            <div
              className={styles.container_detail_summary_detail}
            >
              {course?.summary}
            </div>
          </div>
          {/* Mô tả section */}
          <div
            className={styles.container_detail_description}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className={styles.h2}>Mô tả</h2>
              <Tooltip title='Chỉnh sửa'>
                <EditOutlined
                  className={styles.btn_edit_small}
                  style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                  onClick={() => setModalEditCourse({ ...modalEditCourse, opened: true, which: 'description' })}
                />
              </Tooltip>
            </div>
            <div
              className={styles.container_detail_description_detail}
            >
              {
                isDesSeeMore
                  ? <ReactMarkdown children={course?.description} />
                  : <ReactMarkdown children={course?.description?.substring(0, 300)} />
              }
              {
                course?.description?.length > 300 && (
                  <div>
                    <hr style={{ borderTop: '1px dashed grey' }} />
                    <label
                      style={{ fontSize: '16px', cursor: 'pointer', color: 'blueviolet' }}
                      onClick={() => seeDesMoreHandler(!isDesSeeMore)}
                    >...{isDesSeeMore ? 'Rút gọn' : 'Xem thêm'}</label>
                  </div>
                )
              }
            </div>
          </div>
          {/* Các bài học section */}
          <div
            className={styles.container_detail_lessons}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className={styles.h2}>Các bài học</h2>
              |
              <p style={{ fontSize: '18px' }}>{course?.lessons?.length} bài học</p>
              {/* <Tooltip title='Thêm'>
                <PlusCircleOutlined
                  className={`${styles['btn_edit_small']} ${styles['btn_edit_small_lessons']}`}
                  style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                  onClick={() => setModalAddLessonOpened(!modalAddLessonOpened)}
                />
              </Tooltip> */}
              <Tooltip title='Thêm chương'>
                <PlusCircleOutlined
                  className={`${styles['btn_edit_small']} ${styles['btn_edit_small_lessons']}`}
                  style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                  onClick={() => setModalAddSection({...modalAddSection, opened: true})}
                />
              </Tooltip>
            </div>
            <div
              className={styles.container_detail_lessons_detail}
            >
              <TableSection
                course={course}
                setCourse={setCourse}
              />

              {/* <List
                itemLayout='horizontal'
                dataSource={course && course.lessons}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    className={styles.container_detail_lessons_detail_item}
                  >
                    <List.Item.Meta
                      style={{ alignItems: 'center' }}
                      avatar={<Avatar shape='square' size={36}><span style={{ fontSize: '16px' }}>{index + 1}</span></Avatar>}
                      title={<p style={{ fontSize: '16px' }}>{item.title}</p>}
                    />
                    <Popover
                      title='Tùy chọn'
                      placement='left'
                      content={
                        <Space direction='vertical' size='small' style={{ alignItems: 'flex-start' }}>
                          <Space
                            className={styles.container_detail_lessons_detail_item_popup_row}
                            direction='horizontal'
                            size='middle'
                            onClick={() => setModalEditLesson({ ...modalEditLesson, opened: true, which: item })}
                          >
                            <EditOutlined style={{ fontSize: '16px' }} />
                            Chỉnh sửa
                          </Space>

                          <Popconfirm
                            title={<p>Bạn có chắc muốn xóa bài <b>{item.title}</b>?</p>}
                            okText='Đồng ý'
                            cancelText='Hủy'
                            onConfirm={() => deleteLessonHandler(item._id, item.video_link)}
                          >
                            <Space
                              className={styles.container_detail_lessons_detail_item_popup_row}
                              direction='horizontal'
                              size='middle'
                            >
                              <DeleteOutlined style={{ fontSize: '16px' }} />
                              Xóa
                            </Space>
                          </Popconfirm>

                        </Space>
                      }
                    >
                      <EllipsisOutlined style={{ fontSize: '20px', padding: '8px' }} />
                    </Popover>
                  </List.Item>
                )}
              /> */}
            </div>
          </div>
        </div>

        <Modal
          title='Đổi ảnh bìa'
          maskClosable={false}
          open={previewImgObj.modalImgOpened}
          cancelText='Hủy'
          okText='Đồng ý'
          onCancel={() => setPreviewImgObj({ ...previewImgObj, modalImgOpened: false })}
          style={{ display: 'flex', justifyContent: 'center' }}
          footer={(<div>
            <Button
              type='primary'
              disabled={previewImgObj?.uploadLoading || !previewImgObj?.previewImgs.length}
              onClick={updateImageHandler}
            >Hoàn tất</Button>
          </div>)}
        >
          <div style={{ width: '384px', textAlign: 'center' }}>
            <Upload
              className={`custom-upload-horizontal-image ${previewImgObj?.previewImgs?.length && "disable_add_button"}`}
              accept='image/*'
              listType='picture-card'
              fileList={previewImgObj.previewImgs}
              onChange={(e) => setPreviewImgObj({ ...previewImgObj, previewImgs: e.fileList })}
              onPreview={previewImageHandler}
            >
              <Space direction='vertical'>
                <UploadOutlined />
                Chọn file
              </Space>
            </Upload>
          </div>
        </Modal>
        <Modal
          title={<b>Xem trước</b>}
          open={previewImgObj.modalPreviewImgOpened}
          footer={null}
          centered={true}
          width='896px'
          style={{ textAlign: 'center' }}
          onCancel={() => setPreviewImgObj({ ...previewImgObj, modalPreviewImgOpened: false })}
        >
          <Image
            alt='preview'
            src={previewImgObj?.currentPreviewImg}
            preview={false}
          />
        </Modal>

        <ModalEditCourse
          course={course}
          setCourse={setCourse}
          modalEditCourse={modalEditCourse}
          setModalEditCourse={setModalEditCourse}
        />

        {/* <ModalAddLesson
          course={course}
          setCourse={setCourse}
          modalAddLessonOpened={modalAddLessonOpened}
          setModalAddLessonOpened={setModalAddLessonOpened}
        /> */}

        <ModalAddSection
          course={course}
          setCourse={setCourse}
          modalAddSection={modalAddSection}
          setModalAddSection={setModalAddSection}
        />

        {/* <ModalEditLesson
          course={course}
          getCourseBySlug={getCourseBySlug} //setCourse
          modalEditLesson={modalEditLesson}
          setModalEditLesson={setModalEditLesson}
        /> */}

        <button style={{ opacity: '0.3' }} onClick={() => setHide(!hide)}>{hide ? 'Ẩn' : 'Hiện'}</button>
        {hide && <pre>{JSON.stringify(course, null, 4)}</pre>}
      </div>
    </InstructorRoute>


  )
}

export default CourseView;