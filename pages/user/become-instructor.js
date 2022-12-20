import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Spin, message } from 'antd';
import styles from '../../styles/user/BecomeInstructor.module.scss';
import { SettingOutlined, CheckOutlined } from '@ant-design/icons';
import { Context } from '../../context';
import axios from 'axios';
import { useRouter } from 'next/router';
import { PrimaryButton, TextField } from '@fluentui/react';
import { setDelay } from '../../utils/setDelay';

function BecomeInstructor() {
  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // router
  const router = useRouter();

  // states
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    summary: '',
    position: '',
    yoe: 1,
    social_linkedin: '',
    social_twitter: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  // functions
  const onBecomeInstructorSubmit = async () => {
    try {
      console.log('value: ', value);

      setLoading(true);
      if (!value.summary || !value.position || !value.yoe || !value.social_linkedin || !value.social_twitter) {
        message.error('Chưa điền đủ thông tin');
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        '/api/instructor/become-instructor-2',
        { value: { ...value, userId: user._id } }
      );

      if (data.success) {
        setIsSuccess(true);
        dispatch({
          type: 'LOGIN',
          payload: data.data
        });
        window.localStorage.setItem('user', JSON.stringify(data.data));
      }
      await setDelay(5000);
      setLoading(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi đăng ký Instructor. Chi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  // const becomeInstructorHandler = async () => {
  //   console.log('become instructor');
  //   setLoading(true);
  //   try {
  //     const response = await axios.post('/api/instructor/become-instructor');
  //     window.location.href = response.data.data.account_link;
  //   }
  //   catch (error) {
  //     console.log('error', error);
  //     setLoading(false);
  //   }
  // }

  useEffect(() => {
    if (!user)
      router.push('/signin');
  }, [user])

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.h1}>Cấu hình tài khoản thanh toán để xuất bản các khóa học trên nextgoal</h1>
      <Button
        className={styles.Button}
        style={{width: '256px', height: '42px'}}
        onClick={becomeInstructorHandler}
        disabled={user && user.role.includes('Instructor')}
      >
        {(user && user.role.includes('Instructor')) ? (<span>Bạn đã là Instructor</span>) : (<span>Thiết lập tài khoản thanh toán</span>)}
        <SettingOutlined spin={loading}/>
      </Button> */}
      <div
        className={styles.container_wrapper}
        style={{ width: '1152px', backgroundColor: 'white', border: '1px solid black', borderRadius: '12px' }}
      >
        {
          loading
            ? (
              <Spin
                spinning={true}
                style={{ textAlign: 'center', fontSize: '32px' }}
              />
            )
            : (

              !isSuccess
                ? (
                  <div
                    className={styles.container_wrapper_body}
                  >
                    <h1 style={{ textAlign: 'center' }}><b>Trở thành Instructor</b></h1>
                    <div
                      className={styles.container_wrapper_body_summary}
                    >
                      <h2>Tóm tắt về bản thân</h2>
                      <div style={{ marginTop: '8px' }}>
                        <TextField
                          placeholder='Nhập tóm tắt...'
                          multiline={true}
                          resizable={false}
                          value={value.summary}
                          onChange={(_, val) => setValue({ ...value, summary: val })}
                        />
                      </div>
                    </div>
                    <div
                      className={styles.container_wrapper_body_position}
                    >
                      <h2>Vị trí công việc hiện tại</h2>
                      <div style={{ marginTop: '8px' }}>
                        <TextField
                          placeholder='Nhập vị trí công việc...'
                          value={value.position}
                          onChange={(_, val) => setValue({ ...value, position: val })}
                        />
                      </div>
                    </div>
                    <div
                      className={styles.container_wrapper_body_position}
                    >
                      <h2>Số năm kinh nghiệm</h2>
                      <div style={{ marginTop: '8px' }}>
                        <TextField
                          placeholder='Nhập số năm kinh nghiệm...'
                          type='number'
                          min={1}
                          value={value.yoe}
                          onChange={(_, val) => setValue({ ...value, yoe: val })}
                        />
                      </div>
                    </div>
                    <div
                      className={styles.container_wrapper_body_social}
                    >
                      <h2>Liên kết mạng xã hội</h2>
                      <TextField
                        label='Linkedin'
                        suffix='VD: https://www.linkedin.com/in/mark-zuckerberg-618bba58/'
                        min={1}
                        value={value.social_linkedin}
                        onChange={(_, val) => setValue({ ...value, social_linkedin: val })}
                      />
                      <TextField
                        label='Twitter'
                        suffix='VD: https://twitter.com/elonmusk'
                        min={1}
                        value={value.social_twitter}
                        onChange={(_, val) => setValue({ ...value, social_twitter: val })}
                      />
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '24px' }}>
                      <PrimaryButton
                        text='Đăng ký'
                        onClick={onBecomeInstructorSubmit}
                      />
                    </div>
                  </div>
                )
                : (
                  <Space
                    className={styles.container_wrapper_body}
                    style={{ gap: '32px' }}
                  >
                    <CheckOutlined style={{ color: 'green', fontSize: '32px' }} />
                    <h2 style={{ color: 'green' }}><b>Đăng ký Instructor thành công</b></h2>
                  </Space>
                )

            )
        }
      </div>
    </div>
  )
}

export default BecomeInstructor
