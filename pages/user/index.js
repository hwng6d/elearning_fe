import UserRoute from '../../components/routes/UserRoute';
import CUserIndex from '../../components/pages/user/CUserIndex';

const UserIndex = () => {
  return (
    <div>
      <UserRoute
        hideSidebar={false}
      >
        <CUserIndex/>
      </UserRoute>
    </div>
  )
}

export default UserIndex;