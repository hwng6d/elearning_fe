import { useState, useEffect } from 'react';
import AdminRoute from '../../../components/routes/AdminRoute';
import axios from 'axios';
import { Table, Spin, Tooltip, Button, Modal, Space, Upload, message, Popconfirm } from 'antd';
import styles from '../../../styles/components/admin/banner/HomeBanner.module.scss'
import Image from 'next/image';
import { getBase64 } from '../../../utils/getBase64';
import { DeleteOutlined, PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { ERRORS_NAME } from '../../../utils/constant';
import { TextField } from '@fluentui/react';

const HomeBannerPage = () => {
  // states
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [previewImgObj, setPreviewImgObj] = useState({
    previewImgs: [],
    currentPreviewImg: '',
    modalImgOpened: false,
    modalPreviewImgOpened: false,
    uploadLoading: false,
  });

  // variables
  const columns = [
    {
      dataIndex: 'index',
      title: <b>STT</b>,
      width: '72px',
      align: 'center'
    },
    {
      dataIndex: 'banner_type',
      title: <b>Loại</b>,
      width: '92px',
    },
    {
      dataIndex: 'banner_image',
      title: <b>Hình ảnh</b>,
      width: '448px',
      align: 'center'
    },
    {
      dataIndex: 'operations',
      title: <b>Thao tác</b>,
      align: 'center',
      width: '92px',
    }
  ]

  // functions
  const updateImageHandler = async (e) => {
    setPreviewImgObj({ ...previewImgObj, uploadLoading: true });
    try {
      const base64 = await getBase64(previewImgObj.previewImgs[0].originFileObj);

      // delete current image if have
      // course.image &&
      //   (await axios.post('/api/course/ins/remove-image', { image: course.image }));

      // upload to s3
      const { data: uploadImgReponse } = await axios.post('/api/banner/ad/upload-image', { image: base64 });

      // create banner with image
      await axios.post(
        `/api/banner/ad`,
        {
          banner: {
            type: 'home',
            image: uploadImgReponse.data
          }
        }
      );

      // set stuffs...
      message.success(`Đã thêm banner cho màn hình Home`);
      setPreviewImgObj({ ...previewImgObj, modalImgOpened: false, previewImgs: [], currentPreviewImg: '', uploadLoading: false });
      getListBanner();
    }
    catch (error) {
      console.log('error: ', error);
      message.error(`Thêm mới banner thất bại, hãy thử lại.\nChi tiết: ${error.message}`);
      setPreviewImgObj({ ...previewImgObj, modalImgOpened: false, previewImgs: [], currentPreviewImg: '', uploadLoading: false });
    }
  }

  const deleteBannerClick = async (banner) => {
    try {
      // delete image of banner
      await axios.post(
        `/api/banner/ad/remove-image`,
        {
          image: {
            Bucket: banner?.image?.Bucket,
            Key: banner?.image?.Key
          }
        }
      )

      // delete banner
      await axios.put(`/api/banner/ad/${banner?._id}/delete`);

      getListBanner();
    }
    catch (error) {
      console.log('error: ', error);
      message.error(`Xóa banner thất bại, hãy thử lại.\nChi tiết: ${error.message}`);
    }
  }

  const getListBanner = async () => {
    try {
      setLoading(true);
      const query = { type: 'home' };
      const queryString = new URLSearchParams(query).toString();

      const { data } = await axios.get(`/api/banner/public?${queryString}`);

      setBanners(data.data);
      setLoading(false);
    }
    catch (error) {
      const err_message = ERRORS_NAME.find(_ => { if (error.response.data.message.includes(_.keyword)) return _ });

      if (err_message)
        message.error(err_message.vietnamese);
      else
        message.error(`Xảy ra lỗi khi lấy danh sách home banner, vui lòng thử lại\nChi tiết: ${error.message}`);
      setLoading(false);
    }
  }

  const _setDataSource = async () => {
    let data = [];
    banners?.forEach((banner, index) => {
      data.push({
        key: banner?._id,
        index: index + 1,
        banner_type: banner?.type,
        banner_image: (
          <div
            style={{
              width: '512px',
              height: '125px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <img
              alt={`image_${index}`}
              src={banner?.image?.Location?.toString()}
              width={512}
              height={125}
              style={{
                objectFit: 'cover',
                width: '-webkit-fill-available',
                height: '-webkit-fill-available'
              }}
            />
          </div>
        ),
        operations: (
          <Popconfirm
            title='Bạn chắc chắn muốn xóa banner này?'
            cancelText='Hủy'
            okText='Đồng ý'
            onConfirm={() => deleteBannerClick(banner)}
          >
            <DeleteOutlined
              style={{ fontSize: '20px', cursor: 'pointer', color: 'red' }}
            />
          </Popconfirm>
        )
      })
    });
    setDataSource(data)
  }

  useEffect(() => {
    getListBanner();
  }, []);

  useEffect(() => {
    _setDataSource();
  }, [banners?.length])

  return (
    <AdminRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <div
          className={styles.d_flex_row}
        >
          <h2
            className={styles.h2}
          >
            Banner cho trang chủ
          </h2>
          <Tooltip
            title='Thêm mới banner'
          >
            <PlusCircleOutlined
              className={`${styles['btn_edit_small']} ${styles['btn_edit_small_lessons']}`}
              style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
              onClick={() => setPreviewImgObj({ ...previewImgObj, modalImgOpened: true })}
            />
          </Tooltip>
        </div>
        <div
          className={styles.container_table}
        >
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
          />
        </div>

        <Modal
          title='Thêm banner'
          maskClosable={false}
          open={previewImgObj.modalImgOpened}
          cancelText='Hủy'
          okText='Đồng ý'
          onCancel={() => setPreviewImgObj({ ...previewImgObj, modalImgOpened: false })}
          style={{ display: 'flex', justifyContent: 'center' }}
          footer={(<div>
            <Button
              type='primary'
              disabled={previewImgObj?.uploadLoading || !previewImgObj?.previewImgs.length}
              onClick={updateImageHandler}
            >Hoàn tất</Button>
          </div>)}
        >
          <div
            className={styles.d_flex_col}
            style={{ width: '384px', textAlign: 'center', gap: '20px' }}>
            <p>Hãy chọn banner có độ phân giải <b>1280px x 312px</b></p>
            <Upload
              className={`custom-upload-horizontal-image ${previewImgObj?.previewImgs?.length && "disable_add_button"}`}
              accept='image/*'
              listType='picture-card'
              fileList={previewImgObj.previewImgs}
              onChange={(e) => setPreviewImgObj({ ...previewImgObj, previewImgs: e.fileList })}
            >
              <Space direction='vertical'>
                <UploadOutlined />
                Chọn file
              </Space>
            </Upload>
          </div>
        </Modal>
      </div>
    </AdminRoute>
  )
};

export default HomeBannerPage;