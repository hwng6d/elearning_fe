import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin, message } from "antd";
import axios from "axios";

const ActivationIndexPage = () => {
  // router
  const router = useRouter();

  // functions
  const redirectPage = () => {
    router.replace(`/signin`);
  }

  useEffect(() => {
    redirectPage();
  }, [])

  return (
    <div style={{ textAlign: 'center' }}>
      <Spin spinning={true} style={{ fontSize: '32px', color: 'green' }}/>
    </div>
  )
};

export default ActivationIndexPage;