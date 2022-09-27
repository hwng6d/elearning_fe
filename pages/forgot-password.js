import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/router';
import { Button, Input } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Context } from '../context/index';
import { toast } from 'react-toastify';
import style from '../styles/ForgotPassword.module.scss';

const ForgotPassword = () => {
  const router = useRouter();
  const { state: { user } } = useContext(Context);
  const [email, setEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeSentErr, setIsCodeSentErr] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user)
      router.push('/');
  }, [user]);

  useEffect(() => {
    if (success) {
      toast.success('Khôi phục mật khẩu thành công')
      router.push('/signin');
    }
  }, [success]);

  const submitFormHandler = async (e, message) => {
    e.preventDefault();

    if (message === 'requestcodereset') {
      try {
        setLoading(true);
        const { data } = await axios.post('/api/auth/forgot-password', { email });
        console.table(data);
        if (data.success) {
          setIsCodeSentErr(false);
          setIsCodeSent(true);
        }
        else {
          setIsCodeSentErr(true);
          setIsCodeSent(false)
        }
        setLoading(false);
      }
      catch (error) {
        setLoading(false)
        console.log(error);
      }
    } else if (message === 'checkcode') {
      try {
        setLoading(true);
        const { data } = await axios.post('/api/auth/reset-password', { email, code, newPassword });
        console.table('checkcode', data);
        if (data.success) {
          setSuccess(true);
          setError(false)
        }
        else {
          setError(true);
          setSuccess(false);
        }
        setLoading(false);
      }
      catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  }

  return (
    <div className={style.container}>
      <h1 className={style.header1} >Quên mật khẩu</h1>
      <form
        className={style.form}
        onSubmit={(e) => submitFormHandler(e)}
      >
        <div
          className={style.form_email}
        >
          <label className={style.form_label}>Email</label>
          <Input
            className={style.input}
            disabled={isCodeSent}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Nhập email'
          />
          <div
            className={style.container_bottom}
          >
            {
              isCodeSent ? (
                <div>
                  <p
                    style={{ color: 'green', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}
                  >Mã reset mật khẩu đã được gửi. Hãy kiểm tra hộp thư</p>
                  <hr style={{ borderTop: 'dotted 1px' }} />
                  <p
                    style={{ fontWeight: 'bold', marginBottom: '8px' }}
                  >Nhập mã khôi phục đã nhận</p>
                  <Input
                    style={{ marginBottom: '8px' }}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <p
                    style={{ fontWeight: 'bold', marginBottom: '8px' }}
                  >Nhập mật khẩu mới</p>
                  <Input
                    style={{ marginBottom: '8px' }}
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    className={style.container_button}
                    style={{ width: '100%' }}
                    disabled={loading || !email}
                    onClick={(e) => submitFormHandler(e, 'checkcode')}
                  >
                    Gửi{loading && <SyncOutlined spin={true} />}
                  </Button>
                </div>
              ) : (
                <Button
                  className={style.container_button}
                  style={{ width: '100%' }}
                  disabled={loading || !email}
                  onClick={(e) => submitFormHandler(e, 'requestcodereset')}
                >
                  Gửi mã xác nhận đến email{loading && <SyncOutlined spin={true} />}
                </Button>
              )
            }
            {
              (isCodeSentErr || error ) && (
                <p style={{ color: 'red' }}>
                  Đã xảy ra lỗi. Vui lòng thử lại
                </p>
              ) 
            }
          </div>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword;