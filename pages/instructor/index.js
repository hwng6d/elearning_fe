import React from 'react';
import { Button } from 'antd';
import InstructorRoute from '../../components/routes/InstructorRoute';
import CInstructorIndex from '../../components/instructor/CInstructorIndex';

function InstructorIndex() {
  return (
    <div>
      <InstructorRoute
        hideSidebar={false}
      >
        <CInstructorIndex/>
      </InstructorRoute>
    </div>
  )
}

export default InstructorIndex
