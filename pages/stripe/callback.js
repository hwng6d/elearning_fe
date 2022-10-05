import React, { useEffect, useContext, useState } from 'react'
import { SyncOutlined } from '@ant-design/icons';
import { Context } from '../../context/index';
import axios from 'axios';

function StripeCallback() {
  const { state: { user }, dispatch } = useContext(Context);

  useEffect(() => {
    if (user) {
      axios.post('/api/instructor/get-account-status')
        .then(res => {
          console.log(res.data);
          dispatch({
            type: 'LOGIN',
            payload: res.data.data
          });
          window.localStorage.setItem('user', JSON.stringify(res.data.data));
          window.location.href = '/instructor';
        })
    }
  }, [user])

  return (
    <div
      style={{ padding: '24px', textAlign: 'center' }}
    >
      <SyncOutlined spin={true} style={{ fontSize: '100px', color: '#ff6f44' }}/>
      <div style={{ display: 'block', fontSize: '20px' }}>{message}</div>
    </div>
  )
}

export default StripeCallback