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

  // variables
  const stepsName = [
    'Điền thông tin khóa học',
    'Tên của khóa học',
    'Tóm tắt về khóa học',
    'Học viên nhận được gì sau khóa học ?',
    'Gắn thẻ',
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
    console.table(image);

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
    console.log('formValues change: ', formValues);
  }, [formValues])

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
          href="https://fonts.googleapis.com/css2?family=Sriracha&display=swap" rel="stylesheet" />
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
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler}/>
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
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler}/>
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
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler}/>
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
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler}/>
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
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler}/>
                <p
                  className={styles.p}
                  style={{ fontFamily: 'Sriracha, cursive', fontSize: '18px' }}
                >(Bạn có thể thay đổi lại những nội dung gắn thẻ này sau)</p>
                <InputList
                  maxLength={5}
                  value='category'
                  type='textbox'
                  formValues={formValues}
                  setFormValues={setFormValues}
                  scopeStyle={{ marginTop: '32px' }}
                  cellStyle={{ width: '128px' }}
                />
              </div>
            )
          }
          {
            currStep === 5 && (
              <div
                className={styles.container_content_inputs_coursedescription}
              >
                <HeaderComponent stepsName={stepsName} currStep={currStep} setCurrStep={setCurrStep} submitHandler={submitHandler}/>
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

        <Form
          labelAlign='left'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          layout='horizontal'
          initialValues={formValues}
          style={{ marginTop: '256px', opacity: '0.2' }}
        >
          <Form.Item label='Tên khóa học'>
            <Input
              name='name'
              minLength={3}
              maxLength={320}
              showCount={true}
              allowClear={true}
              value={formValues.name}
              onChange={(e) => inputChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label='Tóm tắt'>
            <Input.TextArea
              name='summary'
              showCount={true}
              maxLength={200}
              allowClear={true}
              onChange={(e) => inputChangeHandler(e)}
            />
          </Form.Item>
          {/* goal input */}
          <Form.Item label='Mô tả'>
            <Input.TextArea
              name='description'
              allowClear={true}
              onChange={(e) => inputChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label='Tag (gắn thẻ)'>
            <InputList
              maxLength={5}
              value='category'
              type='textbox'
              formValues={formValues}
              setFormValues={setFormValues}
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
          <Form.Item label='Yêu cầu trước khóa học'>
            <InputList
              maxLength={5}
              value='requirements'
              type='textbox'
              formValues={formValues}
              setFormValues={setFormValues}
            />
          </Form.Item>
          <Form.Item label='Ngôn ngữ'>
            <InputList
              maxLength={2}
              value='languages'
              type='select'
              formValues={formValues}
              setFormValues={setFormValues}
            />
          </Form.Item>
          <Form.Item label='Đầu ra'>
            <InputList
              maxLength={2}
              value='goal'
              type='textbox'
              formValues={formValues}
              setFormValues={setFormValues}
            />
          </Form.Item>
          <Button
            type='primary'
            onClick={submitHandler}
          >Lưu & tiếp tục</Button>
        </Form>
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
