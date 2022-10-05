import React from 'react';
import { Button } from 'antd';
import Image from 'next/image';
import { SettingOutlined } from '@ant-design/icons';
import InstructorRoute from '../../../components/routes/InstructorRoute';
import CCreate from '../../../components/instructor/course/CCreate';

function CourseCreate() {
  return (
    <div
    >
      <InstructorRoute hideSidebar={false}>
        <CCreate />
      </InstructorRoute>
    </div>
  )
}

export default CourseCreate
