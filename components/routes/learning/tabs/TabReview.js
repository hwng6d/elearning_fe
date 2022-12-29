import { useState, useEffect, useContext } from 'react';
import { List, Rate, Progress, Space, message } from 'antd';
import { Context } from '../../../../context';
import axios from 'axios';
import dayjs from 'dayjs';
import Image from 'next/image';
import SearchBar from '../../../inputs/search/SearchBar';
import styles from '../../../../styles/components/routes/learning/tabs/TabReview.module.scss';
import ModalAddReview from '../../../forms/ModalAddReview';
import SelectBar from '../../../inputs/search/SelectBar';
import { DashOutlined } from '@ant-design/icons';

const TabReview = ({ course, currentLesson, activeTab }) => {
  // global context
  const { state: { user } } = useContext(Context);

  // states
  const [listReview, setListReview] = useState({ total: [], list: [] });
  const [newReview, setNewReview] = useState({ content: '', star: 0 });
  const [modalAddReview, setModalAddReview] = useState({ opened: false, courseId: course?._id })
  const [modalEditReview, setModalEditReview] = useState({ opened: false, courseId: course?._id, review: {} })
  const [search, setSearch] = useState({ content: '', star: 0 });

  // variables


  // functions
  const calculateAverage = (array) => array.reduce((p, c) => p + c, 0) / array.length;

  const getReviewsOfCourse = async () => {
    try {
      const { data } = await axios.get(`/api/review/public/course/${course?._id}`);

      setListReview({ ...listReview, total: data.data.total, list: data.data.list });
    }
    catch (error) {
      message.error(`Lấy danh sách review của khóa học lỗi. Chi tiết: ${error.message}`);
    }
  }

  const fetchUserReview = () => {
    if (listReview.list.findIndex(review => review?.userId === user._id) >= 0) {
      setModalEditReview({ ...modalEditReview, review: listReview.list[listReview.list.findIndex(review => review?.userId === user._id)] });
    }
  }

  const onSearchClick = async () => {
    try {
      const queryString = new URLSearchParams(search).toString();

      const { data } = await axios.get(
        `/api/review/public/course/${course?._id}?${queryString}`
      );

      setListReview({ ...listReview, total: data.data.total, list: data.data.list });
    }
    catch (error) {
      message.error(`Lọc dữ liệu lỗi. Chi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    getReviewsOfCourse();
  }, [activeTab === 'tab_review'])

  useEffect(() => {
    onSearchClick();
  }, [search.star])

  useEffect(() => {
    fetchUserReview();
  }, [listReview.list])

  return (
    <div
      className={styles.tabs_review}
    >
      <div
        className={styles.tabs_review_overview}
      >
        <h2 className={styles.h2}>Phản hồi của học viên</h2>
        <div className={styles.tabs_review_overview_body}>
          <Space className={styles.tabs_review_overview_body_average} direction='vertical' size={16}>
            <div
              style={{ fontSize: '76px', color: '#b4690e', fontWeight: '700', lineHeight: '64px' }}
            >
              {
                isNaN((Math.floor(calculateAverage(listReview.total.map(_ => _.star)) * 10) / 10).toFixed(1))
                  ? <DashOutlined />
                  : (Math.floor(calculateAverage(listReview.total.map(_ => _.star)) * 10) / 10).toFixed(1)
              }
            </div>
            {
              !isNaN((Math.floor(calculateAverage(listReview.total.map(_ => _.star)) * 10) / 10).toFixed(1))
                ? (
                  <Rate
                    allowHalf={true}
                    value={(Math.floor(calculateAverage(listReview.total.map(_ => _.star)) * 10) / 10).toFixed(1)}
                    disabled={true}
                    style={{ fontSize: '18px' }}
                  />
                )
                : <p style={{ fontSize: '15px', color: '#b4690e', fontWeight: '700' }}>Chưa có đánh giá</p>
            }
          </Space>
          <Space className={styles.tabs_review_overview_body_progressbar} direction='vertical'>
            {
              [1, 2, 3, 4, 5].map(number => {
                return (
                  <Progress
                    key={number}
                    type='line'
                    showInfo={false}
                    percent={((listReview?.total?.filter(_ => _.star === number).length) / (listReview?.total?.length) * 100)}
                    strokeColor='#6a6f73'
                    trailColor="#d1d7dc"
                  />
                )
              })
            }
          </Space>
          <Space className={styles.tabs_review_overview_body_statistic} direction='vertical' size={0}>
            {
              [1, 2, 3, 4, 5].map(number => {
                return (
                  <div
                    key={number}
                    style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'flex-end', fontSize: '15px' }}
                    onClick={() => setSearch({ ...search, star: number })}
                  >
                    <Rate
                      key={number}
                      value={number}
                      style={{ fontSize: '18px' }}
                    />
                    <p>
                      {
                        listReview?.total?.length
                          ? `${((listReview?.total?.filter(_ => _.star === number).length) / (listReview?.total?.length) * 100).toFixed(1)} %`
                          : '---'
                      }
                    </p>
                  </div>
                )
              })
            }
          </Space>
        </div>
      </div>
      <div
        className={styles.tabs_review_content}
      >
        <Space direction="horizontal" style={{ alignItems: 'flex-end' }} size='middle'>
          <h2 className={styles.h2} style={{ marginTop: '16px' }}>Các đánh giá</h2>
          {
            user._id !== course.instructor._id && (
              listReview?.total?.findIndex(review => review.userId === user?._id) < 0
              ? (
                <p
                  style={{ color: '#1e4dac', lineHeight: '24px', cursor: 'pointer' }}
                  onClick={() => setModalAddReview({ ...modalAddReview, opened: true, courseId: course?._id })}
                >
                  <b>Thêm review</b>
                </p>
              )
              : (
                <p
                  style={{ color: '#1e4dac', lineHeight: '24px', cursor: 'pointer' }}
                  onClick={() => setModalEditReview({ ...modalEditReview, opened: true, courseId: course?._id })}
                >
                  <b>Sửa review của bạn</b>
                </p>
              )
            )
          }
        </Space>
        <div
          className={styles.tabs_review_content_body}
        >
          <div
            className={styles.tabs_review_content_body_search}
          >
            <div
              className={styles.tabs_review_content_body_search_left}
              style={{ width: '15%' }}
            >
              <p><b>Bộ lọc</b></p>
              <SelectBar
                field='star'
                value={search}
                setValue={setSearch}
                options={[0, 1, 2, 3, 4, 5].map(number => {
                  if (number === 0) return { value: number, label: `Tất cả` }
                  else return { value: number, label: `${number} sao` }
                })}
                styles={{ width: '100%', height: '40px' }}
              />
            </div>
            <div
              className={styles.tabs_review_content_body_search_right}
              style={{ width: '85%' }}
            >
              <p><b>Tìm kiếm từ khóa</b></p>
              <SearchBar
                field='content'
                value={search}
                setValue={setSearch}
                onSearchClick={onSearchClick}
                styles={{ width: '100%', height: '40px' }}
              />
            </div>
          </div>
          <div
            className={styles.tabs_review_content_body_list}
          >
            <List
              itemLayout='vertical'
              dataSource={listReview.list}
              split={true}
              renderItem={(review) => (
                <List.Item
                  key={review._id}
                >
                  <Space
                    className={styles.tabs_review_content_body_list_item}
                    size='large'
                    direction='horizontal'
                  >
                    <Space
                      className={styles.tabs_review_content_body_list_item_left}
                    >
                      <div style={{ width: '44px', height: '44px' }}>
                        <Image
                          src={'/user_default.svg'}
                          width={44}
                          height={44}
                          alt='avatar'
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </Space>
                    <Space
                      className={styles.tabs_review_content_body_list_item_right}
                      direction='vertical'
                      size={0}
                    >
                      <Space direction='horizontal' size='middle'>
                        <h3><b>{review?.user?.name}</b></h3>
                        <p><i>{dayjs(review?.updatedAt).format('DD/MM/YYYY')}</i></p>
                      </Space>
                      <Rate value={review.star} disabled={true} />
                      <p style={{ marginTop: '8px' }}>{review.content}</p>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>

      {
        modalAddReview.opened && (
          <ModalAddReview
            modalAddReview={modalAddReview}
            setModalAddReview={setModalAddReview}
            newReview={newReview}
            setNewReview={setNewReview}
            getReviewsOfCourse={getReviewsOfCourse}
          />
        )
      }

      {
        modalEditReview.opened && (
          <ModalAddReview
            isEdit={true}
            modalEditReview={modalEditReview}
            setModalEditReview={setModalEditReview}
            newReview={newReview}
            setNewReview={setNewReview}
            getReviewsOfCourse={getReviewsOfCourse}
          />
        )
      }
    </div>
  )
}

export default TabReview;