const options = {
  url: 'https://dev61798.service-now.com/',
  username: 'admin',
  password: 'Yv1zUYrJ3aWr',
  serviceNowTable: 'change_request'
};

const path = require('path');

const ServiceNowConnector = require(path.join(__dirname, './connector.js'));

function mainOnObject() {
  const connector = new ServiceNowConnector(options);

  connector.get();
  connector.post();

}

mainOnObject();