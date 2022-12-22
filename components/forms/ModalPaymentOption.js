import { Modal, message } from "antd";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { Context } from "../../context";
import { useState, useEffect, useContext } from "react";

const ModalPaymentOption = ({
  modalPaymentOption,
  setModalPaymentOption,
}) => {
  // global context
  const { state: { user }, dispatch } = useContext(Context);

  // variables
  const { type } = modalPaymentOption;

  // router
  const router = useRouter();

  const vnPay = async (amount, description, lang) => {
    try {
      // temporarily save beforeClickMembership_type
      const { data: dataUser } = await axios.put(
        `/api/instructor/temp-save-beforeclickmembership?type=${type}`
      );

      console.log('dataUser.data: ', dataUser.data)

      dispatch({
        type: 'LOGIN',
        payload: dataUser.data
      });
      
      window.localStorage.setItem('user', JSON.stringify(dataUser.data));

      // checkout
      const body = {
        typeOfMembership: type,
        amount: type === 'premium' ? 3490000 : type === 'gold' ? 2490000 : type === 'silver' ? 1490000 : 0,
        bankCode: 'NCB',
        orderDescription: `Membership nextgoal: ${type === 'premium' ? 3490000 : type === 'gold' ? 2490000 : type === 'silver' ? 1490000 : 0}`,
        language: 'vn',
      };

      const { data } = await axios.post(
        `/api/payment/create_payment_url`,
        body
      );

      // console.log('data: ', data);

      // window.open(data.vnpUrl, "_blank", 'noopener,noreferrer');
      window.open(data.vnpUrl);
    }
    catch (error) {
      message.error(`Có lỗi xảy ra khi thanh toán Instructor membership. Chi tiết: ${error.message}`);
      console.log('error: ', error);
      // router.push(`/${error.response.data.data.shortUrl}`);
    }
  }

  return (
    <Modal
      width={512}
      centered={true}
      title='Thanh toán'
      footer={null}
      open={modalPaymentOption.opened}
      onCancel={() => setModalPaymentOption({ ...modalPaymentOption, opened: false, type: '' })}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: '64px',
          padding: '40px 24px'
        }}
      >
        {/* <div
          style={{
            width: '128px',
            height: '128px',
            cursor: 'pointer',
            border: '1px solid gray',
            borderRadius: '10px',
            padding: '24px',
          }}
        >
          <Image
            src='/paypal.png'
            width={316}
            height={312}
            alt='paypal_payment'
            style={{
              objectFit: 'cover',
              width: '-webkit-fill-available',
              height: '-webkit-fill-available'
            }}
          />
        </div> */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ color: '#ff5349' }}><b>{type === 'silver' ? '1.490.000' : type === 'gold' ? '2.980.000' : type === 'premium' ? '5.960.000' : ''} vnđ</b></p>
        </div>
        <div
          style={{
            width: '128px',
            height: '128px',
            cursor: 'pointer',
            border: '2px solid #cccccc',
            borderRadius: '10px',
            padding: '12px',
          }}
          onClick={vnPay}
        >
          <Image
            src='/vnpay.png'
            width={256}
            height={256}
            alt='vnpay_payment'
            style={{
              objectFit: 'cover',
              width: '-webkit-fill-available',
              height: '-webkit-fill-available'
            }}
          />
        </div>
        <p><b>Thanh toán với VN Pay</b></p>
      </div>
    </Modal>
  )
};

export default ModalPaymentOption;