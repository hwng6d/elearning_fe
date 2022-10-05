import React, { useContext } from 'react';
import { Button } from 'antd';
import Image from 'next/image';
import { SettingOutlined } from '@ant-design/icons';
import { Context } from '../../context/index';

function CInstructorIndex() {
  const { state: { user } } = useContext(Context);

  return (
    <div
    >
      <h1>Instructor Indexx {user?.email}</h1>
    </div>
  )
}

export default CInstructorIndex
