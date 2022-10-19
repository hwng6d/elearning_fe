import '../styles/globals.css';
import '../styles/globals-antd.css';
import 'antd/dist/antd.css';
import "plyr-react/plyr.css";
import TopNav from '../components/nav/TopNav';
import { Provider } from '../context';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Provider>
        <TopNav />
        <Component {...pageProps} />
      </Provider>
    </div>
  )
}

export default MyApp
