import { useState, useEffect, useContext } from 'react';
import { Context } from '../../../context';
import UserRoute from '../../../components/routes/UserRoute';
import styles from '../../../styles/user/UserInformation.module.scss';
import { EditOutlined, CheckOutlined } from '@ant-design/icons'
import { Label, TextField } from '@fluentui/react';
import { Modal, Tooltip, message } from 'antd';
import axios from 'axios';

const InformationPage = () => {
  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // states
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRePassword, setNewRePassword] = useState('');
  const [isEditName, setIsEditName] = useState(false);
  const [modalCheckPassword, setModalCheckPassword] = useState({
    opened: false,
    success: false,
    editAction: ''  // name | password
  });

  // functions
  const onEditNameHandler = async () => {
    try {
      setModalCheckPassword({ ...modalCheckPassword, opened: true, editAction: 'name' });
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi sửa tên, vui lòng thử lại\nChi tiết: ${error.message}`);
    }
  }

  const onEditPasswordHandler = async () => {
    try {
      setModalCheckPassword({ ...modalCheckPassword, opened: true, editAction: 'password' });
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi sửa mật khẩu, vui lòng thử lại\nChi tiết: ${error.message}`);
    }
  }

  const getUserInfo = async () => {
    try {
      const { data } = await axios.get(`/api/user`);

      setName(data.data.name);
    }
    catch (error) {
      message.error(`Xảy ra lỗi lấy thông tin account, vui lòng thử lại\nChi tiết: ${error.message}`);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, [])

  return (
    <UserRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <h1 className={styles.h1}>
          Thông tin của bạn
        </h1>
        <div
          className={styles.container_displayname}
        >
          <div className={styles.d_flex_row} style={{ alignItems: 'center', gap: '20px' }}>
            <Label style={{ fontSize: '16px' }}>Tên hiển thị</Label>
            {
              !isEditName
                ? (
                  <EditOutlined
                    onClick={() => setIsEditName(true)}
                    style={{ fontSize: '16px', color: 'red', cursor: 'pointer' }}
                  />
                )
                : (
                  <CheckOutlined
                    onClick={onEditNameHandler}
                    style={{ fontSize: '16px', color: 'green', cursor: 'pointer' }}
                  />
                )
            }
          </div>
          {
            !isEditName
              ? (
                <div style={{ border: '1px solid gray', padding: '4px 12px', marginTop: '8px', width: '312px' }}>
                  <p>{name}</p>
                </div>
              )
              : (
                <TextField
                  value={name}
                  onChange={(event, value) => setName(value)}
                  styles={{ fieldGroup: { marginTop: '8px', width: '312px' } }}
                />
              )
          }
        </div>
        <div
          className={styles.container_newpassword}
        >
          <div
            className={styles.d_flex_row}
          >
            <Label style={{ fontSize: '16px' }}>Mật khẩu mới</Label>
            {
              (newPassword && newRePassword) && (
                <Tooltip
                  title={newPassword === newRePassword
                    ? `Cập nhật mật khẩu`
                    : `Mật khẩu không khớp`
                  }
                >
                  <CheckOutlined
                    onClick={newPassword === newRePassword && onEditPasswordHandler}
                    style={{ fontSize: '16px', color: 'green', cursor: `${newPassword === newRePassword ? 'pointer' : 'no-drop'}` }}
                  />
                </Tooltip>
              )
            }
          </div>
          <TextField
            type='password'
            value={newPassword}
            onChange={(event, value) => setNewPassword(value)}
            styles={{ fieldGroup: { marginTop: '8px', width: '312px' } }}
          />
          {
            newPassword && (
              <div style={{ marginTop: '12px' }}>
                <Label>Nhập lại mật khẩu mới</Label>
                <TextField
                  type='password'
                  value={newRePassword}
                  onChange={(event, value) => setNewRePassword(value)}
                  styles={{ fieldGroup: { marginTop: '8px', width: '312px' } }}
                />
              </div>
            )
          }
        </div>
      </div>

      {
        modalCheckPassword.opened && (
          <Modal
            cancelText='Hủy'
            okText='OK'
            title='Nhập mật khẩu hiện tại'
            open={modalCheckPassword.opened}
            onCancel={() => setModalCheckPassword({ ...modalCheckPassword, opened: false, success: false, editAction: '' })}
            onOk={async () => {
              try {
                await axios.post(
                  `/api/auth/login`,
                  { email: user?.email, password }
                );

                if (modalCheckPassword.editAction === 'name') {
                  const { data } = await axios.put(`/api/user/edit`, { name });

                  dispatch({
                    type: 'LOGIN',
                    payload: data.data
                  });

                  window.localStorage.setItem('user', JSON.stringify(data.data));

                  setName(data?.data?.name);

                  setIsEditName(false);
                  setModalCheckPassword({ ...modalCheckPassword, success: true, opened: false, editAction: '' });

                  message.success('Thành công');
                } else if (modalCheckPassword.editAction === 'password') {
                  const { data } = await axios.put(`/api/user/edit-password`, { password: newPassword });

                  dispatch({
                    type: 'LOGIN',
                    payload: data.data
                  });

                  window.localStorage.setItem('user', JSON.stringify(data.data));

                  setModalCheckPassword({ ...modalCheckPassword, success: true, opened: false, editAction: '' });
                  setNewPassword('');
                  setNewRePassword('');

                  message.success('Thành công');
                }
              }
              catch (error) {
                message.error('Sai mật khẩu, hãy thử lại')
              }
            }}
          >
            <TextField
              type='password'
              value={password}
              onChange={(event, value) => setPassword(value)}
            />
          </Modal>
        )
      }
    </UserRoute>
  )
};

export default InformationPage;