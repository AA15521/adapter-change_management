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
  
  healthcheck() {
      this.getRecord((result, error) => {
          console.log("healthcheck: " + result + " ERROR: " + error);
          log.info("healthcheck: " + result + " ERROR: " + error);

          if (error) {
              log.warn('ServiceNow: Instance is OFFLINE.');
              this.emitOffline();
          }
            log.warn('ServiceNow: Instance is ONLINE.');
            this.emitOnline();          
      });
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

      let callbackData = null;
      let callbackError = null;     
            
      this.connector.get((data, error) => {
          if (error) {
              callbackError = JSON.stringify(error);
              console.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
          } else {
                callbackData = JSON.stringify(data);    
                console.log(`\nGET RESPONSE:\n${callbackData}`);
          }
        
        //console.log ("callbackData: " + callbackData + " ERROR: " + callbackError);
        //log.warn ("callbackData: " + callbackData + " ERROR: " + callbackError);
        return callback(callbackData, callbackError);
      });   
  }

  postRecord(callback) {
      console.log('calling postRecord method.');
      log.info('calling postRecord method.');

      this.connector.post((data, error) => {
        if (error) {
            console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
        }
        console.log(`\nResponse returned from POST request:\n${JSON.stringify(data)}`)
    });
  }
  
  
}

module.exports = ServiceNowAdapter;