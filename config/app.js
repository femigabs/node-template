import fs from 'fs';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import FileStreamRotator from 'file-stream-rotator';
import cors from 'cors';
import loggerInit from './logger';
import routes from '../app/routes/v1/index';
import constants from '../app/utils/constants/index'

const {
  WELCOME,
} = constants;

const logDirectory = './log';
const checkLogDir = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const expressConfig = (app) => {
	let accessLogStream;
	let logger;

	// initialize logger
	if (app.get('env') === 'development') {
		logger = loggerInit('development');
	} else if (app.get('env') === 'production') {
		logger = loggerInit('production');
	} else if (app.get('env') === 'test') {
		logger = loggerInit('test');
	} else {
		logger = loggerInit();
	}

	global.logger = logger;
	logger.info('Application starting...');
	logger.debug('Overriding \'Express\' logger');

	if (checkLogDir) {
		accessLogStream = FileStreamRotator.getStream({
			date_format: 'YYYYMMDD',
			filename: `${logDirectory}/access-%DATE%.log`,
			frequency: 'weekly',
			verbose: false,
		});
	}

	app.use(morgan('combined', { stream: accessLogStream }));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	// Use helmet to secure Express headers
	app.use(helmet());
	app.disable('x-powered-by');
	app.use(cors());
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
		res.setHeader('Access-Control-Allow-Credentials', true);
		next();
	});

	app.use('/api/v1', routes);

	// catch 404 and forward to error handler
	app.use((req, res, next) => {
		const err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development' || app.get('env') === 'test') {
		app.use((err, req, res, next) => res.status(err.code || 500)
			.json({
				data: err.data,
				message: err.message,
				code: err.code
			}));
	}

	// production error handler
	// remove stacktrace
	app.use((err, req, res, next) => res.status(err.code || 500).json({ message: err.message }));
};

export default expressConfig;
