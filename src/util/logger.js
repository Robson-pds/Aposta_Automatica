const {config, createLogger, format, transports} = require('winston');
// const {FormatWrap, TransformableInfo} = require('logform');

//  LogLevel =
// | 'error'
// | 'warn'
// | 'info'
// | 'http'
// | 'verbose'
// | 'debug'
// | 'silly';

const formatLabelSession = format(
    (info, opts = null) => {
        const parts = [];
        if (info.session) {
            parts.push(info.session);
            delete info.session;
        }
        if (info.type) {
            parts.push(info.type);
            delete info.type;
        }

        if (parts.length) {
            let prefix = parts.join(':');
            info.message = `[${prefix}] ${info.message}`;
        }
        return info;
    }
);

const defaultLogger = createLogger({
    level: 'info',
    levels: config.npm.levels,
    format: format.combine(
        formatLabelSession(),
        format.colorize(),
        format.padLevels(),
        format.simple()
    ),
    transports: [new transports.Console()],
});

module.exports = {defaultLogger, formatLabelSession}