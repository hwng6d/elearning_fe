import { message, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminRoute from "../../components/routes/AdminRoute";
import { Tooltip } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalAddCategory from "../../components/forms/ModalAddCategory";
import dayjs from "dayjs";
import styles from '../../styles/components/admin/Categories.module.scss';
import ModalConfirm from "../../components/forms/ModalConfirm";

const TagsPage = () => {
  // states
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryTableData, setCategoryTableData] = useState([]);
  const [modalAddCategoryOpened, setModalAddCategoryOpened] = useState(false);
  const [modalDeleteCategory, setModalDeleteCategory] = useState({ opened: false, which: {} }); // which: category
  const [modalEditCategory, setModalEditCategory] = useState({ opened: false, which: {} }); // which: category

  // variables
  const categoryTableColumns = [
    {
      dataIndex: 'index',
      title: <b>STT</b>,
      width: '72px',
      align: 'center',
    },
    {
      dataIndex: 'name',
      title: <b>Tên thẻ</b>,
      width: '512px',
      align: 'left',
    },
    {
      dataIndex: 'numberOfCourses',
      title: <b>Số khóa học được gắn phân loại này</b>,
      width: '224px',
      align: 'left',
    },
    {
      dataIndex: 'createdAt',
      title: <b>Ngày tạo</b>,
      width: '128px',
      align: 'center',
    },
    {
      dataIndex: 'updatedAt',
      title: <b>Ngày chỉnh sửa</b>,
      width: '128px',
      align: 'center',
    },
    {
      dataIndex: 'operation',
      title: <b>Thao tác</b>,
      width: '112px',
      align: 'center',
    },
  ]

  // functions
  const onDeleteCategory = async () => {
    try {
      setLoading(true);

      await axios.put(
        `/api/category/ad/${modalDeleteCategory.which._id}/delete`
      );

      getAllTags();
      setModalDeleteCategory({...modalDeleteCategory, opened: false, which: {}});
      setLoading(false);
      message.success('Xóa thành công');
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi xóa phân loại này. Chi tiết: ${error.message}`);
      setModalDeleteCategory({...modalDeleteCategory, opened: false, which: {}});
      setLoading(false);
    }
  }

  const getAllTags = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/category/ad`);

      setCategories(data.data);

      let dataSource = [];
      data.data.forEach((category, index) => {
        dataSource.push({
          key: category._id,
          index: index + 1,
          name: <b>{category.name}</b>,
          numberOfCourses: category.slug,
          createdAt: dayjs(category?.createdAt).format('DD/MM/YYYY'),
          updatedAt: dayjs(category?.updatedAt).format('DD/MM/YYYY'),
          operation: (
            <div className={styles.d_flex_row}>
              <Tooltip title='Chỉnh sửa'>
                <EditOutlined
                  className={styles.operation_icon}
                  style={{ cursor: 'pointer', fontSize: '16px', color: 'orange' }}
                  onClick={() => setModalEditCategory({
                    ...modalEditCategory,
                    opened: true,
                    which: category,
                  })}
                />
              </Tooltip>
              <Tooltip title='Xóa'>
                <DeleteOutlined
                  className={styles.operation_icon}
                  style={{ cursor: 'pointer', fontSize: '16px', color: 'red' }}
                  onClick={() => setModalDeleteCategory({
                    ...modalDeleteCategory,
                    opened: true,
                    which: category,
                  })}
                />
              </Tooltip>
            </div>
          )
        });
      });
      setCategoryTableData(dataSource);

      setLoading(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi lấy danh sách thẻ. Chi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllTags();
  }, [])

  return (
    <AdminRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <div
          className={styles.d_flex_row}
          style={{ alignItems: 'baseline', gap: '20px' }}
        >
          <h1
            className={styles.h1}
          >Quản lý phân loại</h1>
          <p><b>{categories?.length} phân loại</b></p>
          <Tooltip
            title='Thêm thẻ'
          >
            <PlusCircleOutlined
              className={`${styles['btn_edit_small']} ${styles['btn_edit_small_lessons']}`}
              style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
              onClick={() => setModalAddCategoryOpened(true)}
            />
          </Tooltip>
        </div>
        <p style={{ marginTop: '8px', fontSize: '16px' }}>Tất cả phân loại hiện tại</p>
        <div
          className={styles.container_wrapper}
        >
          <Table
            loading={loading}
            columns={categoryTableColumns}
            dataSource={categoryTableData}
            pagination={{ defaultPageSize: 20 }}
          />
        </div>

        {
          modalAddCategoryOpened && (
            <ModalAddCategory
              setLoading={setLoading}
              modalAddCategoryOpened={modalAddCategoryOpened}
              setModalAddCategoryOpened={setModalAddCategoryOpened}
              getAllTags={getAllTags}
            />
          )
        }

        {
          modalEditCategory.opened && (
            <ModalAddCategory
              isEdit={true}
              setLoading={setLoading}
              modalEditCategory={modalEditCategory}
              setModalEditCategory={setModalEditCategory}
              getAllTags={getAllTags}
            />
          )
        }

        {
          modalDeleteCategory.opened && (
            <ModalConfirm
              open={modalDeleteCategory}
              setOpen={setModalDeleteCategory}
              text='Bạn có chắc chắn muốn xóa ?'
              onOk={onDeleteCategory}
            />
          )
        }
      </div>
    </AdminRoute>
  );
}

export default TagsPage;