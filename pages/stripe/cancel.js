import { Space } from 'antd';
import Image from 'next/image';
import UserRoute from '../../components/routes/UserRoute';

const StringCancelPage = () => {

  return (
    <UserRoute hideSidebar={true}>
      <Space
        direction='vertical'
        size='small'
        style={{ textAlign: 'center' }}
      >
        <Space
          direction='horizontal'
          size='middle'
        >
          <Image
            src='/stripe_payment.svg'
            width={320}
            height={320}
          />
          <Image
            src='/stripe_cancel.svg'
            width={192}
            height={192}
          />
        </Space>

        <h1
          style={{ fontSize: '28px' }}
        >Thanh toán không thành công, hãy thử lại</h1>
      </Space>
    </UserRoute>
  )
}

export default StringCancelPage;