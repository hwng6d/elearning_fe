import { useState, useEffect } from 'react';
import AdminRoute from '../../../components/routes/AdminRoute';
import axios from 'axios';
import { Table, Spin, Tooltip, Button, Modal, Space, Upload, message, Popconfirm } from 'antd';
import styles from '../../../styles/components/admin/banner/HomeBanner.module.scss'
import Image from 'next/image';
import { getBase64 } from '../../../utils/getBase64';
import { DeleteOutlined, PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Dropdown, TextField } from '@fluentui/react';
import { ERRORS_NAME } from '../../../utils/constant';
import { setDelay } from '../../../utils/setDelay';

const AdvertisementBannerPage = () => {
  // states
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currPosition, setCurrPosition] = useState({});
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
      width: '64px',
    },
    {
      dataIndex: 'banner_category',
      title: <b>Vị trí</b>,
      width: '128px',
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
            type: 'sale',
            salePosition: currPosition,
            image: uploadImgReponse.data
          }
        }
      );

      // set stuffs...
      message.success(`Đã thêm banner cho phần Quảng cáo`);
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
      const query = {
        type: 'sale',
        salePosition: currPosition
      };
      const queryString = new URLSearchParams(query).toString();

      const { data } = await axios.get(`/api/banner/public?${queryString}`);

      setBanners(data.data);
      await setDelay(300);
      setLoading(false);
    }
    catch (error) {
      const err_message = ERRORS_NAME.find(_ => { if (error?.response?.data?.message?.includes(_.keyword)) return _ });

      if (err_message)
        message.error(err_message.vietnamese);
      else
        message.error(`Xảy ra lỗi khi lấy danh sách sale banner, vui lòng thử lại\nChi tiết: ${error.message}`);
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
        banner_postition: banner?.salePosition,
        banner_image: (
          <div
            style={{
              width: '300px',
              height: '140px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <img
              alt={`image_${index}`}
              src={banner?.image?.Location?.toString()}
              width={300}
              height={140}
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
  }, [currPosition]);

  useEffect(() => {
    _setDataSource();
  }, [banners])

  return (
    <AdminRoute hideSidebar={false}>
      <div
        className={styles.container}
      >
        <div
          className={styles.d_flex_col}
          style={{ gap: '8px' }}
        >
          <h2
            className={styles.h2}
          >
            Banner cho quảng cáo ở màn hình Home
          </h2>
          <div
            className={styles.d_flex_row}
            style={{ alignItems: 'flex-end' }}
          >
            <Dropdown
              label='Chọn phân loại'
              placeholder='Lựa chọn phân loại'
              options={[
                {
                  key: 'left',
                  text: 'Bên trái'
                },
                {
                  key: 'right',
                  text: 'Bên phải'
                }
              ]}
              onChange={(event, item) => setCurrPosition(item.key)}
              style={{ width: '256px' }}
            />
            <Tooltip
              title={currPosition ? 'Thêm mới banner' : 'Hãy chọn vị trí banner'}
            >
              <PlusCircleOutlined
                className={`${styles['btn_edit_small']} ${styles['btn_edit_small_lessons']}`}
                style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                onClick={
                  currPosition
                  && (() => setPreviewImgObj({ ...previewImgObj, modalImgOpened: true }))
                }
              />
            </Tooltip>
          </div>
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
            <p>Phân loại: <b>{currPosition}</b></p>
            <p>Hãy chọn banner có độ phân giải <b>600px x 280px</b></p>
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

export default AdvertisementBannerPage;