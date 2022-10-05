import React, { useContext } from 'react';
import { Button } from 'antd';
import Image from 'next/image';
import { SettingOutlined } from '@ant-design/icons';
import { Context } from '../../context/index';

function CUserIndex() {
  const { state: { user } } = useContext(Context);

  return (
    <div
    >
      <h1>{user?.name} | {user?.email}</h1>
    </div>
  )
}

export default CUserIndex
