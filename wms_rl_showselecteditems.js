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
            response.capturedItemObjects = capturedItemObjects;            
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