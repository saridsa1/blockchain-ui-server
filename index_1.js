'use strict';

const Table = require('cli-table');
const prettyoutput = require('prettyoutput');
var config = require('config').get('block-chain-ui-server');


// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

// these are the credentials to use to connect to the Hyperledger Fabric
let participantId = config.get('participantId');
let participantPwd = config.get('participantPwd');
// physial connection details (eg port numbers) are held in a profile
let connectionProfile = config.get('connectionProfile');

// the logical business newtork has an indentifier
let businessNetworkIdentifier = config.get('businessNetworkIdentifier');
// ... which allows us to get a connection to this business network
let businessNetworkConnection = new BusinessNetworkConnection();
// the network definition will be used later to create assets
let businessNetworkDefinition;

let assetRegistry;

// create the connection
businessNetworkConnection.connect(connectionProfile, businessNetworkIdentifier, "PRAVEENU", "uNuwZdEIGTOQ")
  .then((result) => {
      businessNetworkDefinition = result;
      console.log('Connected: BusinessNetworkDefinition obtained=' + businessNetworkDefinition.getIdentifier());
      return businessNetworkConnection.getAssetRegistry('com.novartis.iandd.ServiceRequest')
  }).then((serviceRequestRegistry) => {
      console.log('List of service requests');
      return serviceRequestRegistry.getAll();
  }).
  then((allServiceRequests) => {
      console.log("All service requests "+allServiceRequests.length)
      
      let serviceRequestTable = new Table({
          head : ['Service Request ID', 'Doctor ID', 'Patient ID']
      });
      try {
        for(var i = 0; i< allServiceRequests.length; i++){
            console.log(JSON.stringify(allServiceRequests[i].getIdentifier()));
            let tableLine = [];
            tableLine.push("allServiceRequests[i].id");
            tableLine.push("allServiceRequests[i].doctor.Id");
            tableLine.push("allServiceRequests[i].patient.Id");      
            serviceRequestTable.push(tableLine);            
        }
        console.log(serviceRequestTable.toString());
      }catch(e){
          console.error(e);
      }
        
        return businessNetworkConnection.disconnect();
  }).then(() => {
      console.log('All done');
      process.exit();
  })// and catch any exceptions that are triggered
  .catch(function (error) {
      throw error;
    });