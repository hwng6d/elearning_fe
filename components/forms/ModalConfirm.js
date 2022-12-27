import { Modal } from 'antd';

const ModalConfirm = ({
  text,
  open,
  setOpen,
  onOk,
}) => {

  return (
    <Modal
      cancelText='Hủy'
      okText='Đồng ý'
      title='Thông báo'
      open={open.opened}
      onCancel={() => setOpen({...open, opened: false})}
      onOk={onOk}
    >
      <p><b>{text}</b></p>
    </Modal>
  )
};

export default ModalConfirm;