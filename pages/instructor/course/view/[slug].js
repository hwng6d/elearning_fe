import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Popover, Space, Tooltip, Avatar, message, Modal, Upload, Button, List, Popconfirm, BackTop } from 'antd';
import { CaretRightOutlined, EditOutlined, HighlightOutlined, PlusCircleOutlined, RightSquareOutlined, SwapOutlined, UploadOutlined } from '@ant-design/icons';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import ReactMarkdown from 'react-markdown';
import { Context } from '../../../../context';
import Image from 'next/image';
import ModalEditCourse from '../../../../components/forms/ModalEditCourse';
import { getBase64 } from '../../../../utils/getBase64';
import ModalAddSection from '../../../../components/forms/ModalAddSection';
import TableSection from '../../../../components/tables/TableSection';
import { getCourseStatus } from '../../../../utils/getCourseStatus';
import styles from '../../../../styles/components/instructor/course/view/[slug].module.scss';

function CourseView() {
  // global context
  const { state: { user } } = useContext(Context);

  // router
  const router = useRouter();
  const { slug } = router.query;

  // #region ***** STATES *****

  // #region | current component
  const [course, setCourse] = useState({});
  const [isDesSeeMore, setIsDesSeeMore] = useState(false);
  const [previewImgObj, setPreviewImgObj] = useState({
    previewImgs: [],
    currentPreviewImg: '',
    modalImgOpened: false,
    modalPreviewImgOpened: false,
    uploadLoading: false,
  });
  const [modalShowRejectReasonOpened, setModalShowRejectReasonOpened] = useState(false);
  const [modalEditCourse, setModalEditCourse] = useState({ opened: false, which: '' });
  const [modalAddSection, setModalAddSection] = useState({ opened: false, sectionId: '' });
  // #endregion

  // #endregion

  // variables

  // #region ***** FUNCTIONS *****

  // #region | current component
  const seeDesMoreHandler = (isSeeMore) => setIsDesSeeMore(isSeeMore);

  const onSubmitPublishClick = async () => {
    try {
      await axios.put(
        `/api/course/ins/${course?._id}/submit-publish`
      );

      getCourseBySlug();

      message.success('Nộp phê duyệt xuất bản thành công');
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi nộp phê duyệt xuất bản. Chi tiết: ${error.message}`);
    }
  }

  const onSubmitUndoPublishClick = async () => {
    try {
      await axios.put(
        `/api/course/ins/${course?._id}/submit-undopublish`
      );

      getCourseBySlug();

      message.success('Hoàn tác nộp phê duyệt xuất bản thành công');
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi hoàn tác nộp phê duyệt xuất bản. Chi tiết: ${error.message}`);
    }
  }

  const getCourseBySlug = async () => {
    const { data } = await axios.get(`/api/course/ins/${slug}`);
    setCourse(data.data);
  }

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
      const { data: updateCourseReponse } = await axios.put(
        `/api/course/ins/${course._id}`,
        { image: uploadImgReponse.data, name: course?.name }
      );

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
                        {
                          course?.status === 'unaccepted'
                            ? (
                              <p>Bạn không thể chỉnh sửa khóa học khi đang chờ phê duyệt !</p>
                            )
                            : (
                              <EditOutlined
                                style={{
                                  fontWeight: '600',
                                  fontSize: '24px',
                                  color: 'white'
                                }}
                                onClick={() => setPreviewImgObj({ ...previewImgObj, modalImgOpened: true })}
                              />
                            )
                        }
                      </Tooltip>
                    </div>
                  )}
                >
                  <div style={{ width: '337px', height: '210px' }}>
                    <Image
                      alt='no-photo'
                      src={course?.image ? course?.image?.Location : '/no-photo.png'}
                      height={!course?.image ? '64' : '210'}
                      width={337}
                      style={{
                        width: 'inherit',
                        height: 'inherit',
                        objectFit: course?.image?.Location ? 'cover' : 'scale-down'
                      }}
                    />
                  </div>
                </Popover>
              </div>
              <div
                className={styles.overview_detail_right}
              >
                <Space size='middle' direction='vertical'>
                  <h1 className={styles.h1}>{course?.name}</h1>
                  <p style={{ fontSize: '16px' }}><b>Giá |</b> {course?.price}</p>
                  <p style={{ fontSize: '16px' }}><b>Phân loại |</b> <Space split='-'>{course?.categoryInfo?.name}</Space></p>
                  <p style={{ fontSize: '16px' }}><b>Thẻ |</b> <Space split='-'>{course?.tags}</Space></p>
                  <Space split='|'>
                    <p style={{ fontSize: '16px' }}><b>{course?.sections?.length || 0}</b> chương</p>
                    <p style={{ fontSize: '16px' }}><b>{course?.lessons?.length || 0}</b> bài học</p>
                    <p style={{ fontSize: '16px' }}><b>{course?.quizzes?.length || 0}</b> bài quiz</p>
                  </Space>
                </Space>
              </div>
            </div>
          </div>
          <div
            className={styles.container_overview_right}
          >
            <Tooltip
              title={`${course?.status === 'unaccepted'
                ? 'Bạn không thể chỉnh sửa khóa học khi đang chờ phê duyệt !'
                : 'Chỉnh sửa'}`
              }
            >
              <EditOutlined
                className={styles.btn_edit_middle}
                style={{ color: 'red', fontSize: '24px', cursor: 'pointer' }}
                onClick={
                  course?.status !== 'unaccepted'
                  && (() => setModalEditCourse({ ...modalEditCourse, opened: true, which: 'general' }))
                }
              />
            </Tooltip>
          </div>
        </div>
        <div
          className={styles.container_detail}
        >
          {/* link to course section */}
          {
            course?.published && (
              <div
                className={`${styles.container_detail_coursepage} ${styles.d_flex_row}`}
                onClick={() => router.push(`/user/courses/${course?.slug}`)}
                style={{ gap: '8px', cursor: 'pointer' }}
              >
                Đi đến khóa học <RightSquareOutlined style={{ fontSize: '16px' }} />
              </div>
            )
          }
          {/* Xuất bản section */}
          <div
            className={styles.container_detail_publish}
          >
            <div
              className={styles.d_flex_row}
            >
              <div
                className={styles.d_flex_row}
              >
                <h2 className={styles.h2}>Tình trạng khóa học</h2>
                <div
                  style={{
                    fontWeight: 700,
                    color: 'white',
                    borderRadius: '8px',
                    padding: '4px 20px',
                    backgroundImage: `linear-gradient(to right, ${getCourseStatus(course)?.color}, #66c2a5)`
                  }}
                >{`${getCourseStatus(course)?.result}`}</div>
                {
                  course?.status === 'rejected' && (
                    <p
                      style={{ cursor: 'pointer' }}
                      onClick={() => setModalShowRejectReasonOpened(true)}
                    ><b><CaretRightOutlined /> Lý do bị từ chối</b></p>
                  )
                }
              </div>
            </div>
          </div>
          <div
            className={styles.container_detail_publish_detail}
          >
            <div
              className={styles.container_detail_publish_buttons}
            >
              {
                course?.status === 'unaccepted'
                  ? (
                    <Popconfirm
                      title='Bạn có chắc hoàn tác chờ phê duyệt xuất bản ?'
                      cancelText='Hủy'
                      onConfirm={onSubmitUndoPublishClick}
                    >
                      <div
                        className={styles.container_detail_publish_buttons_undopublish}
                      >
                        <SwapOutlined />
                        <p>Hoàn tác nộp phê duyệt xuất bản</p>
                      </div>
                    </Popconfirm>
                  )
                  : (course?.lessons?.length < 3)
                    ? (
                      <p><b>Bạn cần ít nhất 3 bài học để nộp xuất bản</b></p>
                    )
                    : (course?.status === 'unpublic')
                      ? (
                        <Popconfirm
                          title='Bạn có chắc muốn nộp phê duyệt xuất bản ?'
                          cancelText='Hủy'
                          onConfirm={onSubmitPublishClick}
                        >
                          <div
                            className={styles.container_detail_publish_buttons_publish}
                          >
                            <HighlightOutlined />
                            <p>Nộp phê duyệt xuất bản</p>
                          </div>
                        </Popconfirm>
                      )
                      : null
              }
            </div>
          </div>
          {/* Tóm tắt section */}
          <div
            className={styles.container_detail_summary}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className={styles.h2}>Tóm tắt</h2>
              <Tooltip
                title={`${course?.status === 'unaccepted'
                  ? 'Bạn không thể chỉnh sửa khóa học khi đang chờ phê duyệt !'
                  : 'Chỉnh sửa'}`
                }
              >
                <EditOutlined
                  className={styles.btn_edit_small}
                  style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                  onClick={
                    course?.status !== 'unaccepted'
                    && (() => setModalEditCourse({ ...modalEditCourse, opened: true, which: 'summary' }))
                  }
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
              <Tooltip
                title={`${course?.status === 'unaccepted'
                  ? 'Bạn không thể chỉnh sửa khóa học khi đang chờ phê duyệt !'
                  : 'Chỉnh sửa'}`
                }
              >
                <EditOutlined
                  className={styles.btn_edit_small}
                  style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                  onClick={
                    course?.status !== 'unaccepted'
                    && (() => setModalEditCourse({ ...modalEditCourse, opened: true, which: 'description' }))
                  }
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
              <Tooltip
                title={`${course?.status === 'unaccepted'
                  ? 'Bạn không thể chỉnh sửa khóa học khi đang chờ phê duyệt !'
                  : 'Thêm chương'}`
                }
              >
                <PlusCircleOutlined
                  className={`${styles['btn_edit_small']} ${styles['btn_edit_small_lessons']}`}
                  style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                  onClick={
                    course?.status !== 'unaccepted'
                    && (() => setModalAddSection({ ...modalAddSection, opened: true }))
                  }
                />
              </Tooltip>
            </div>
            <div
              className={styles.container_detail_lessons_detail}
            >
              <TableSection
                isViewing={course?.status === 'unaccepted' ? true : false}
                course={course}
                setCourse={setCourse}
                getCourseBySlug={getCourseBySlug}
              />
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
            width={848}
            height={477}
            style={{ objectFit: 'cover' }}
          />
        </Modal>

        {
          modalEditCourse.opened && (
            <ModalEditCourse
              course={course}
              setCourse={setCourse}
              getCourseBySlug={getCourseBySlug}
              modalEditCourse={modalEditCourse}
              setModalEditCourse={setModalEditCourse}
            />
          )
        }

        <ModalAddSection
          course={course}
          setCourse={setCourse}
          modalAddSection={modalAddSection}
          setModalAddSection={setModalAddSection}
          getCourseBySlug={getCourseBySlug}
        />

        <Modal
          title='Lý do từ chối phê duyệt'
          open={modalShowRejectReasonOpened}
          width='480px'
          footer={null}
          onCancel={() => setModalShowRejectReasonOpened(false)}
        >
          {
            course?.rejected_reasons?.map((reason, index) => {
              return (
                <p
                  key={`reason_${index}`}
                  style={{ margin: '8px 0px' }}
                >
                  - {reason}
                </p>
              )
            })
          }
        </Modal>
      </div>
    </InstructorRoute>
  )
}

export default CourseView;