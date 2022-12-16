import { useState, useEffect } from "react";
import { Modal, Progress, Rate, message } from 'antd';
import Image from "next/image";
import SearchBar from '../../components/inputs/search/SearchBar';
import axios from "axios";
import { StarFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from '../../styles/components/forms/ModalShowReviews.module.scss';

const ModalShowReviews = ({
  isAllReview,
  setIsAllReview,
}) => {
  // variables

  // states
  const [searchReview, setSearchReview] = useState({ star: 0, content: '' });
  const [listReview, setListReview] = useState([]);

  // functions
  const average = (array) => array?.reduce((p, c) => p + c, 0) / array?.length;

  const onCloseClick = () => {
    setIsAllReview({ ...isAllReview, opened: false });
  }

  const onStarClick = (starNum) => {
    setSearchReview({...searchReview, star: (starNum === searchReview.star) ? 0 : starNum});
  }

  const onSearchClick = async () => {
    try {
      const queryString = new URLSearchParams(searchReview).toString();

      const { data } = await axios.get(
        `/api/review/public/course/${isAllReview.which}?${queryString}`
      );

      setListReview({ ...listReview, total: data.data.total, list: data.data.list });
    }
    catch (error) {
      message.error(`Lọc dữ liệu lỗi. Chi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    onSearchClick();
  }, [isAllReview.opened]);

  useEffect(() => {
    onSearchClick();
  }, [searchReview.star])

  return (
    <Modal
      width={960}
      open={isAllReview.opened}
      onCancel={onCloseClick}
      footer={null}
      title={null}
    >
      <div
        className={`${styles.container} ${styles.d_flex_row}`}
        style={{ gap: '8px', padding: '12px 20px 24px 20px' }}
      >
        <div
          className={`${styles.container_left} ${styles.d_flex_col}`}
        >
          <h2>Tất cả đánh giá</h2>
          <div
            className={styles.d_flex_row}
            style={{ marginTop: '8px', gap: '12px', fontWeight: '600' }}
          >
            <p>{listReview?.total?.length} đánh giá</p>
            <span>|</span>
            <div
              className={styles.d_flex_row}
              style={{ gap: '8px' }}
            >
              <span>{<StarFilled style={{ color: '#fadb14' }} />}</span>
              <span>
                {
                  isNaN(average(listReview?.total?.map(_ => _?.star))?.toFixed(1))
                  ? <span>-</span>
                  : average(listReview?.total?.map(_ => _?.star))?.toFixed(1)
                } sao
              </span>
            </div>
          </div>
          <div
            className={`${styles.container_left_overall} ${styles.d_flex_col}`}
            style={{ gap: '4px' }}
          >
            {
              [5, 4, 3, 2, 1].map(number => {
                return (
                  <div
                    className={`${styles.container_left_overall_item} ${styles.d_flex_row}`}
                    key={`${number}_star`}
                    style={{ alignItems: 'baseline' }}
                  >
                    <Progress
                      percent={((listReview?.total?.filter(_ => _.star === number).length) / (listReview?.total?.length) * 100)}
                      strokeLinecap='square'
                      strokeColor='#6a6f73'
                      trailColor='#d1d7dc'
                      showInfo={false}
                      style={{ width: '35%' }}
                    />
                    <div
                      onClick={() => onStarClick(number)}
                      style={{ width: '45%' }}
                    >
                      <Rate
                        value={number}
                        style={{ fontSize: '14px' }}
                      />
                    </div>
                    <p
                      style={{ fontSize: '12px', textAlign: 'right' }}
                    >
                      <b>
                        {
                          isNaN(((listReview?.total?.filter(_ => _.star === number).length) / (listReview?.total?.length) * 100).toFixed(1))
                          ? <span>-</span>
                          : ((listReview?.total?.filter(_ => _.star === number).length) / (listReview?.total?.length) * 100).toFixed(1)
                        }
                      </b>
                    </p>
                  </div>
                )
              })
            }
          </div>
          <div
            className={`${styles.container_left_search}`}
          >
            <SearchBar
              field='content'
              value={searchReview}
              setValue={setSearchReview}
              onSearchClick={onSearchClick}
              styles={{ width: '260px', height: '36px' }}
            />
          </div>
        </div>
        <div
          className={`${styles.container_right} ${styles.d_flex_col}`}
        >
          <div
            className={`${styles.container_right_reviewlist} ${styles.d_flex_col}`}
            style={{ gap: '28px' }}
          >
            {
              !listReview?.list?.length
              ? <p style={{ fontSize: '18px', fontWeight: '600', color: '#3a3d40' }}><i>Không có dữ liệu</i></p>
              : (
                listReview?.list?.map(review => {
                  return (
                    <div
                      className={styles.container_right_reviewlist_item}
                      key={review?._id}
                    >
                      <div
                        className={`${styles.container_right_reviewlist_item_info} ${styles.d_flex_row}`}
                      >
                        {/* image */}
                        <div style={{ width: '44px', height: '44px' }}>
                          <Image
                            src={'/user_default.svg'}
                            width={44}
                            height={44}
                            alt='avatar'
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        {/* info */}
                        <div className={styles.d_flex_col} style={{ gap: '2px' }}>
                          <p style={{ fontWeight: '700' }}>{review?.user?.name}</p>
                          <div className={styles.d_flex_row}>
                            <Rate
                              value={review?.star}
                              disabled={true}
                              style={{ fontSize: '14px' }}
                            />
                            <p><i>{dayjs(review?.updatedAt).format('DD/MM/YYYY')}</i></p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.container_right_reviewlist_item_content}
                      >
                        {review?.content}
                      </div>
                    </div>
                  )
                })
              )
            }
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalShowReviews;