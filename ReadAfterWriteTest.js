/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const { setTimeout } = require('timers');

const channelName = 'mychannel';
const chaincodeName = 'ledger';
const mspOrg1 = 'Org1MSP';

const walletPath = path.join(__dirname, 'wallet');
const userId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities, with the state database using couchdb
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca -s couchdb
// - Use any of the asset-transfer-ledger-queries chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "ledger". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied
   OR
   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-ledger-queries/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show ledger queries operations with any of the asset-transfer-ledger-queries chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */
async function main() {
	let skipInit = false;
	if (process.argv.length > 2) {
		if (process.argv[2] === 'skipInit') {
			skipInit = true;
		}
		skipInit = true;
	}

	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			skipInit = true;
			if (!skipInit) {
				try {
					console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
					await contract.submitTransaction('InitLedger');
					console.log('*** Result: committed');
				} catch (initError) {
					// this is error is OK if we are rerunning this app without restarting
					console.log(`******** initLedger failed :: ${initError}`);
				}
			} else {
				console.log('*** not executing "InitLedger');
			}

			let result;


			

		


			//Schleife schreiben in der neue Assets erstellt werden 
			var ersteTransactionGewonnen = 0;
			var zweiteTransactionGewonnen =0;

			for(var i = 1220; i <= 1500; i++) { 
				var currentAsset = 'asset' + i
			
				
			await doSetTimeout(currentAsset);	
			
			}

			 async function doSetTimeout(currentAsset) {
				try {
					await contract.submitTransaction('CreateAsset', currentAsset, 'green', '11', 'Robert', '650')


                    //Anmerkung für Bene: Wenn ich hier lange werte abspeichert als "Erster*50", gewinnt quasi immer die Zweite Transaktion. Man kann es quasi in jede Richtung provozieren.

					contract.submitTransaction('TransferAsset',currentAsset,'Erster')
					contract.submitTransaction('TransferAsset',currentAsset,'Zweiter')
                    await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](3000) // 3 sec

                result = await contract.evaluateTransaction('ReadAsset', currentAsset)
                var resultasJson = prettyJSONString(result.toString())
                const obj = JSON.parse(resultasJson);
                console.log("Das ist unser ganzes object " +obj)
                console.log("Das ist unser besitzer noch nicht als String: " + obj.owner)
                var currentOwner = obj.owner.toString()
                console.log(typeof(currentOwner))
                console.log("Das ist unser Owner als String: " + currentOwner)
                if(currentOwner === "Erster"){
                    ersteTransactionGewonnen= ersteTransactionGewonnen+1;
                } else if(currentOwner === "Zweiter"){
                zweiteTransactionGewonnen= 	zweiteTransactionGewonnen +1;
                }
                console.log("So oft hat die erste Transaktion gewonnen" + ersteTransactionGewonnen)
                console.log("So oft hat die zweite Transaktion gewonnen" + zweiteTransactionGewonnen)


				} catch (error) {
					//console.log(error)
				}
            }

         

				
				
			

			  
			console.log('*** all tests completed');
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			console.log("So oft hat die erste Transaktion gewonnen" + ersteTransactionGewonnen)
			console.log("So oft hat die zweite Transaktion gewonnen" + zweiteTransactionGewonnen)
			gateway.disconnect();
		}
	} catch (error) {
		//console.error(`******** FAILED to run the application: ${error}`);
		console.log("So oft hat die erste Transaktion gewonnen" + ersteTransactionGewonnen)
			console.log("So oft hat die zweite Transaktion gewonnen" + zweiteTransactionGewonnen)
	}

	console.log('*** application ending');

}

main();