import express from 'express';
import { appConfig } from './config';
import config from './config/index';
import db from './app/db/index'

const app = express();
const host = config.APP_HOST;
const port = config.APP_PORT || 8080;
const api_version = config.API_VERSION;

appConfig(app);


db.connect()
  .then((obj) => {
    app.listen(port, () => {
      obj.done();
      logger.info(`Server started at ${host}:${port}/api/${api_version}/`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

export default app;

