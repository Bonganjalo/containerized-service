// author: Bonganjalo Hadebe

exports.Utils = (options) => {

    // Check if the request body is valid
    const isRequestValid = (request) => {

       if(!request.body || !request.body.userId){
          return false;
       }
       return true;
    };

    const isUserIdString = (request) => {

        if(typeof(request.body.userId) !== 'string'){
           return false;
        }
        return true;
     };
  return Object.freeze({
    isRequestValid,
    isUserIdString
  });

}