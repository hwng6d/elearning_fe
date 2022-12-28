import express from 'express';
import next from 'next';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();



app
  .prepare()
  .then(() => {
    const server = express();

    if (dev) {
      server.use(
        `/api`,
        createProxyMiddleware({
          //target: 'http://localhost:8000',
          target: process.env.TARGET_API_URL,
          changeOrigin: true,
          onProxyRes: function (proxyRes, req, res) {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          }
        })
      )
    }

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (error) => {
      if (error) throw error;
      console.log(`> Ready on ${process.env.TARGET_API_URL}`)
    })
  })
  .catch(error => {
    console.log('Error: ', error);
  })