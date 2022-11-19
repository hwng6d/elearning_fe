import { SyncOutlined } from "@ant-design/icons";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context";
import { useRouter } from "next/router";
import { Space } from "antd";
import axios from "axios";

const StripeSuccessPage = () => {
  const { state: { user }, dispatch } = useContext(Context);
  const router = useRouter();
  const { courseId } = router.query;

  const successRequest = async () => {
    const { data } = await axios.get(`/api/user/stripe-success/${courseId}`);

    // set new user info to Provider root
    dispatch({
      type: 'LOGIN',
      payload: data.data
    });

    // set new user info to localStorage
    window.localStorage.setItem('user', JSON.stringify(data.data));

    // get course info to get course's slug
    const { data: courseData } = await axios.get(`/api/course/public/id/${courseId}`);
    console.log('courseData: ', courseData);

    // redirect to paid course
    router.push(`/user/courses/${courseData.data.slug}`);
  }

  useEffect(() => {
    if (courseId)
      successRequest();
  }, [
    courseId
  ])

  return (
    <Space
      direction='vertical'
      size='large'
      style={{ textAlign: 'center', marginTop: '64px', color: 'green', fontWeight: '600' }}
    >
      <SyncOutlined
        spin={true}
        style={{ fontSize: '64px' }}
      />
      <p
        style={{ fontSize: '16px' }}
      >Đang xử lý thanh toán, bạn chờ chút nhé!</p>
    </Space>
  )
}

export default StripeSuccessPage;