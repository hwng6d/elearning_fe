import { Modal, Upload, Button, message, Popconfirm } from "antd";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import { UploadOutlined } from '@ant-design/icons';
import { ERRORS_NAME } from "../../utils/constant";
import { getBase64 } from "../../utils/getBase64";
import axios from "axios";
import { setDelay } from "../../utils/setDelay";

const ModalAddDocument = ({
  isEdit,
  courseId,
  modalAddDocument,
  setModalAddDocument,
  getCourseBySlug,
}) => {
  console.log('modalAddDocument: ', modalAddDocument);

  // global context
  const { state: { user } } = useContext(Context);

  // states
  const [previewPdfObj, setPreviewPdfObj] = useState({ previewPdfs: [], uploadLoading: false });
  const [documentLink, setDocumentLink] = useState({});

  // functions
  const onCancelClick = () => {
    if (!modalAddDocument.isView)
      setModalAddDocument({ ...modalAddDocument, opened: false });
    else
      setModalAddDocument({ ...modalAddDocument, opened: false, isView: false });
  }

  const pdfChangeHandler = async ({ file, fileList, event }) => {
    setPreviewPdfObj({ ...previewPdfObj, previewPdfs: fileList });
  }

  const pdfRemoveHandler = () => {
    setPreviewPdfObj({ ...previewPdfObj, previewPdfs: [], uploadLoading: false });
  }

  const onRemovePdfClick = async () => {
    // remove pdf on aws s3
    // await axios.post(
    //   `/api/course/ins/remove-pdf`,
    //   { pdfFile: modalAddDocument.lesson.document_link }
    // );

    // remove link of pdf in current lesson
    await axios.put(
      `/api/course/ins/${courseId}/lesson/${modalAddDocument.lesson._id}/update`,
      {
        sameIndexAcceptable: false,
        lesson: { document_link: {} },
        instructorId: user?._id
      }
    )

    getCourseBySlug();
    setModalAddDocument({ ...modalAddDocument, opened: false, isView: false, lesson: {} });
  }

  const uploadPdfHandler = async () => {
    try {
      setPreviewPdfObj({ ...previewPdfObj, uploadLoading: true });

      const base64 = await getBase64(previewPdfObj.previewPdfs[0].originFileObj);

      // upload to s3
      const { data: uploadPdfResponse } = await axios.post(
        `/api/course/ins/upload-pdf`,
        { pdfFile: base64 },
        {
          onUploadProgress: (e) => {
            setPreviewPdfObj({ ...previewPdfObj, uploadLoading: true })
          }
        }
      );

      setPreviewPdfObj({ ...previewPdfObj, uploadLoading: false });
      setDocumentLink(uploadPdfResponse.data);
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi tải lên video, vui lòng thử lại.\nChi tiết: ${error.message}`)
    }
  }

  const onSaveClick = async () => {
    try {
      await axios.put(
        `/api/course/ins/${courseId}/lesson/${modalAddDocument.lesson._id}/update`,
        {
          sameIndexAcceptable: false,
          lesson: { document_link: documentLink },
          instructorId: user?._id
        }
      );

      getCourseBySlug();
      setDocumentLink({});
      setModalAddDocument({ ...modalAddDocument, opened: false, lesson: {} });
    }
    catch (error) {
      const err_message = ERRORS_NAME.find(_ => { if (error.response.data.message.includes(_.keyword)) return _ });

      if (err_message)
        message.error(err_message.vietnamese);
      else
        message.error(`Xảy ra lỗi khi ${isEdit ? 'sửa nội dung' : 'thêm'} file vào bài học, vui lòng thử lại.\nChi tiết: ${error}`);
    }
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
          <p>{isEdit ? 'Sửa' : 'Thêm'} file</p>
          {
            modalAddDocument.isView && (
              <Popconfirm
            title='Bạn có chắc muốn xóa file?'
            placement='bottom'
            onConfirm={onRemovePdfClick}
          >
            <Button
              type='danger'
            >Xóa file</Button>
          </Popconfirm>
            )
          }
        </div>
      }
      width={640}
      centered={true}
      open={modalAddDocument.opened}
      footer={null}
      onCancel={onCancelClick}

    >
      {
        !modalAddDocument.isView
          ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <label><b>Chọn file</b></label>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '4px',
                }}
              >
                <Upload
                  // className={styles.form_pdf_upload}
                  type='file'
                  accept='application/pdf'
                  maxCount={1}
                  fileList={previewPdfObj.previewPdfs}
                  onChange={pdfChangeHandler}
                  onRemove={pdfRemoveHandler}
                  style={{}}
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{ border: 'none', padding: '4px 0px', width: '128px' }}
                  >Chọn file</Button>
                </Upload>
                {previewPdfObj.previewPdfs.length !== 0 && (
                  <Button
                    onClick={uploadPdfHandler}
                    style={{ width: '50%' }}
                  >Tải lên file</Button>
                )}
              </div>
              <Button
                type='primary'
                disabled={!Object.keys(documentLink).length}
                onClick={onSaveClick}
              >Lưu vào bài học</Button>
            </div>
          )
          : (
            <div
              style={{ height: '896px' }}
            >
              <object data={`${modalAddDocument?.lesson?.document_link?.Location}`} type="application/pdf" width="100%" height="100%">
                <p>Alternative text - include a link <a href={`${modalAddDocument?.lesson?.document_link?.Location}`}>to the PDF!</a></p>
              </object>
            </div>
          )
      }
    </Modal>
  )
};

export default ModalAddDocument;