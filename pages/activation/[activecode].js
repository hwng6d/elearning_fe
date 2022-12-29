import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin, message, Button } from "antd";
import { ERRORS_NAME } from "../../utils/constant";
import axios from "axios";

const ActivationPage = () => {
  // router
  const router = useRouter();

  // states
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // functions
  const checkActivation = async () => {
    try {
      setLoading(true);
      console.log('router.query.activecode: ', router.query.activecode);

      const { data: dataActivate } = await axios.post(
        `/api/auth/check-activation`,
        {
          active_code: router.query.activecode
        }
      );

      message.success('Kích hoạt thành công, vui lòng đăng nhập lại');

      setLoading(false);
    }
    catch (error) {
      const err_message = ERRORS_NAME.find(_ => { if (error.response.data.message.includes(_.keyword)) return _ });
      setLoading(false);
      
      if (err_message)
        message.error(err_message.vietnamese);
      else
        message.error(`Xảy ra lỗi khi kích hoạt tài khoản, vui lòng thử lại\nChi tiết: ${error.message}`);

    }
  }

  useEffect(() => {
    if (router.isReady)
      checkActivation();
  }, [router.query])

  return (
    <div style={{ textAlign: 'center' }}>
      {
        loading
        ? (
          <Spin spinning={true} style={{ fontSize: '32px', color: 'green' }}/>
        )
        : (
          <Button
            type='primary'
            onClick={() => router.replace('/signin')}
          >
            Đến trang đăng nhập
          </Button>
        )
      }
    </div>
  )
};

export default ActivationPage;