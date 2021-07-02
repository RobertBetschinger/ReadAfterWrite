/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


//Chaincode asset-transfer-basic

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                ID: 'asset1',
                Color: 'blue',
                Size: 5,
                Owner: 'Tomoko',
                AppraisedValue: 300,
            },
            {
                ID: 'asset2',
                Color: 'red',
                Size: 5,
                Owner: 'Brad',
                AppraisedValue: 400,
            },
            {
                ID: 'asset3',
                Color: 'green',
                Size: 10,
                Owner: 'Jin Soo',
                AppraisedValue: 500,
            },
            {
                ID: 'asset4',
                Color: 'yellow',
                Size: 10,
                Owner: 'Max',
                AppraisedValue: 600,
            },
            {
                ID: 'asset5',
                Color: 'black',
                Size: 15,
                Owner: 'Adriana',
                AppraisedValue: 700,
            },
            {
                ID: 'asset6',
                Color: 'white',
                Size: 15,
                Owner: 'Michel',
                AppraisedValue: 800,
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));

            
                //Hier exisitiert das Asset dann immer nicht..
               // await this.updateAppraisedValue(ctx,"asset1",50)
               // await this.updateAppraisedValue(ctx,"asset1",25)
            
           
            console.info(`Asset ${asset.ID} initialized`);
        }

          //Intene Notizen:
            //1. Option Funktion schreiben die aufgerufen wird.
            //1.5 Funktiosinhalt einfach zweimal aufrufen
            //2. Option Assets überschreiben, aber das ist nicht der Sinn von READ after Writees nicht.


      //  await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](3000)
      //Findet das Asset nicht, was ich gerade nicht verstehe. Das selbe wie oben selbst nach Timeout
      //  await this.updateAppraisedValue(ctx,"asset1",50)
      //  await this.updateAppraisedValue(ctx,"asset1",25)

           
      
        
           //Habe ich das Hier schon getestet. Ja-->Fehler Container exited with 1
            /*
            id= 'asset6'
            amount = 50
            const assetJSON = await ctx.stub.getState(id);
            assetJSON.AppraisedValue = assetJSON.AppraisedValue + amount;
            ctx.stub.putState(id, Buffer.from(Json.stringify(assetJSON)));

            amount = 25
            const assetJSON = await ctx.stub.getState(id);
            assetJSON.AppraisedValue = assetJSON.AppraisedValue + amount;
            ctx.stub.putState(id, Buffer.from(Json.stringify(assetJSON)));
            */
           
         

             // console.info("Update Asset 6")
       // let info = await this.UpdateAsset(ctx,"asset6","white",15,"Michel",825)
       // console.log(info)

            /*
        const updatedAsset6 = {
                ID: "asset6",
                Color: "white",
                Size: 15,
                Owner: "Michel",
                AppraisedValue: 825,
            };
            const updatedAsset66 = {
                ID: "asset6",
                color: "white",
                Size: 15,
                Owner:"Michel",
                AppraisedValue: 850,
            };
            //Write über Update Asset Funktion hat bisher nicht funktioniert. Teste ich gerade noch aus. Macht ansich jedoch keinen wirjlichen Unterschied oder?
            ctx.stub.putState("asset6", Buffer.from(JSON.stringify(updatedAsset6)));
            ctx.stub.putState("asset6", Buffer.from(JSON.stringify(updatedAsset66)));
            //Appraised Value Wert ist nun 825.
            */

    }

    async readAfterWrite(ctx){
        console.log("starting read after Write")
        await this.updateAppraisedValue(ctx,"asset1",25)
        await this.updateAppraisedValue(ctx,"asset1",50)
        console.log("finished readAfterWrite")
    }

    //Das wäre die entsprechende Funktion. Testen ob das mit dem aufrufen klappt.
    async updateAppraisedValue(ctx,id,amount){
        const exists = await this.AssetExists(ctx, id);
        console.log(exists)
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
       const assetJSON = await ctx.stub.getState(id);
       assetJSON.AppraisedValue = assetJSON.AppraisedValue + amount;
       return ctx.stub.putState(id, Buffer.from(JSON.stringify(assetJSON)));
    }



    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
    }


    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
        const asset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    
    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Owner = newOwner;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = AssetTransfer;
