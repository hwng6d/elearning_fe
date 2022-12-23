import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { Input, Button, Space, message } from 'antd';
import { Context } from '../context';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/SignIn.module.scss';
import { ERRORS_NAME } from '../utils/constant';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { state: { user }, dispatch } = useContext(Context);

  useEffect(() => {
    if (user)
      router.push('/');
  }, [user])

  const submitFormHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.table({
        email,
        password
      });

      const { data } = await axios.post(
        // `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        `/api/auth/login`,
        { email, password }
      );

      dispatch({
        type: 'LOGIN',
        payload: data.data
      });
      
      window.localStorage.setItem('user', JSON.stringify(data.data));
      
      router.push('/user');

      message.success('Đã đăng nhập !');
      setLoading(false);
    }
    catch (error) {
      const err_message = ERRORS_NAME.find(_ => { if (error.response.data.message.includes(_.keyword)) return _ });
      
      if (err_message)
        message.error(err_message.vietnamese);
      else
        message.error(`Xảy ra lỗi khi đăng ký, vui lòng thử lại\nChi tiết: ${error.message}`);
    }
  }

  return (
    <div className={styles.container}>
      <div className='container'>
        <h1 className={styles.header1}>Đăng nhập</h1>
        <form
          id='signup_form'
          className={styles.form}
        >
          <div className={styles.form_email}>
            <label className={styles.form_label}>Email</label>
            <Input
              className={styles.input}
              allowClear={true}
              id='email'
              placeholder='Nhập email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.form_password}>
            <label className={styles.form_label}>Mật khẩu</label>
            <Input
              className={styles.input}
              allowClear={true}
              id='password'
              type='password'
              placeholder='Nhập mật khẩu'
              alue={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div
            style={{ display: 'inline-block', width: 'inherit', marginTop: '10px' }}
          >
            <Button
              type='primary'
              onClick={(e) => submitFormHandler(e)}
              disabled={!email || !password || loading}
              style={{ width: 'inherit', fontWeight: '600' }}
            >
              Đăng nhập {loading && <SyncOutlined spin={true} />}
            </Button>
            <div
              className='container_bottom'
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}
            >
              <div
                className='container_bottom_left'
              >
                <Link href='forgot-password' style={{ color: '#ff3200' }}>
                  Quên mật khẩu
                </Link>
              </div>
              <div
                className='container_bottom_right'
                style={{ display: 'flex', justifyContent: 'center' }}>
                <span
                  style={{ width: 'inherit' }}
                >
                  Chưa có tải khoản ? <Link href='/signup'>Đăng ký ngay</Link>
                </span>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn