/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */

define(["N/search", "N/record"],
function (search, record) {

    function post(context) {
        log.debug('context', context)
        try {
            var response = {
                isValid : true,
                errorMessage : ''
            };
            var capturedItems = context.params.capturedItems || [];
            var capturedItemObjects = context.params.capturedItemObjects || [];
            var itemType = context.params.item_type;
            var itemId = context.params.item_id;
            var locUseBinsFlag = context.params.locUseBinsFlag;
            var scannedQuantity = context.params.scannedQuantity;
            log.debug("capturedItems",capturedItems);
            log.debug("capturedItemObjects",capturedItemObjects);
            //if(!locUseBinsFlag && (itemType == 'inventoryitem' || itemType == 'assemblyitem') && capturedItems.indexOf(itemId) == -1 && scannedQuantity > 0)
            if(!locUseBinsFlag && (itemType == 'inventoryitem' || itemType == 'assemblyitem') && scannedQuantity > 0)
            {                
                capturedItems.push(itemId);                
                var thisObject = {
                    "itemId" : context.params.item_id,
                    "itemName" : context.params.item_name,
                    "itemType" : context.params.item_type,
                    "itemDescription" : context.params.itemDescription,
                    "scannedQuantity" : context.params.scannedQuantity,
                    "scannedQuantityWithUOM" : context.params.scannedQuantityWithUOM,
                    "stockConversionRate" : context.params.stock_conversion_rate,
                    "fromStatusInternalId": context.params.fromStatusInternalId,
                    "fromStatusName": context.params.fromStatusName,
                    'remove' : 'Remove'
                };
                capturedItemObjects.push(thisObject);
                log.debug("capturedItems",capturedItems);
                log.debug("capturedItemObjects",capturedItemObjects);
                response.capturedItems = capturedItems;
                response.capturedItemObjects = capturedItemObjects;
            }            
            log.debug('response', response);
        }
        catch (e) {
            log.debug('err', e);
            log.debug('response', response);
        }
        return response;
    } 
    return {
        post: post
    }


});