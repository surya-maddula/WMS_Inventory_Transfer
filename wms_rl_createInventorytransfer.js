/**
 * Copyright (c) 1998-2018 NetSuite, Inc.
 * 2955 Campus Drive, Suite 100, San Mateo, CA, USA 94403-2511
 * All Rights Reserved.

 * This software is the confidential and proprietary information of
 * NetSuite, Inc. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with NetSuite.
 *
 *   Version    Date            Author              Remarks
 *   1.00       01/26/2024      Mahesh Babu P  Initial Version
*/

/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
*/

define(["N/search", "N/record", "N/runtime"],
function (search, record, runtime) {

    function post(context) {
        log.debug('context', context)
        try {
            var response = {
                isValid : true,
                errorMessage : ''
            };
            var userObject = runtime.getCurrentUser();
            log.debug('userObject: ', userObject);
            var subsidiary = userObject.subsidiary;
            log.debug('subsidiary: ', subsidiary);
            var invStatusFeatureInEffect = runtime.isFeatureInEffect({
                feature: 'INVENTORYSTATUS'
            });
            log.debug('invStatusFeatureInEffect: ', invStatusFeatureInEffect);
            var capturedItemObjects = context.params.capturedItemObjects;
            var fromLocationId = context.params.warehouseLocationId;
            var toLocationId = context.params.toWarehouseLocationId;
            var toStatusId = context.params.toStatusId;            
            var recInventoryTransfer = record.create({
                type: record.Type.INVENTORY_TRANSFER,
                isDynamic: true
            });
            recInventoryTransfer.setValue({
                fieldId: 'subsidiary',
                value: subsidiary
            });            
            recInventoryTransfer.setValue({
                fieldId: 'location',
                value: fromLocationId
            });
            recInventoryTransfer.setValue({
                fieldId: 'transferlocation',
                value: toLocationId
            });            
            for (var i = 0; i < capturedItemObjects.length; i++) {
                log.debug('capturedItemObjects[i]: ',capturedItemObjects[i]);                
                recInventoryTransfer.selectNewLine({
                    sublistId: 'inventory'
                });
                recInventoryTransfer.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'item',
                    value: capturedItemObjects[i].itemId
                });
                recInventoryTransfer.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'adjustqtyby',
                    value: capturedItemObjects[i].scannedQuantity
                });
                var invDetailSubrecord = recInventoryTransfer.getCurrentSublistSubrecord({
                    sublistId: 'inventory',
                    fieldId: 'inventorydetail'
                });
                var inventoryLineCount = invDetailSubrecord.getLineCount({ sublistId: 'inventoryassignment' });
                log.debug('inventoryLineCount: ',inventoryLineCount);
                for(var itr=0; itr < inventoryLineCount; itr++ )
                {
                    invDetailSubrecord.selectLine({
                        sublistId: 'inventoryassignment',
                        line: itr
                    });
                    var thisQuantity = invDetailSubrecord.getCurrentSublistValue({
                        sublistId: 'inventoryassignment',
                        fieldId: 'quantity',
                        value: capturedItemObjects[i].scannedQuantity
                    });
                    log.debug('thisQuantity: ',thisQuantity);
                    invDetailSubrecord.setCurrentSublistValue({
                        sublistId: 'inventoryassignment',
                        fieldId: 'quantity',
                        value: capturedItemObjects[i].scannedQuantity
                    });
                    if(invStatusFeatureInEffect)
                    {
                        invDetailSubrecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'inventorystatus',
                            value: capturedItemObjects[i].fromStatusInternalId
                        });
                        invDetailSubrecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'toinventorystatus',
                            value: toStatusId
                        });
                    }
                    invDetailSubrecord.commitLine({
                        sublistId: 'inventoryassignment'
                    });
                }
                recInventoryTransfer.commitLine({
                    sublistId: 'inventory'
                });               
            }
            var tranId = recInventoryTransfer.save();
            log.debug('tranId', tranId);
            log.debug('response', response);
        }
        catch (e) {
            log.debug('err', e);
            response.isValid = false;
            response.errorMessage = e.message;
            log.debug('response', response);
        }
        return response;
    } 
    return {
        post: post
    }


});