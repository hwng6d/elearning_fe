import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import InstructorNav from '../nav/InstructorNav';
import { SyncOutlined } from '@ant-design/icons';

const InstructorRoute = ({ children, hideSidebar = true }) => {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/instructor/get-current-instructor');
      if (data.success) setOk(true);
    }
    catch (error) {
      console.log('Problem with checking role...!', error);
      setOk(false);
      router.push('/');
    }
  }

  return (
    <div>
      {
        !ok
          ? <SyncOutlined spin={true} />
          : (
            <div>
              <InstructorNav
                hideSidebar={hideSidebar}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                children={children}
              />
            </div>
          )
      }
    </div>
  )
}

export default React.memo(InstructorRoute);