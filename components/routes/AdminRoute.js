import { useRouter } from "next/router";
import React, { useState } from "react";
import AdminNav from '../nav/AdminNav';

const AdminRoute = ({
  children,
  hideSidebar = true,
  ok
}) => {
  // router
  const router = useRouter();

  // states
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <AdminNav
        hideSidebar={hideSidebar}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        children={children}
      />
    </div>
  )
}

export default React.memo(AdminRoute);
