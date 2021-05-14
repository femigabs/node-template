import 'dotenv/config';

export default {
  DATABASE_URL: process.env.DATABASE_TEST_URL,
  APP_HOST: process.env.APP_HOST || 'xxxxxxxxxx',
	APP_PORT: process.env.APP_PORT || 'xxxx',
	API_VERSION: process.env.API_VERSION || 'xxxxxxxxxxx',
};
