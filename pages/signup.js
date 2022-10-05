import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { Input, Button, message } from 'antd';
import { Context } from '../context';
import Link from 'next/link';
import styles from '../styles/SignUp.module.scss';
import { ERRORS_NAME } from '../utils/constant';

const SignUp = () => {
  const router = useRouter();
  const { state: { user }, dispatch } = useContext(Context);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user)
      router.push('/')
  }, [user])

  const submitFormHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.table({
        name,
        email,
        password
      });

      await axios.post(
        // `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        `/api/auth/register`,
        { name, email, password }
      );

      message.success('Đăng ký thành công !');
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      const err_message = ERRORS_NAME.find(item => { if (error.response.data.message.includes(item.keyword)) return item });
      message.error(err_message ? err_message.vietnamese : error.response.data.message)
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className='container'>
        <h1 className={styles.header1}>Đăng ký, học ngay</h1>
        <form
          id='signup_form'
          className={styles.form}
          onSubmit={submitFormHandler}
          style={{ width: '420px' }}
        >
          <label>Họ tên</label>
          <Input
            className={styles.input}
            allowClear={true}
            id='name'
            placeholder='Nhập tên'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Email</label>
          <Input
            className={styles.input}
            allowClear={true}
            id='email'
            placeholder='Nhập email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Mật khẩu</label>
          <Input
            className={styles.input}
            allowClear={true}
            id='password'
            type='password'
            placeholder='Nhập mật khẩu'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
          >
            <div
              style={{ gap: '10px', display: 'flex', alignItems: 'center' }}
              className='container_right'
            >
              <span>
                Đã có tài khoản ? <Link href='/signin'><a>Đăng nhập</a></Link>
              </span>
              <Button
                style={{ width: '92px' }}
                onClick={(e) => submitFormHandler(e)}
                disabled={!email || !name || !password || loading}
              >
                Đăng ký {loading && <SyncOutlined spin={true} />}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp