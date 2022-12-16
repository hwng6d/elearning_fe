import { RightCircleOutlined } from "@ant-design/icons";
import { message, Table, Tooltip } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminRoute from "../../../components/routes/AdminRoute";
import styles from '../../../styles/components/admin/course-new/index.module.scss';

const InspectCourseNewPage = () => {
  // router
  const router = useRouter();

  // states
  const [courses, setCourses] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  // vartiable
  const columns = [
    {
      dataIndex: 'index',
      title: <b>STT</b>,
      width: '72px',
      align: 'center'
    },
    {
      dataIndex: 'course_name',
      title: <b>Tên khóa học</b>,
      width: '448px',
    },
    {
      dataIndex: 'number_of_sections',
      title: <b>Số chương</b>,
      width: '92px',
    },
    {
      dataIndex: 'number_of_lessons',
      title: <b>Số bài học/ video</b>,
      width: '92px',
    },
    {
      dataIndex: 'operations',
      title: <b>Thao tác</b>,
      align: 'center',
      width: '92px'
    }
  ]

  // functions
  const onDetailCourseNewClick = (courseId) => {
    router.push(`/admin/course-new/${courseId}`);
  }

  const getNewCourses = async () => {
    try {
      const { data } = await axios.get(`/api/course/ad/course-inspect?type=new`);

      setCourses(data.data);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi lấy danh sách khóa học mới cần được phê duyệt. Chi tiết: ${error.message}`)
    }
  }

  const _setDataSource = () => {
    let data = [];
    courses.forEach((course, index) => {
      data.push({
        key: course?._id,
        index: index + 1,
        course_name: course?.name,
        number_of_sections: course?.sections?.length,
        number_of_lessons: course?.lessons?.length,
        operations: (
          <Tooltip title='Chi tiết'>
            <RightCircleOutlined
              onClick={() => onDetailCourseNewClick(course?._id)}
              style={{ fontSize: '20px', cursor: 'pointer', color: 'blue' }}
            />
          </Tooltip>
        )
      });
    });

    setDataSource(data);
  }

  useEffect(() => {
    getNewCourses();
  }, []);

  useEffect(() => {
    _setDataSource();
  }, [courses.length])

  return (
    <AdminRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <h2
          className={styles.h2}
        >
          Phê duyệt khóa học mới
        </h2>
        <div
          className={styles.container_table}
        >
          <Table
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      </div>
    </AdminRoute>
  )
};

export default InspectCourseNewPage;