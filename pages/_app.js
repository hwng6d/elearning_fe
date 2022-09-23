import 'antd/dist/antd.css';
import TopNav from '../components/TopNav';
import { ToastContainer } from 'react-toastify';
import { Provider } from '../context';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Provider>
        <ToastContainer position='top-center' />
        <TopNav />
        <Component {...pageProps} />
      </Provider>
    </div>
  )
}

export default MyApp
