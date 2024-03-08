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
            var capturedItemObjects = context.params.capturedItemObjects;
            var thisLineToRemove = context.params.thisLineToRemove;
            var newCapturedItemObjects = capturedItemObjects.filter(function(element,key){                
                var thisItemId = element.itemId;
                var thisItemnName = element.itemName;
                return thisItemId != thisLineToRemove;
            });
            log.debug('newCapturedItemObjects', newCapturedItemObjects);
            response.capturedItemObjects = newCapturedItemObjects;            
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