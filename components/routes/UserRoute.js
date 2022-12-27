import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import UserNav from '../nav/UserNav';
import { SyncOutlined } from '@ant-design/icons';

const UserRoute = ({ user, children, hideSidebar = true }) => {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/current-user');
      if (data.success) setOk(true);
    }
    catch (error) {
      console.log('Error calling current user', error);
      setOk(false);
      router.push('/signin');
    }
  }

  return (
    <div>
      {
        !ok
          ? <SyncOutlined spin={true} />
          : (
            <div>
              <UserNav
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

export default UserRoute;