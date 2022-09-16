import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import styles from '../styles/SignUp.module.scss';
import { ERRORS_NAME } from '../utils/constant';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

      toast.success('Đăng ký thành công !');
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      const err_message = ERRORS_NAME.find(item => { if (error.response.data.message.includes(item.keyword)) return item });
      toast.error(err_message ? err_message.vietnamese : error.response.data.message)
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
          style={{ width: 'fit-content' }}
        >
          <Input
            className={styles.input}
            allowClear={true}
            id='name'
            placeholder='Nhập tên'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className={styles.input}
            allowClear={true}
            id='email'
            placeholder='Nhập email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className={styles.input}
            allowClear={true}
            id='password'
            type='password'
            placeholder='Nhập mật khẩu'
            alue={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              onClick={(e) => submitFormHandler(e)}
              disabled={!email || !name || !password || loading}
            >
              Đăng ký {loading && <SyncOutlined spin={true} />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp