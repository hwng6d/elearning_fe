import { message, Modal } from "antd";
import { useEffect, useState } from "react";
import { Input } from 'antd';
import axios from "axios";

const ModalAddCategory = ({
  setLoading,
  isEdit,
  modalAddCategoryOpened,
  setModalAddCategoryOpened,
  modalEditCategory,
  setModalEditCategory,
  getAllTags,
}) => {
  // states
  const [category, setCategory] = useState({ name: '' });

  // functions
  const onCancelClick = () => {
    setCategory({ ...category, name: '' });
    if (!isEdit)
      setModalAddCategoryOpened(false);
    else
      setModalEditCategory({...modalEditCategory, opened: false, which: {}});
  }

  const onOkClick = async () => {
    try {
      setLoading(true);
      
      if (!isEdit) {
        await axios.post(
          `/api/category/ad/`,
          { category }
        );
  
        setModalAddCategoryOpened(false);
      } else {
        await axios.put(
          `/api/category/ad/${modalEditCategory.which._id}/update`,
          { category }
        );

        setModalEditCategory({...modalEditCategory, opened: false, which: {}});
      }

      getAllTags();
      setLoading(false);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi thêm phân loại. Chi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  const fetchCategory = () => {
    if (isEdit)
      setCategory({
        ...category,
        name: modalEditCategory.which.name
      });
  }

  useEffect(() => {
    fetchCategory();
  }, [isEdit])

  return (
    <Modal
      title={`${isEdit ? 'Sửa' : 'Thêm'} phân loại`}
      open={modalAddCategoryOpened || modalEditCategory.opened}
      cancelText='Hủy'
      okText='Đồng ý'
      onCancel={onCancelClick}
      onOk={onOkClick}
    >
      <label><b>Tên phân loại</b></label>
      <Input
        value={category.name}
        onChange={(e) => setCategory({ ...category, name: e.target.value })}
        placeholder='Nhập tên phân loại'
        style={{
          marginTop: '8px',
          border: '2px solid #b0b7bf',
          width: '100%',
          resize: 'none'
        }}
      />
    </Modal>
  )
};

export default ModalAddCategory;