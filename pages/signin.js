import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import { Input, Button, Space } from 'antd';
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

      router.push('/');

      toast.success('Đã đăng nhập !');
      setLoading(false);
    }
    catch (error) {
      const err_message = ERRORS_NAME.find(item => { if (error.response.data.message.includes(item.keyword)) return item });
      toast.error(err_message ? err_message.vietnamese : error.response.data.message);
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className='container'>
        <h1 className={styles.header1}>Đăng nhập</h1>
        <form
          id='signup_form'
          className={styles.form}
          onSubmit={submitFormHandler}
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
              style={{ width: 'inherit' }}
              onClick={(e) => submitFormHandler(e)}
              disabled={!email || !password || loading}
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
                <Link href='forgot-password'>
                  <a style={{ color: '#ff3200' }}>Quên mật khẩu</a>
                </Link>
              </div>
              <div
                className='container_bottom_right'
                style={{ display: 'flex', justifyContent: 'center' }}>
                <span
                  style={{ width: 'inherit' }}
                >
                  Chưa có tải khoản ? <Link href='/signup'><a>Đăng ký ngay</a></Link>
                </span>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn