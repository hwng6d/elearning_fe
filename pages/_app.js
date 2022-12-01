import '../styles/globals.css';
import '../styles/globals-antd.css';
import 'antd/dist/antd.css';
import "plyr-react/plyr.css";
import TopNav from '../components/nav/TopNav';
import { Maven_Pro } from '@next/font/google'
import { Provider } from '../context';

const maven_pro = Maven_Pro({ weight: '400', subsets: ['latin'], display: 'swap' })

function MyApp({ Component, pageProps }) {
  return (
    <div className={maven_pro.className}>
      <Provider>
        <TopNav />
        <Component {...pageProps} />
      </Provider>
    </div>
  )
}

export default MyApp
