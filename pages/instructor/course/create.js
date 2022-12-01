import InstructorRoute from '../../../components/routes/InstructorRoute';
import CCreate from '../../../components/pages/instructor/course/CCreate';

function CourseCreate() {
  return (
    <div>
      <InstructorRoute hideSidebar={true}>
        <CCreate />
      </InstructorRoute>
    </div>
  )
}

export default CourseCreate
