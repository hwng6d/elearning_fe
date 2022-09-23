import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import { SyncOutlined } from '@ant-design/icons';

const UserRoute = ({ children }) => {
  const router = useRouter();
  const [ok, setOk] = useState(false);

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
      router.push('/login');
    }
  }

  return (
    <div>
      {
        !ok
        ? <SyncOutlined spin={true}/>
        : (<div>{ children }</div>)
      }
    </div>
  )
}

export default UserRoute;