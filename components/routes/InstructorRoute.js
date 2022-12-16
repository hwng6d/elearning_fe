import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import InstructorNav from '../nav/InstructorNav';

const InstructorRoute = ({ children, hideSidebar = true, ok }) => {
  // router
  const router = useRouter();

  // states
  // const [ok, setOk] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // const fetchUser = async () => {
  //   try {
  //     const { data } = await axios.get('/api/instructor/get-current-instructor');
  //     if (data.success) setOk(true);
  //   }
  //   catch (error) {
  //     console.log('Problem with checking role...!', error);
  //     setOk(false);
  //     router.push('/');
  //   }
  // }

  // useEffect(() => {
  //   fetchUser();
  //   console.log('useEffect');
  // }, [children]);

  return (
    <div>
      {/* {
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
      } */}
      <InstructorNav
        hideSidebar={hideSidebar}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        children={children}
      />
    </div>
  )
}

export default React.memo(InstructorRoute);