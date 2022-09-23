import { useContext } from "react";
import { Context } from '../../context/index';
import UserRoute from '../../components/routes/UserRoute';

const UserIndex = () => {
  const { state: { user } } = useContext(Context);

  return (
    <div>
      <UserRoute>
        <h1>{user?.name} | {user?.email}</h1>
      </UserRoute>
    </div>
  )
}

export default UserIndex;