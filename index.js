var restify = require('restify');
var config = require('config').get('block-chain-ui-server');
var nodeUUID = require('uuid/v4');
// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
let businessNetworkConnection = new BusinessNetworkConnection();
let businessNetworkDefinition;

/**
 * set up the business network connection to the hyper ledger network
 */
function initializeServer(){
    // these are the credentials to use to connect to the Hyperledger Fabric
    let participantId = config.get('participantId');
    let participantPwd = config.get('participantPwd');
    // physial connection details (eg port numbers) are held in a profile
    let connectionProfile = config.get('connectionProfile');
    // the logical business newtork has an indentifier
    let businessNetworkIdentifier = config.get('businessNetworkIdentifier');

    businessNetworkConnection.connect(connectionProfile, businessNetworkIdentifier, participantId, participantPwd).then(function(result){
      businessNetworkDefinition = result;
      console.log('Connected: BusinessNetworkDefinition obtained=' + businessNetworkDefinition.getIdentifier());
    });

    console.log('%s listening at %s', server.name, server.url);
}

var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: true }));

server.post('/patient', createPatient);
server.post('/prescriber', createPrescriber);
server.post('/insurer', createInsurer);
server.post('/liaison', createLiaison);



function createPatient(req, res, next){
    if(!req.is('application/json')){
        res.send(500, {"Error": "This service accepts content-type application.json"});
    }

    //console.log("Creating new patient ", JSON.stringify(req.params) );
    var generatedPatientID = "PATID: "+nodeUUID();

    businessNetworkConnection.getParticipantRegistry('com.novartis.iandd.Patient').then(function(participantRegistry) {
        
        let factory = businessNetworkDefinition.getFactory();
        let participant = factory.newResource('com.novartis.iandd', 'Patient', generatedPatientID);
        participant.firstName = req.params.firstName;
        participant.lastName = req.params.lastName;
        participant.address = req.params.address;
        participant.socialSecurityNumber = req.params.socialSecurityNumber;
        participant.sex = req.params.gender;

        return participantRegistry.add(participant);
        //return participantRegistry.add(participant);
    }).then(function(response){
        var resToClient = {};
        resToClient[generatedPatientID] = req.params;
        res.send(200, resToClient);
    }).catch(function(error){
        res.send(500, error);
    });
}

function createPrescriber(req, res, next){
    if(!req.is('application/json')){
        res.send(500, {"Error": "This service accepts content-type application.json"});
    }

    //console.log("Creating new patient ", JSON.stringify(req.params) );
    var generatedPrescriberID = "PRSCBID: "+nodeUUID();

    businessNetworkConnection.getParticipantRegistry('com.novartis.iandd.Prescriber').then(function(participantRegistry) {
        
        let factory = businessNetworkDefinition.getFactory();
        let participant = factory.newResource('com.novartis.iandd', 'Prescriber', generatedPrescriberID);
        let certificate = factory.newConcept('com.novartis.iandd', 'DoctorCertificate');

        certificate.registrationNumber = req.params.registrationNumber;
        certificate.expiryDate = new Date();

        participant.firstName = req.params.firstName;
        participant.lastName = req.params.lastName;
        participant.certificate = certificate;

        return participantRegistry.add(participant);
        //return participantRegistry.add(participant);
    }).then(function(response){
        var resToClient = {};
        resToClient[generatedPrescriberID] = req.params;
        res.send(200, resToClient);
    }).catch(function(error){
        res.send(500, error);
    });
}

function createInsurer(req, res, next){
    if(!req.is('application/json')){
        res.send(500, {"Error": "This service accepts content-type application.json"});
    }

    //console.log("Creating new patient ", JSON.stringify(req.params) );
    var generatedInsurerId = "INSRID: "+nodeUUID();

    businessNetworkConnection.getParticipantRegistry('com.novartis.iandd.Insurer').then(function(participantRegistry) {
        
        let factory = businessNetworkDefinition.getFactory();
        let participant = factory.newResource('com.novartis.iandd', 'Insurer', generatedInsurerId);

        participant.insurerOrgName = req.params.insurerOrgName;
        participant.insurerOrgId = req.params.insurerOrgId;

        return participantRegistry.add(participant);
        //return participantRegistry.add(participant);
    }).then(function(response){
        var resToClient = {};
        resToClient[generatedInsurerId] = req.params;
        res.send(200, resToClient);
    }).catch(function(error){
        res.send(500, error);
    });
}

function createLiaison(req, res, next){
    if(!req.is('application/json')){
        res.send(500, {"Error": "This service accepts content-type application.json"});
    }

    //console.log("Creating new patient ", JSON.stringify(req.params) );
    var generatedLiaisonId = "LIAID: "+nodeUUID();

    businessNetworkConnection.getParticipantRegistry('com.novartis.iandd.Liaison').then(function(participantRegistry) {
        
        let factory = businessNetworkDefinition.getFactory();
        let participant = factory.newResource('com.novartis.iandd', 'Liaison', generatedLiaisonId);

        participant.firstName = req.params.firstName;
        participant.lastName = req.params.lastName;
        participant.liaisonOrg = req.params.orgName;

        return participantRegistry.add(participant);
        //return participantRegistry.add(participant);
    }).then(function(response){
        var resToClient = {};
        resToClient[generatedLiaisonId] = req.params;
        res.send(200, resToClient);
    }).catch(function(error){
        res.send(500, error);
    });

}

server.listen(2400,  initializeServer);