import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { Input, Button, message } from 'antd';
import { Context } from '../context';
import Link from 'next/link';
import styles from '../styles/SignUp.module.scss';
import { setDelay } from '../utils/setDelay';
import { validateEmail } from '../utils/validateEmail';
import { ERRORS_NAME } from '../utils/constant';

const SignUp = () => {
  // global context
  const { state: { user }, dispatch } = useContext(Context);
  
  // router
  const router = useRouter();

  // states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // functions
  const submitFormHandler = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);

      await setDelay(1000);

      const checkEmail = validateEmail(email);
      if (!checkEmail) {
        setErrorMessage((errorMessage) => errorMessage = 'Định dạng email sai, hãy thử lại');
        setLoading(false);
        return;
      } else {
        setErrorMessage((errorMessage) => errorMessage = 'Định dạng email sai, hãy thử lại');
      }

      if (password !== retypePassword) {
        setErrorMessage((errorMessage) => errorMessage = 'Mật khẩu không khớp, vui lòng thử lại');
        setLoading(false);
        return;
      } else {
        setErrorMessage('');
      }

      const { data: dataRegister } = await axios.post(
        // `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        `/api/auth/register`,
        { name, email, password }
      );

      message.success('Đăng ký thành công! Vui lòng truy cập hộp thư để kích hoạt tài khoản');

      router.push(`/signin`)

      setLoading(false);
    }
    catch (error) {
      const err_message = ERRORS_NAME.find(_ => { if (error.response.data.message.includes(_.keyword)) return _ });
      setLoading(false);
      
      if (err_message)
        message.error(err_message.vietnamese);
      else
        message.error(`Xảy ra lỗi khi đăng ký, vui lòng thử lại\nChi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    if (user)
      router.push('/')
  }, [user])

  return (
    <div className={styles.container}>
      <div className='container'>
        <h1 className={styles.header1}>Đăng ký, học ngay</h1>
        <form
          id='signup_form'
          className={styles.form}
          onSubmit={submitFormHandler}
          style={{ width: '420px', marginTop: '16px' }}
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
          <label>Nhập lại mật khẩu</label>
          <Input
            className={styles.input}
            allowClear={true}
            id='retypePassword'
            type='password'
            placeholder='Nhập lại mật khẩu'
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
          />
          {
            errorMessage
            ? (
              <label style={{ color: 'red' }}>{errorMessage}</label>
            )
            : null
          }
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
          >
            <div
              style={{ gap: '10px', display: 'flex', alignItems: 'center' }}
              className='container_right'
            >
              <span>
                Đã có tài khoản ? <Link href='/signin'>Đăng nhập</Link>
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
  );
}

export default SignUp