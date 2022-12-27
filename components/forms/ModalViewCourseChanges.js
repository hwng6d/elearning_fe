import { Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { setDelay } from '../../utils/setDelay';
import styles from '../../styles/components/forms/ModalViewCourseChanges.module.scss';
import { BorderOutlined, CaretRightOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

const ModalViewCourseChanges = ({
  modalViewCourseChangesOpened,
  setModalViewCourseChangesOpened,
  course,
}) => {
  // states
  const [loading, setLoading] = useState(false);

  // functions
  const _setLoading = async () => {
    setLoading(true);
    await setDelay(700);
    setLoading(false);
  }

  useEffect(() => {
    _setLoading();
  }, [])

  return (
    <Modal
      title={<b>Xem thay đổi</b>}
      width={1280}
      open={modalViewCourseChangesOpened}
      onCancel={() => setModalViewCourseChangesOpened(false)}
      footer={null}
    >
      <div>
        {
          loading
            ? (
              <div style={{ textAlign: 'center' }}>
                <Spin spinning={true} />
              </div>
            )
            : (
              <div
                className={`${styles.container} ${styles.d_flex_col}`}
                style={{ gap: '8px' }}
              >
                {/* {course && Object.keys(course).filter(_ => _ !== '_id' && _ !== '__v' && _ !== 'official_data' && _ !== 'instructorInfo').join(' | ')} */}
                <div
                  className={styles.container_coursename}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Tên khóa học</b></label>
                  <ViewChangesOfText
                    prevData={course?.official_data?.name}
                    newData={course?.name}
                  />
                </div>
                <div
                  className={styles.container_courseimage}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Tên khóa học</b></label>
                  <ViewChangesOfImage
                    prevImage={course?.official_data?.image?.Location}
                    newImage={course?.image?.Location}
                  />
                </div>
                <div
                  className={styles.container_coursetags}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Thẻ</b></label>
                  <ViewChangesOfArrayText
                    field='tags'
                    prevData={course?.official_data?.tags}
                    newData={course?.tags}
                  />
                </div>
                <div
                  className={styles.container_coursecategory}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Phân loại</b></label>
                  <ViewChangesOfText
                    prevData={course?.official_data?.categoryInfo?.name}
                    newData={course?.categoryInfo?.name}
                  />
                </div>
                <div
                  className={styles.container_coursesummary}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Tóm tắt</b></label>
                  <ViewChangesOfText
                    prevData={course?.official_data?.summary}
                    newData={course?.summary}
                  />
                </div>
                <div
                  className={styles.container_coursepaid}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Loại khóa học</b></label>
                  <ViewChangesOfText
                    prevData={course?.official_data?.paid ? 'Có phí' : 'Miễn phí'}
                    newData={course?.paid ? 'Có phí' : 'Miễn phí'}
                  />
                </div>
                {
                  course?.paid && (
                    <div
                      className={styles.container_courseprice}
                    >
                      <label
                        style={{ fontSize: '16px', color: '#ff5348' }}
                      ><b>Giá khóa học</b></label>
                      <ViewChangesOfText
                        prevData={course?.official_data?.price}
                        newData={course?.price}
                      />
                    </div>
                  )
                }
                <div
                  className={styles.container_courselanguages}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Ngôn ngữ</b></label>
                  <ViewChangesOfArrayText
                    field='languages'
                    prevData={course?.official_data?.languages}
                    newData={course?.languages}
                  />
                </div>
                <div
                  className={styles.container_coursegoal}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Những điều đạt được sau khóa học</b></label>
                  <ViewChangesOfArrayText
                    field='goal'
                    prevData={course?.official_data?.goal}
                    newData={course?.goal}
                  />
                </div>
                <div
                  className={styles.container_courserequirements}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Yêu cầu trước khóa học</b></label>
                  <ViewChangesOfArrayText
                    field='requirements'
                    prevData={course?.official_data?.requirements}
                    newData={course?.requirements}
                  />
                </div>
                <div
                  className={styles.container_courserequirements}
                >
                  <label
                    style={{ fontSize: '16px', color: '#ff5348', padding: '0px 4px' }}
                  ><b>Mô tả</b></label>
                  <ViewChangesOfRichText
                    field='requirements'
                    prevData={course?.official_data?.description}
                    newData={course?.description}
                  />
                </div>
              </div>
            )
        }
      </div>
    </Modal>
  )
};

export default ModalViewCourseChanges;

const ViewChangesOfText = ({
  prevData,
  newData,
}) => {
  // variables
  const [_prevData, _newData] = [JSON.stringify(prevData), JSON.stringify(newData)];

  return (
    <div
      className={`${_prevData === _newData ? styles.wrapper_same : styles.wrapper_diff} ${styles.d_flex_row}`}
    >
      <div
        className={styles.wrapper_left}
      >
        <label style={{ textDecoration: 'underline' }}><b>Trước đó</b></label>
        <p>{prevData}</p>
      </div>
      <div
        className={styles.wrapper_right}
      >
        <label style={{ textDecoration: 'underline' }}><b>Thay đổi</b></label>
        <div>
          {
            _prevData === _newData
              ? (
                <p style={{ color: '#939496', marginTop: '2px' }}><i>(Không có thay đổi)</i></p>
              )
              : (
                <p>{newData}</p>
              )
          }
        </div>
      </div>
    </div>
  )
}

const ViewChangesOfRichText = ({
  prevData,
  newData,
}) => {
  // states
  const [isDesSeeMore, setIsDesSeeMore] = useState(false);

  // variables
  const [_prevData, _newData] = [JSON.stringify(prevData), JSON.stringify(newData)];

  return (
    <div
      className={`${_prevData === _newData ? styles.wrapper_same : styles.wrapper_diff} ${styles.d_flex_row}`}
    >
      <div
        className={styles.wrapper_left}
      >
        <label style={{ textDecoration: 'underline' }}><b>Trước đó</b></label>
        <div>
          {
            isDesSeeMore
              ? <ReactMarkdown children={prevData} disallowedElements={['h1', 'h2']} />
              : <ReactMarkdown children={prevData?.substring(0, 300)} disallowedElements={['h1', 'h2']} />
          }
          {
            prevData?.length > 300 && (
              <div>
                <hr style={{ borderTop: '1px dashed grey' }} />
                <label
                  style={{ fontSize: '16px', cursor: 'pointer', color: 'blueviolet' }}
                  onClick={() => setIsDesSeeMore(!isDesSeeMore)}
                >...{isDesSeeMore ? 'Rút gọn' : 'Xem thêm'}</label>
              </div>
            )
          }
        </div>
      </div>
      <div
        className={styles.wrapper_right}
      >
        <label style={{ textDecoration: 'underline' }}><b>Thay đổi</b></label>
        <div>
          {
            _prevData === _newData
              ? (
                <p style={{ color: '#939496', marginTop: '2px' }}><i>(Không có thay đổi)</i></p>
              )
              : (
                <div>
                  {
                    isDesSeeMore
                      ? <ReactMarkdown children={newData} disallowedElements={['h1', 'h2']} />
                      : <ReactMarkdown children={newData?.substring(0, 300)} disallowedElements={['h1', 'h2']} />
                  }
                  {
                    newData?.length > 300 && (
                      <div>
                        <hr style={{ borderTop: '1px dashed grey' }} />
                        <label
                          style={{ fontSize: '16px', cursor: 'pointer', color: 'blueviolet' }}
                          onClick={() => setIsDesSeeMore(!isDesSeeMore)}
                        >...{isDesSeeMore ? 'Rút gọn' : 'Xem thêm'}</label>
                      </div>
                    )
                  }
                </div>
              )
          }
        </div>
      </div>
    </div>
  )
}

const ViewChangesOfArrayText = ({
  field,
  prevData,
  newData,
}) => {
  // variables
  const [_prevData, _newData] = [JSON.stringify(prevData), JSON.stringify(newData)];

  return (
    <div
      className={`${_prevData === _newData ? styles.wrapper_same : styles.wrapper_diff} ${styles.d_flex_row}`}
    >
      <div
        className={styles.wrapper_left}
      >
        <label style={{ textDecoration: 'underline' }}><b>Trước đó</b></label>
        <ul style={{ paddingLeft: '0px', marginBottom: '0px' }}>
          {
            prevData?.map((item, index) => (
              <li
                className={styles.d_flex_row}
                style={{ display: 'block', marginTop: '4px' }} key={`${field}_${index}`}
              >
                <div
                  className={styles.d_flex_row}
                  style={{ alignItems: 'flex-start', gap: '12px' }}
                >
                  <CaretRightOutlined style={{ marginTop: '8px' }} />
                  {item}
                </div>
              </li>
            ))
          }
        </ul>
      </div>
      <div
        className={styles.wrapper_right}
      >
        <label style={{ textDecoration: 'underline' }}><b>Thay đổi</b></label>
        <div>
          {
            _prevData === _newData
              ? (
                <p style={{ color: '#939496' }}><i>(Không có thay đổi)</i></p>
              )
              : (
                <ul style={{ paddingLeft: '0px', marginBottom: '0px' }}>
                  {
                    newData?.map((item, index) => (
                      <li
                        className={styles.d_flex_row}
                        style={{ display: 'block', marginTop: '4px' }} key={`${field}_${index}`}
                      >
                        <div
                          className={styles.d_flex_row}
                          style={{ alignItems: 'flex-start', gap: '12px' }}
                        >
                          <CaretRightOutlined style={{ marginTop: '8px' }} />
                          {item}
                        </div>
                      </li>
                    ))
                  }
                </ul>
              )
          }
        </div>
      </div>
    </div>
  )
}

const ViewChangesOfImage = ({
  prevImage,
  newImage
}) => {
  // variables
  const [_prevData, _newData] = [JSON.stringify(prevImage), JSON.stringify(newImage)];

  return (
    <div
      className={`${_prevData === _newData ? styles.wrapper_same : styles.wrapper_diff} ${styles.d_flex_row}`}
    >
      <div
        className={styles.wrapper_left}
      >
        <label style={{ textDecoration: 'underline' }}><b>Trước đó</b></label>
        <div
          style={{ height: '55px', width: '84px', border: '1px solid #d9d9d9' }}
        >
          <Image
            src={prevImage}
            width={84}
            height={55}
            alt='preImage'
            style={{
              objectFit: prevImage ? 'cover' : 'scale-down',
              width: '-webkit-fill-available',
              height: '-webkit-fill-available'
            }}
          />
        </div>
      </div>
      <div
        className={styles.wrapper_right}
      >
        <label style={{ textDecoration: 'underline' }}><b>Thay đổi</b></label>
        <div>
          {
            _prevData === _newData
              ? (
                <p style={{ color: '#939496', marginTop: '2px' }}><i>(Không có thay đổi)</i></p>
              )
              : (
                <div
                  style={{ height: '55px', width: '84px', border: '1px solid #d9d9d9' }}
                >
                  <Image
                    src={newImage}
                    width={84}
                    height={55}
                    alt='newImage'
                    style={{
                      objectFit: newImage ? 'cover' : 'scale-down',
                      width: '-webkit-fill-available',
                      height: '-webkit-fill-available'
                    }}
                  />
                </div>
              )
          }
        </div>
      </div>
    </div>
  )
}