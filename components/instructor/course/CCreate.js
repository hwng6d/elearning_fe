import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Breadcrumb, Form, Input, InputNumber, Select, Button, Tag, Upload, Space, Modal, Image, message } from 'antd';
import { SettingOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getBase64 } from '../../../utils/getBase64';
import styles from '../../../styles/components/instructor/course/CourseCreate.module.scss';

function CCreate() {
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    paid: true,
    price: '9.99',
    category: '',
    uploading: false,
    loading: false,
  });
  const [image, setImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpened, setPreviewOpened] = useState(false);

  const inputChangeHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  const previewHandler = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    console.log('file: ', file);
    setPreviewImage(file.url || file.preview);
    setPreviewOpened(true);
  }

  const chooseImageHandler = async (files) => {
    const { fileList: newFileList } = files;
    setFileList(newFileList);
  }

  const imageUploadHandler = async () => {
    setFormValues({ ...formValues, uploading: true });
    try {
      const base64 = await getBase64(fileList[0].originFileObj);
      const { data } = await axios.post('/api/course/upload-image', { image: base64 });
      setImage(data.data);
      setFormValues({ ...formValues, uploading: false });
      message.success('Tải ảnh lên thành công');
    }
    catch (error) {
      console.log('error: ', error);
      setFormValues({ ...formValues, uploading: false });
      message.error(`Tải hình lên thất bại, hãy thử lại.\nChi tiết: ${error.message}`);
    }
  }

  const removeImageUploadHandler = async () => {
    setFormValues({ ...formValues, uploading: true });
    try {
      await axios.post('/api/course/remove-image', { image });
      setImage(null);
      setPreviewImage(null);
      setFileList([]);
      setFormValues({ ...formValues, uploading: false });
      message.success('Xóa hình đã tải thành công');
    }
    catch (error) {
      console.log('error: ', error);
      setFormValues({ ...formValues, uploading: false });
      message.error('Xóa hình đã tải thất bại, hãy thử lại');
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    console.table(formValues);
    console.table(image);

    setFormValues({ ...formValues, loading: true });
    try {
      const { data } = await axios.post('/api/course', {
        ...formValues,
        image
      });
      setFormValues({ ...formValues, loading: false });
      message.success('Tạo khóa học thành công, hãy đến những bước tiếp theo!');
      // window.location.href = '/instructor'
    }
    catch (error) {
      console.log(error);
      setFormValues({ ...formValues, loading: false });
      message.error('Tạo thất bại, vui lòng thử lại nhé!');
    }
  }

  // useEffect(() => {
  //   if (formValues.loading || formValues.uploading)
  //     message.loading();
  // }, [formValues.loading, formValues.uploading])

  return (
    <div
      className={styles.container}
    >
      <Breadcrumb
        className={styles.container_breadcrumb}
      >
        <Breadcrumb.Item>
          <Link href='/'>
            <a><HomeOutlined /></a>
          </Link>

        </Breadcrumb.Item>
        <Breadcrumb.Item >
          <Link href='/instructor'>
            <a>Instructor</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href='#'>
            <a>Tạo khóa học mới</a>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div
        className={styles.container_content}
      >
        <h1>Điền thông tin khóa học mới</h1>
        <Form
          labelAlign='left'
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 8 }}
          layout='horizontal'
          initialValues={formValues}
        >
          <Form.Item label='Tên khóa học'>
            <Input
              name='name'
              allowClear={true}
              value={formValues.name}
              onChange={(e) => inputChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label='Mô tả'>
            <Input.TextArea
              name='description'
              allowClear={true}
              onChange={(e) => inputChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label='Tag (gắn thẻ)'>
            <Input
              allowClear={true}
              name="category"
              value={formValues.category}
              onChange={(e) => inputChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label='Loại khóa học' name='paid'>
            <Select
              value={formValues.paid}
              onChange={(value) => setFormValues({
                ...formValues,
                paid: value,
                price: !value && 0
              })}
            >
              <Select.Option value={true}>Có phí</Select.Option>
              <Select.Option value={false}>Miễn phí</Select.Option>
            </Select>
          </Form.Item>
          {formValues.paid && (
            <Form.Item label='Giá' name='price'>
              <InputNumber
                style={{ width: '100%' }}
                value={formValues.price}
                min={0}
                max={99.99}
                onChange={(value) => setFormValues({ ...formValues, price: value.toString() })}
              />
            </Form.Item>
          )}
          <Form.Item label='Hình ảnh'>
            <Space direction='vertical'>
              <Upload
                className={`custom-upload-horizontal-image ${fileList.length && "disable_add_button"}`}
                listType='picture-card'
                accept='image/*'
                onChange={chooseImageHandler}
                onPreview={previewHandler}
                fileList={fileList}
              >
                <Space direction='vertical'>
                  <UploadOutlined />
                  Chọn file
                </Space>
              </Upload>
              {
                !image
                  ? (
                    <Button
                      disabled={fileList.length ? false : true}
                      onClick={imageUploadHandler}
                    >
                      Tải lên
                    </Button>
                  )
                  : (
                    <Button
                      type='danger'
                      disabled={(fileList.length ? false : true) || !image}
                      onClick={removeImageUploadHandler}
                    >
                      Xóa ảnh đã tải lên
                    </Button>
                  )
              }
            </Space>
            <Modal
              title={<b>Xem trước</b>}
              open={previewOpened}
              footer={null}
              centered={true}
              width='896px'
              style={{ textAlign: 'center' }}
              onCancel={() => setPreviewOpened(false)}
            >
              <Image
                alt='preview'
                src={previewImage}
                preview={false}
              />
            </Modal>
          </Form.Item>
          <Button
            type='primary'
            onClick={submitHandler}
          >Lưu & tiếp tục</Button>
        </Form>
      </div>
    </div>
  )
}

export default CCreate
