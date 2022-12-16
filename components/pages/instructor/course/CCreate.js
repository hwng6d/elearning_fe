import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Breadcrumb, Form, Input, InputNumber, Select, Button, Tag, Upload, Space, Modal, Image, Steps, message, Tooltip } from 'antd';
import { HomeOutlined, UploadOutlined, LeftCircleFilled, RightCircleFilled, LeftCircleOutlined } from '@ant-design/icons';
import Head from 'next/head';
import axios from 'axios';
import { getBase64 } from '../../../../utils/getBase64';
import InputList from '../../../inputs/inputlist/InputList';
import styles from '../../../../styles/components/instructor/course/CourseCreate.module.scss';

function CCreate() {
  // router
  const router = useRouter();

  // states
  const [currStep, setCurrStep] = useState(0);
  const [formValues, setFormValues] = useState({
    name: '',
    summary: '',
    goal: [],
    description: '',
    paid: true,
    price: '9.99',
    category: [],
    requirements: [],
    languages: ['Tiếng Việt'],
    goal: [],
    uploading: false,
    loading: false,
  });
  const [image, setImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpened, setPreviewOpened] = useState(false);
  const [categories, setCategories] = useState([]);

  // variables
  const stepsName = [
    'Điền thông tin khóa học',
    'Tên của khóa học',
    'Tóm tắt về khóa học',
    'Học viên nhận được gì sau khóa học ?',
    'Thêm phân loại',
    'Mô tả chi tiết về khóa học'
  ];

  // functions
  const inputChangeHandler = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  const previewHandler = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpened(true);
  }

  const chooseImageHandler = async (files) => {
    const { fileList: newFileList } = files;
    setFileList(newFileList);
  }

  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `/api/category/ins`
      );

      setCategories(data.data);
    }
    catch (error) {
      message.error('Xảy ra lỗi khi lấy danh sách phân loại');
    }
  }

  const imageUploadHandler = async () => {
    setFormValues({ ...formValues, uploading: true });
    try {
      const base64 = await getBase64(fileList[0].originFileObj);
      const { data } = await axios.post('/api/course/ins/upload-image', { image: base64 });
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
      await axios.post('/api/course/ins/remove-image', { image });
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
    console.log('formValues: ', formValues);

    setFormValues({ ...formValues, loading: true });
    try {
      const { data } = await axios.post('/api/course/ins', {
        ...formValues,
        image
      });
      setFormValues({ ...formValues, loading: false });
      message.success('Tạo khóa học thành công, hãy đến những bước tiếp theo!');
      // window.location.href = '/instructor'
      router.push(`/instructor/course/view/${data.data.slug}`);
    }
    catch (error) {
      console.log(error);
      setFormValues({ ...formValues, loading: false });
      message.error('Tạo thất bại, vui lòng thử lại nhé!');
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div
      className={styles.container}
    >
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Lobster&display=swap'
          rel='stylesheet'
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sriracha&display=swap" rel="stylesheet"
        />
      </Head>
      <Breadcrumb
        className={styles.container_breadcrumb}
      >
        <Breadcrumb.Item>
          <Link href='/'>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item >
          <Link href='/instructor'>
            Instructor
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href='#'>
            Tạo khóa học mới
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div
        className={styles.container_content}
      >
        <Steps
          className={`${styles.container_content_steps} container_content_steps`}
          type='navigation'
          current={currStep}
          onChange={(value) => setCurrStep(value)}
          style={{ marginTop: '40px' }}
        >
          <Steps.Step />
          <Steps.Step />
          <Steps.Step />
          <Steps.Step />
          <Steps.Step />
          <Steps.Step />
        </Steps>
        <div
          className={styles.container_content_inputs}
        >
          {
            currStep === 0 && (
              <div
                className={styles.container_content_inputs_intro}
              >
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler} />
                <p
                  style={{ marginTop: '40px', fontSize: '20px' }}
                >
                  Việc tạo khóa học mới, bạn - Instructor sẽ phải tuân thủ quy định của <b>nextgoal</b> và quy định của pháp luật <b>Việt Nam</b>
                </p>
              </div>
            )
          }
          {
            currStep === 1 && (
              <div
                className={styles.container_content_inputs_coursename}
              >
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler} />
                <p
                  className={styles.p}
                  style={{ fontFamily: 'Sriracha, cursive', fontSize: '18px' }}
                >(Bạn có thể thay đổi lại tên của khóa học sau)</p>
                <Input
                  value={formValues.name}
                  showCount={true}
                  maxLength={200}
                  allowClear={true}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  style={{ marginTop: '32px', height: '40px' }}
                />
              </div>
            )
          }
          {
            currStep === 2 && (
              <div
                className={styles.container_content_inputs_coursesummary}
              >
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler} />
                <p
                  className={styles.p}
                  style={{ fontFamily: 'Sriracha, cursive', fontSize: '18px' }}
                >(Bạn có thể thay đổi lại tóm tắt sau)</p>
                <Input.TextArea
                  value={formValues.summary}
                  showCount={true}
                  maxLength={200}
                  allowClear={true}
                  onChange={(e) => setFormValues({ ...formValues, summary: e.target.value })}
                  style={{ marginTop: '32px', height: '40px' }}
                />
              </div>
            )
          }
          {
            currStep === 3 && (
              <div
                className={styles.container_content_inputs_coursegoal}
              >
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler} />
                <p
                  className={styles.p}
                  style={{ fontFamily: 'Sriracha, cursive', fontSize: '18px' }}
                >(Bạn có thể thay đổi lại những nội dung sẽ đạt được này sau)</p>
                <InputList
                  maxLength={5}
                  value='goal'
                  type='textbox'
                  formValues={formValues}
                  setFormValues={setFormValues}
                  scopeStyle={{ marginTop: '32px' }}
                  cellStyle={{ width: '720px' }}
                />
              </div>
            )
          }
          {
            currStep === 4 && (
              <div
                className={styles.container_content_inputs_coursetags}
              >
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler} />
                <p
                  className={styles.p}
                  style={{ fontFamily: 'Sriracha, cursive', fontSize: '18px' }}
                >(Bạn có thể thay đổi lại nội dung phân loại này sau)</p>
                {/* <InputList
                  maxLength={5}
                  value='tags'
                  type='textbox'
                  formValues={formValues}
                  setFormValues={setFormValues}
                  scopeStyle={{ marginTop: '32px' }}
                  cellStyle={{ width: '128px' }}
                /> */}
                <div
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Select
                    showSearch={true}
                    options={categories?.map(cate => {
                      return {
                        value: cate._id,
                        label: cate.name
                      }
                    })}
                    value={formValues.category}
                    onChange={(value) => setFormValues({...formValues, category: value})}
                    style={{ width: '384px' }}
                  />
                </div>
              </div>
            )
          }
          {
            currStep === 5 && (
              <div
                className={styles.container_content_inputs_coursedescription}
              >
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler} />
                <p
                  className={styles.p}
                  style={{ fontFamily: 'Sriracha, cursive', fontSize: '18px' }}
                >(Bạn có thể thay đổi lại mô tả này sau)</p>
                <p
                  className={styles.p}
                  style={{ marginTop: '8px', fontFamily: 'Sriracha, cursive', fontSize: '18px' }}
                >(Có thể sử dụng định dạng siêu văn bản như ví dụ bên dưới)</p>
                <Input.TextArea
                  value={formValues.description}
                  allowClear={true}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                  style={{ marginTop: '32px', height: '320px' }}
                />
              </div>
            )
          }
        </div>      
      </div>
    </div>
  );
}

export default React.memo(CCreate);

const HeaderComponent = ({ stepsName, currStep, setCurrStep, submitHandler }) => {

  return (
    <Space
      direction='horizontal'
      size={128}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '84px' }}
    >
      {
        currStep === 0 && (
          <LeftCircleOutlined
            className={styles.buttonstep_icon}
          />
        )
      }
      {
        currStep > 0 && (
          <LeftCircleFilled
            className={styles.buttonstep_icon}
            onClick={() => setCurrStep(currStep - 1)}
          />
        )
      }
      <h1
        className={styles.h1}
        style={{ fontSize: '40px', fontFamily: 'Lobster, cursive' }}
      >
        {stepsName[currStep]}
      </h1>
      {
        currStep < 5 && (
          <RightCircleFilled
            className={styles.buttonstep_icon}
            onClick={() => setCurrStep(currStep + 1)}
          />
        )
      }
      {
        currStep === 5 && (
          <Button
            type='primary'
            style={{
              fontWeight: 600,
              fontSize: '15px',
              border: 'none',
              borderRadius: '12px',
              backgroundImage: 'linear-gradient(to left, rgb(255, 105, 105), rgb(255, 155, 61))'
            }}
            onClick={submitHandler}
          >
            Hoàn tất
          </Button>
        )
      }
    </Space>
  )
}
