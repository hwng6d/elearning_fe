import React, { useContext, useEffect, useState } from 'react';
import { Button, message } from 'antd';
import styles from '../../styles/user/BecomeInstructor.module.scss';
import { SettingOutlined } from '@ant-design/icons';
import { Context } from '../../context';
import axios from 'axios';
import { useRouter } from 'next/router';

function BecomeInstructor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { state: { user } } = useContext(Context);

  const becomeInstructorHandler = async () => {
    console.log('become instructor');
    setLoading(true);
    try {
      const response = await axios.post('/api/instructor/become-instructor');
      window.location.href = response.data.data.account_link;
    }
    catch(error) {
      console.log('error', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user)
      router.push('/signin');
  }, [user])

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Cấu hình tài khoản thanh toán để xuất bản các khóa học trên nextgoal</h1>
      <Button
        className={styles.Button}
        style={{width: '256px', height: '42px'}}
        onClick={becomeInstructorHandler}
        disabled={user && user.role.includes('Instructor')}
      >
        {(user && user.role.includes('Instructor')) ? (<span>Bạn đã là Instructor</span>) : (<span>Thiết lập tài khoản thanh toán</span>)}
        <SettingOutlined spin={loading}/>
      </Button>
    </div>
  )
}

export default BecomeInstructor
