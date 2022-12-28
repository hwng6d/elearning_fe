import AdminRoute from '../../../components/routes/AdminRoute';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { message, BackTop, Tooltip, Space, Modal, Popconfirm, Checkbox, Input } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import TableSection from '../../../components/tables/TableSection';
import styles from '../../../styles/components/admin/course-new/[courseId].module.scss';

const InspectDetailCourseNewPage = () => {
  // router
  const router = useRouter();
  const { courseId } = router.query;

  // states
  const [course, setCourse] = useState({});
  const [reviewResult, setReviewResult] = useState({ clicked: false, result: '' }); // result: accept/ reject
  const [modalSelectRejectReason, setModalSelectRejectReason] = useState({ opened: false, reasons: [], otherReason: '' });
  const [isDesSeeMore, setIsDesSeeMore] = useState(false);
  const [previewImgObj, setPreviewImgObj] = useState({
    previewImgs: [],
    currentPreviewImg: '',
    modalImgOpened: false,
    modalPreviewImgOpened: false,
    uploadLoading: false,
  });

  // variables
  const listRejectReasons = [
    'Tên khóa học không rõ ràng',
    'Tóm tắt khóa học không rõ ràng',
    'Mô tả khóa học không rõ ràng',
    'Gắn thẻ không phù hợp',
    'Không đủ bài học',
    'Video bài học không phù hợp',
    'Khóa học có chứa nội dung không phù hợp',
    'Hình ảnh của khóa học không phù hợp',
    'Khác (ghi rõ):',
  ]

  // functions
  const seeDesMoreHandler = (isSeeMore) => setIsDesSeeMore(isSeeMore);

  const onAcceptPublishClick = async () => {
    try {
      await axios.put(
        `/api/course/ad/course-new/${course?._id}`,
        {
          isAccepted: true,
          reasons: []
        }
      );

      message.success('Đã phê duyệt khóa học');
      router.push(`/admin/course-new`);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi đồng ý xuất bản khóa học. Chi tiết: ${error.message}`);
    }
  }

  const onRejectPublishClick = async () => {
    try {
      const reasons = modalSelectRejectReason.reasons.map((reason => {
        if (reason === 'Khác (ghi rõ):')
          return reason.concat(' ', modalSelectRejectReason.otherReason);
        else
          return reason;
      }));

      await axios.put(
        `/api/course/ad/course-new/${course?._id}`,
        {
          isAccepted: false,
          reasons
        }
      );

      message.success('Đã phê duyệt khóa học');
      router.push(`/admin/course-new`);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi từ chối xuất bản khóa học. Chi tiết: ${error.message}`);
    }
  }

  const getDetailCourse = async () => {
    try {
      const { data } = await axios.get(`/api/course/ad/course-inspect/${courseId}?type=new`);

      setCourse(data.data);

      console.log('setCourse', data.data);
    }
    catch (error) {
      message.error(`Lấy thông tin chi tiết khóa học lỗi. Chi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getDetailCourse();
    }
  }, [courseId]);

  return (
    <AdminRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <div
          className={styles.d_flex_row}
          style={{
            alignItems: 'baseline',
            lineHeight: '28px',
            gap: '24px',
            padding: '12px 0px 12px 0px',
            // borderBottom: '1px solid #c5c5c5'
          }}
        >
          <h2 className={styles.h2}>Phê duyệt khóa học mới</h2>
          <RightOutlined />
          <Tooltip title={course?.name}>
            <p style={{ fontSize: '20px', fontWeight: '600' }}>{course?.name}</p>
          </Tooltip>
        </div>

        <BackTop />
        <div
          className={styles.container_submitresult}
        >
          {
            !reviewResult.clicked
              ? (
                <div
                  onClick={() => setReviewResult({ ...reviewResult, clicked: !reviewResult.clicked })}
                  style={{
                    height: '52px',
                    fontSize: '18px',
                    backgroundColor: '#dedede',
                    padding: '12px 24px',
                    textAlign: 'center',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: '0.5s'
                  }}
                >Phê duyệt</div>
              )
              : (
                <div
                  className={styles.container_submitresult_button}
                  style={{ height: '52px' }}
                >
                  <div
                    className={styles.container_submitresult_button_back}
                    onClick={() => setReviewResult({ ...reviewResult, clicked: !reviewResult.clicked })}
                  >
                    <LeftOutlined />
                  </div>
                  <Popconfirm
                    title={<b>Đồng ý xuất bản khóa học này ?</b>}
                    placement='bottom'
                    cancelText='Hủy'
                    onConfirm={onAcceptPublishClick}
                  >
                    <div
                      className={styles.container_submitresult_button_left}
                    >
                      Đồng ý xuất bản
                    </div>
                  </Popconfirm>
                  <Popconfirm
                    title={<b>Từ chối phê duyệt khóa học này ?</b>}
                    placement='left'
                    cancelText='Hủy'
                    onConfirm={() => setModalSelectRejectReason({...modalSelectRejectReason, opened: true})}
                  >
                    <div
                      className={styles.container_submitresult_button_right}
                    >
                      Từ chối xuất bản
                    </div>
                  </Popconfirm>
                </div>
              )
          }
        </div>
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
                <div style={{ width: '337px', height: '210px' }}>
                  <Image
                    src={course?.image ? course?.image?.Location : '/no-photo.png'}
                    height={!course?.image ? '64' : '210'}
                    width={337}
                    alt='course_photo'
                    style={{
                      width: 'inherit',
                      height: 'inherit',
                      objectFit: course?.image?.Location ? 'cover' : 'scale-down'
                    }}
                  />
                </div>
              </div>
              <div
                className={styles.overview_detail_right}
              >
                <Space size='middle' direction='vertical'>
                  <h1 className={styles.h1}>{course?.name}</h1>
                  <p style={{ fontSize: '16px' }}><b>Giá |</b> {course?.price}</p>
                  <p style={{ fontSize: '16px' }}><b>Phân loại |</b> <Space split='-'>{course?.categoryInfo?.name}</Space></p>
                  <p style={{ fontSize: '16px' }}><b>Tag |</b> <Space split='-'>{course?.tags}</Space></p>
                  <Space split='|'>
                    <p style={{ fontSize: '16px' }}><b>{course?.sections?.length || 0}</b> chương</p>
                    <p style={{ fontSize: '16px' }}><b>{course?.lessons?.length || 0}</b> bài học</p>
                    <p style={{ fontSize: '16px' }}><b>{course?.quizzes?.length || 0}</b> bài quiz</p>
                  </Space>
                </Space>
              </div>
            </div>
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
              <h3 className={styles.h3}>Tóm tắt</h3>
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
              <h3 className={styles.h3}>Mô tả</h3>
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
          {/* Tags section */}
          <div
            className={styles.container_detail_tags}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 className={styles.h3}>Tags</h3>
            </div>
            <div
              className={styles.container_detail_tags_detail}
            >
              <ul>
                {course?.tags?.map((item, index) => {
                  return (
                    <li key={`tag_${index}`}>{item}</li>
                  )
                })}
              </ul>
            </div>
          </div>
          {/* Requirements section */}
          <div
            className={styles.container_detail_requirements}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 className={styles.h3}>Yêu cầu trước khóa học</h3>
            </div>
            <div
              className={styles.container_detail_requirements_detail}
            >
              <ul>
                {course?.requirements?.map((item, index) => {
                  return (
                    <li key={`requirement_${index}`}>{item}</li>
                  )
                })}
              </ul>
            </div>
          </div>
          {/* goal section */}
          <div
            className={styles.container_detail_goals}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 className={styles.h3}>Học viên nhận được sau khóa học</h3>
            </div>
            <div
              className={styles.container_detail_goals_detail}
            >
              <ul>
                {course?.goal?.map((item, index) => {
                  return (
                    <li key={`goal_${index}`}>{item}</li>
                  )
                })}
              </ul>
            </div>
          </div>
          {/* ngôn ngữ section */}
          <div
            className={styles.container_detail_languages}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 className={styles.h3}>Ngôn ngữ</h3>
            </div>
            <div
              className={styles.container_detail_languages_detail}
            >
              <ul>
                {course?.languages?.map((item, index) => {
                  return (
                    <li key={`lang_${index}`}>{item}</li>
                  )
                })}
              </ul>
            </div>
          </div>
          {/* Các bài học section */}
          <div
            className={styles.container_detail_lessons}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 className={styles.h3}>Các bài học</h3>
              |
              <p style={{ fontSize: '18px' }}>{course?.lessons?.length} bài học</p>
            </div>
            <div
              className={styles.container_detail_lessons_detail}
            >
              <TableSection
                isViewing={true}
                course={course}
                setCourse={setCourse}
              />
            </div>
          </div>
        </div>

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
          modalSelectRejectReason.opened && (
            <Modal
              width='640px'
              title={<b>Lý do từ chối phê duyệt</b>}
              open={modalSelectRejectReason.opened}
              cancelText='Hủy'
              okText='Đồng ý'
              onCancel={() => setModalSelectRejectReason({...modalSelectRejectReason, opened: false})}
              onOk={onRejectPublishClick}
            >
              <Checkbox.Group
                options={listRejectReasons}
                value={modalSelectRejectReason.reasons}
                onChange={(list) => {
                  setModalSelectRejectReason({
                    ...modalSelectRejectReason,
                    reasons: list,
                    otherReason: !modalSelectRejectReason.reasons.includes('Khác (ghi rõ):')
                      ? ''
                      : modalSelectRejectReason.otherReason
                  });
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '8px 4px' }}
              />
              {
                modalSelectRejectReason.reasons.includes('Khác (ghi rõ):') && (
                  <Input
                    value={modalSelectRejectReason.otherReason}
                    onChange={(e) => setModalSelectRejectReason({...modalSelectRejectReason, otherReason: e.target.value})}
                    style={{ marginTop: '8px' }}
                  />
                )
              }
            </Modal>
          )
        }
      </div>
    </AdminRoute>
  )
};

export default InspectDetailCourseNewPage;