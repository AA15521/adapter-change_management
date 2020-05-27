const options = {
  url: 'https://dev61798.service-now.com/',
  username: 'admin',
  password: 'Yv1zUYrJ3aWr',
  serviceNowTable: 'change_request'
};

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
                var jsonObj  = JSON.parse(data.body);
                
                console.log("String: " + data.statusCode);
                console.log("String: " + jsonObj.result[0].number);
                
                var obj = {};
                obj["change_ticket_number"] = jsonObj.result[0].number;
                obj["active"]               = jsonObj.result[0].active;
                obj["priority"]             = jsonObj.result[0].priority;
                obj["description"]          = jsonObj.result[0].description;
                obj["work_start"]           = jsonObj.result[0].work_start;
                obj["work_end"]             = jsonObj.result[0].work_end;   
                obj["change_ticket_key"]    = jsonObj.result[0].sys_id;

                var arrObj = [obj];
          }        
      
        return callback(arrObj, callbackError);
      });
  }

  postRecord(callback) {
      console.log('calling postRecord method.');
      log.info('calling postRecord method.');
      
      let callbackError = null;
            
      this.connector.post((data, error) => {
          if (error) {
              callbackError = JSON.stringify(error);
              console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
          } else {
                var jsonObj  = JSON.parse(data.body);
                
                console.log("String: " + data.statusCode);
                console.log("String: " + jsonObj.result.number);
                
                var obj = {};
                obj["change_ticket_number"] = jsonObj.result.number;
                obj["active"]               = jsonObj.result.active;
                obj["priority"]             = jsonObj.result.priority;
                obj["description"]          = jsonObj.result.description;
                obj["work_start"]           = jsonObj.result.work_start;
                obj["work_end"]             = jsonObj.result.work_end;   
                obj["change_ticket_key"]    = jsonObj.result.sys_id;
          }
      
        return callback(obj, callbackError);
      });
  }
}

module.exports = ServiceNowAdapter;