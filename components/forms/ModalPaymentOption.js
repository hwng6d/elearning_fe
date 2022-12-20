import { Modal } from "antd";
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";

const ModalPaymentOption = ({
  modalPaymentOption,
  setModalPaymentOption,
}) => {
  const { price } = modalPaymentOption;

  function vnPay(amount, description, lang) {
    let body = {
      amount: price,
      bankCode: 'NCB',
      orderDescription: `Membership nextgoal: ${price}`,
      language: 'vn',
    }
    console.log(body);

    axios.post(
      '/api/payment/create_payment_url',
      body
    )
      .then((data) => {
        // console.log(data);
        window.open(data.data.vnpUrl, "_blank", 'noopener,noreferrer');
      })
      .catch(err => console.error(err));
  }

  return (
    <Modal
      width={512}
      centered={true}
      title='Chọn phương thức thanh toán'
      footer={null}
      open={modalPaymentOption.opened}
      onCancel={() => setModalPaymentOption({ ...modalPaymentOption, opened: false, price: 0 })}
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
          <p style={{ color: '#ff5349' }}><b>{price} vnđ</b></p>
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