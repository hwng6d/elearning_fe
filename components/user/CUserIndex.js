import React, { useEffect, useState, useContext } from 'react';
import { Button, Spin } from 'antd';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { SettingOutlined, SyncOutlined } from '@ant-design/icons';
import { Context } from '../../context/index';
import axios from 'axios';
import CourseListHorizontal from '../list/CourseListHorizontal';

function CUserIndex() {
  const { state: { user } } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [hide, setHide] = useState(false);

  const getEnrolledCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user/enrolled-courses');
      setEnrolledCourses(data.data.courses);
      setLoading(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi lấy danh sách khóa học, vui lòng thử lại\nChi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    getEnrolledCourses();
  }, [])

  return (
    <div
    >
      <h1 style={{ fontSize: '24px' }}>Các khóa học đã tham gia</h1>
      {
        loading
          ? (
            <Spin
              spinning={true}
              style={{ marginTop: '16px' }}
            />
          )
          : (
            <CourseListHorizontal
              courses={enrolledCourses}
            />
          )
      }
      <button style={{ opacity: '0.3' }} onClick={() => setHide(!hide)}>{hide ? 'Ẩn' : 'Hiện'}</button>
      {hide && <pre>{JSON.stringify(enrolledCourses, null, 4)}</pre>}
    </div>
  )
}

export default CUserIndex
