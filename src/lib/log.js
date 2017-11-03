import log from 'npmlog';

log.heading = 'is-dev';
log.level = process.env.LOG_LEVEL || process.env.npm_config_loglevel;

export default log;
