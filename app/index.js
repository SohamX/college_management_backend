import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import config from './config/index.js';
import routes from './routes/index.js';

const startServer = () => {
  const app = express();

  const PORT = config.PORT || 5000;
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.json());
  app.use(helmet());
  app.use(fileUpload());
  app.use(
    cors({
      origin: [
        'https://college-management-rho.vercel.app',
        'http://localhost:3000',
        'https://ims-cyan.vercel.app'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use('/', routes);

  // app.get('/', (req, res) => {
  //   res.status(200);
  // });

  app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' }).status(200);
  });
  return app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode`),
  );
};

export { startServer };
