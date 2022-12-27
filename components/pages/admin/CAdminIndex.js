import { useState, useEffect } from "react";
import { PicLeftOutlined, CommentOutlined, PlusSquareFilled, EditFilled } from "@ant-design/icons";
import styles from '../../../styles/components/admin/AdminIndex.module.scss';
import Image from "next/image";
import { message } from "antd";
import axios from "axios";
import { ResponsivePie } from '@nivo/pie';
import PieChart from '../../../components/charts/PieChart';

const CAdminIndex = () => {
  // states
  const [users, setUsers] = useState({ data: [], dataChart: [] });
  const [courses, setCourses] = useState({ data: [], dataChart: [] });
  const [reviews, setReviews] = useState({ data: [], dataChart: [] });
  const [qas, setQAs] = useState({ data: [], dataChart: [] });

  // functions
  const fetchDataChart = () => {

  }

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`/api/user/ad`);

      let dataChart = [];
      ['Subscriber', 'Instructor'].forEach((role, index) => dataChart.push({
        id: `${index === 0 ? 'Học viên' : 'Instructor'}`,
        label: `role_${role}`,
        value: (index === 0) 
          ? data?.data?.filter(_ => _.role.length === 1 && _.role.includes(role))?.length
          : data?.data?.filter(_ => _.role.includes('Instructor'))?.length
      }));

      setUsers({...users, data: data.data, dataChart});
    }
    catch (error) {
      message.error(`Lấy thông tin người dùng lỗi. Chi tiết: ${error.message}`);
    }
  }

  const getAllCourses = async () => {
    try {
      const { data } = await axios.get(`/api/course/ad`);

      setCourses({...courses, data: data.data});
    }
    catch (error) {
      message.error(`Lấy thông tin khóa học lỗi. Chi tiết: ${error.message}`);
    }
  }

  const getAllReviews = async () => {
    try {
      const { data } = await axios.get(`/api/review/ad`);

      let dataChart = [];
      [5, 4, 3, 2, 1].forEach(number => dataChart.push({
        id: `${number} sao`,
        label: `star_${number}`,
        value: data.data.filter(_ => _.star === number).length
      }));
      console.log('review dataChart: ', dataChart);

      setReviews({...reviews, data: data.data, dataChart: dataChart.filter(_ => _.value !== 0)});
    }
    catch (error) {
      message.error(`Lấy đánh giá người dùng lỗi. Chi tiết: ${error}`);
    }
  }

  const getAllQAs = async () => {
    try {
      const { data } = await axios.get('/api/qa/ad');

      const qasNewId = data.data.map(_ => { if (_.type === 'new') return _._id }).filter(_ => _ !== undefined);
      const qasReplyId = data.data.map(_ => { if (_.type === 'reply') return _.replyQAId }).filter(_ => _ !== undefined);
      console.log('qasNewId: ', qasNewId);
      console.log('qasReplyId: ', qasReplyId);
      let [count_hasReplies, count_withoutReplis] = [0, 0];
      qasNewId.forEach(newId => {
        if (qasReplyId.includes(newId)) count_hasReplies++;
        else count_withoutReplis++;
      })

      let dataChart = [];
      ['has_replies', 'without_replies'].forEach((_, index) => {
        dataChart.push({
          id: index === 0 ? 'Có phản hồi' : 'Chưa có phản hồi',
          label: `qa_${_}`,
          value: index === 0 ? count_hasReplies : count_withoutReplis
        })
      })

      setQAs({...qas, data: data.data.filter(_ => _.type === 'new'), dataChart});
    }
    catch (error) {
      message.error(`Lấy Q&As người dùng lỗi. Chi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    getAllUsers();
    getAllCourses();
    getAllReviews();
    getAllQAs();
  }, [])

  return (
    <div
      className={styles.container}
    >
      <div
        className={styles.container_overall}
      >
        <h2
          className={styles.h2}>Tổng quan
        </h2>
        <div
          className={`${styles.container_overall_cards} ${styles.d_flex_row}`}
          style={{ gap: '40px' }}
        >
          {/* học viên */}
          <OverallCard
            imgSrc={`/student.svg`}
            children={
              <p style={{ fontWeight: '600' }}>
                {users.data.filter(user => (user.role.length === 1 && user.role.includes('Subscriber'))).length} học viên
              </p>
            }
            style={{
              borderRadius: '12px',
              backgroundImage: { gradientLeft: 'rgb(255, 104, 104)', gradientRight: 'rgb(255, 176, 101)' }
            }}
          />
          {/* instructor */}
          <OverallCard
            imgSrc={`/instructor.svg`}
            children={
              <p style={{ fontWeight: '600' }}>
                {users.data.filter(user => (user.role.includes('Instructor'))).length} Instructor
              </p>
            }
            style={{
              borderRadius: '12px',
              backgroundImage: { gradientLeft: 'rgb(255, 104, 104)', gradientRight: 'rgb(255, 176, 101)' }
            }}
          />
          {/* review */}
          <OverallCard
            imgSrc={<PicLeftOutlined style={{ fontSize: '44px' }}/>}
            children={
              <p style={{ fontWeight: '600' }}>
                {reviews.data.length} đánh giá
              </p>
            }
            style={{
              borderRadius: '12px',
              backgroundImage: { gradientLeft: 'rgb(255, 104, 104)', gradientRight: 'rgb(255, 176, 101)' }
            }}
          />
          {/* Q & A */}
          <OverallCard
            imgSrc={<CommentOutlined style={{ fontSize: '44px' }}/>}
            children={
              <p style={{ fontWeight: '600' }}>
                {qas.data.length} Q&A
              </p>
            }
            style={{
              borderRadius: '12px',
              backgroundImage: { gradientLeft: 'rgb(255, 104, 104)', gradientRight: 'rgb(255, 176, 101)' }
            }}
          />
        </div>
      </div>
      <div
        className={styles.container_statistic}
      >
        <h2
          className={styles.h2}>Thống kê
        </h2>
        <div
          className={`${styles. container_statistic_charts} ${styles.d_flex_row}`}
          style={{ gap: '40px' }}
        >
          <div
            className={`${styles. container_statistic_charts_review} ${styles.d_flex_col}`}
            style={{ width: '372px', height: '272px', alignItems: 'center', fontSize: '18px' }}
          >
            <PieChart data={reviews.dataChart}/>
            <p>Các đánh giá</p>
          </div>
          <div
            className={`${styles. container_statistic_charts_user} ${styles.d_flex_col}`}
            style={{ width: '372px', height: '272px', alignItems: 'center', fontSize: '18px' }}
          >
            <PieChart data={users.dataChart}/>
            <p>Người dùng</p>
          </div>
          <div
            className={`${styles. container_statistic_charts_qa} ${styles.d_flex_col}`}
            style={{ width: '372px', height: '272px', alignItems: 'center', fontSize: '18px' }}
          >
            <PieChart data={qas.dataChart}/>
            <p>Các Q&A</p>
          </div>
        </div>
      </div>
      <div
        className={styles.container_undone}
      >
        <h2
          className={styles.h2}>Chưa thực hiện
        </h2>
        <div
          className={`${styles.container_undone_cards} ${styles.d_flex_row}`}
          style={{ gap: '40px' }}
        >
          <OverallCard
            imgSrc={<PlusSquareFilled style={{ fontSize: '44px' }}/>}
            children={
              <p style={{ fontWeight: '600', fontSize: '16px' }}>
                {courses.data.filter(_ => _.status === 'unaccepted_new').length} khóa học mới chưa được phê duyệt
              </p>
            }
            style={{
              borderRadius: '0px',
              backgroundImage: { gradientLeft: '#66c2a5', gradientRight: '#fc8d62' }
            }}
          />
          <OverallCard
            imgSrc={<EditFilled style={{ fontSize: '44px' }}/>}
            children={
              <p style={{ fontWeight: '600', fontSize: '16px' }}>
                {courses.data.filter(_ => _.status === 'unaccepted_edit').length} khóa học chỉnh sửa chưa được phê duyệt
              </p>
            }
            style={{
              borderRadius: '0px',
              backgroundImage: { gradientLeft: '#66c2a5', gradientRight: '#fc8d62' }
            }}
          />
        </div>
      </div>
    </div>
  )
};

export default CAdminIndex;

const OverallCard = ({
  imgSrc,
  children,
  style
}) => {
  return (
    <div
      className={`${styles.container_overall_cards_item} ${styles.d_flex_row}`}
      style={{
        gap: '24px',
        alignItems: 'flex-end',
        borderRadius: style.borderRadius,
        backgroundImage: `linear-gradient(to right, ${style.backgroundImage.gradientLeft}, ${style.backgroundImage.gradientRight})`
      }}
    >
      <div
        className={styles.container_overall_cards_item_icon}
      >
        {
          typeof imgSrc === 'string'
            ? (
              <Image
                src={imgSrc}
                width={48}
                height={48}
                style={{ objectFit: 'cover', width: '-webkit-fill-available', height: '-webkit-fill-available' }}
                alt={`icon`}
              />)
            : imgSrc
        }
      </div>
      <div
        className={styles.container_overall_cards_item_text}
      >
        {children}
      </div>
    </div>
  )
}