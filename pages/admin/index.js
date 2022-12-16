import React from 'react';
import AdminRoute from '../../components/routes/AdminRoute';
import CAdminIndex from '../../components/pages/admin/CAdminIndex';

function AdminIndex() {
  return (
    <div>
      <AdminRoute hideSidebar={false}>
        <CAdminIndex/>
      </AdminRoute>
    </div>
  )
}

export default AdminIndex;
