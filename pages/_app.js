import 'antd/dist/antd.css';
import TopNav from '../components/TopNav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <ToastContainer position='top-center' />
      <TopNav />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
