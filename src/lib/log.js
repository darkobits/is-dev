import log from 'npmlog';

log.heading = 'is-dev';
log.level = process.env.LOG_LEVEL || 'notice';

export default log;
