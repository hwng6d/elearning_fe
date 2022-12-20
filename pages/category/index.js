import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setDelay } from "../../utils/setDelay";

const CategoryPage = () => {
  const router = useRouter();

  const setRedirect = async () => {
    await setDelay(500);
    router.replace('/');
  }

  useEffect(() => {
    setRedirect();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        fontSize: '24px',
        padding: '24px',
        color: 'green'
      }}
    >
      <SyncOutlined
        spin={true}
      />
    </div>
  )
};

export default CategoryPage;