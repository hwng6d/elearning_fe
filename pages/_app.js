import '../styles/globals.css';
import '../styles/globals-antd.css';
import 'antd/dist/antd.css';
import "plyr-react/plyr.css";
import TopNav from '../components/nav/TopNav';
import { Maven_Pro } from '@next/font/google'
import { Provider } from '../context';
import Footer from '../components/nav/Footer';
import { useEffect, useState } from 'react';

const maven_pro = Maven_Pro({ weight: '400', subsets: ['latin'], display: 'swap' })

function MyApp({ Component, pageProps }) {
  // variables
  const notRenderFooterPage = [
    '/instructor',
    // '/instructor/course/create',
    // '/instructor/course/view/',
    '/user',
    // '/user/courses/'
  ];

  // states
  const [isFooter, setIsFooter] = useState(true);
  
  useEffect(() => {
    notRenderFooterPage.forEach(item => {
      if (location.pathname.includes(item))
        setIsFooter(false);
    });
  }, [pageProps])

  return (
    <div className={maven_pro.className}>
      <Provider>
        <TopNav />
        <Component {...pageProps} />
        {/* {
          isFooter && <Footer />
        } */}
      </Provider>
    </div>
  )
}

export default MyApp
