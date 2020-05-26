const path = require('path');

const ServiceNowConnector = require(path.join(__dirname, './connector.js'));

const EventEmitter = require('events').EventEmitter;

class ServiceNowAdapter extends EventEmitter {

  constructor(id, adapterProperties) {

    super();

    this.id = id;
    this.props = adapterProperties;

    this.connector = new ServiceNowConnector({
      url: this.props.url,
      username: this.props.auth.username,
      password: this.props.auth.password,
      serviceNowTable: this.props.serviceNowTable
    });
  }
  
  connect() {
    this.healthcheck();
  }
  
  healthcheck(callback) {
    this.emitOnline();
  }

  emitOffline() {
    this.emitStatus('OFFLINE');
    log.warn('ServiceNow: Instance is unavailable.');
  }

  emitOnline() {
    this.emitStatus('ONLINE');
    log.info('ServiceNow: Instance is available.');
  }

  emitStatus(status) {
    this.emit(status, { id: this.id });
  }

  getRecord(callback) {
      console.log("getRecord is called");
      log.info('calling getRecord method.');
  }

  postRecord(callback) {
      console.log('calling postRecord method.');
      log.info('calling postRecord method.');
  }
  
  callback(data, error) {
      if (error) {
          log.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
          console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
      }
      log.info(`\nResponse returned from POST request:\n${JSON.stringify(data)}`);
      console.log(`\nResponse returned from POST request:\n${JSON.stringify(data)}`);
  }
}

module.exports = ServiceNowAdapter;