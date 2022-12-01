import React from 'react';
import InstructorRoute from '../../components/routes/InstructorRoute';
import CInstructorIndex from '../../components/pages/instructor/CInstructorIndex';

function InstructorIndex() {
  return (
    <div>
      <InstructorRoute hideSidebar={false}>
        <CInstructorIndex/>
      </InstructorRoute>
    </div>
  )
}

export default InstructorIndex
