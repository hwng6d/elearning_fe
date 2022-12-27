import { SyncOutlined } from "@ant-design/icons";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import { Space, message } from "antd";
import { useRouter } from "next/router";
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from "axios";

const VNPaySuccessPage = () => {
  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // router
  const router = useRouter();

  // functions
  const updateIntructorMembershipInfo = async () => {
    try {
      console.log('updateIntructorMembershipInfo triggered')

      if (user?.instructor_information?.beforeClickMembership_type) {
        const { data } = await axios.put(
          `/api/instructor/update-membership-info`
        );
  
        dispatch({
          type: 'LOGIN',
          payload: data.data
        });
  
        window.localStorage.setItem('user', JSON.stringify(data.data));
  
        router.push('/instructor/membership');
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi cập nhật thông tin membership cho instructor. Chi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    updateIntructorMembershipInfo();
  }, [user]);

  return (
    <InstructorRoute hideSidebar={true}>
      <Space
        direction='vertical'
        size='large'
        style={{ textAlign: 'center', marginTop: '64px', color: 'green', fontWeight: '600', width: '100%' }}
      >
        <SyncOutlined
          spin={true}
          style={{ fontSize: '64px' }}
        />
        <p
          style={{ fontSize: '16px' }}
        >Đang xử lý, bạn chờ chút nhé!</p>
      </Space>
    </InstructorRoute>
  )
}

export default VNPaySuccessPage;