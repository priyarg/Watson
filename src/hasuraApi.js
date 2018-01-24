const clusterName = "flub75"
const dataUrl = "https://api." + clusterName + ".hasura-app.io/input";
const dataUserUrl = "https://api."+ clusterName +".hasura-app.io/getarray"; 
//const dataUrl = "https://api." + clusterName + ".hasura-app.io/ibm/demo/post";

import { Alert } from 'react-native';


const networkErrorObj = {
    status: 503
}

export async function tryAsk(sampleQuestion,username) {
    console.log('Making  querysampleQuestion----' + sampleQuestion);
    console.log('check username----' + username);
    //check input is text or url
    function isUrl(s) {
        var regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        return regexp.test(s);
    }

    let requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    };    

    let someQuestion = sampleQuestion;

    let body = {
        "username": " ",
        "type": " ",
        "string": " "
    }
    
    //checks the input is url or text and set the body type accordingly.
    body.string = someQuestion;
    body.username = username;
    if (isUrl(sampleQuestion)) {
        body.type = "url";       
    }
    else {
        body.type = "text";       
    }  

    requestOptions["body"] = JSON.stringify(body);
    console.log("Auth Response ---------------------");

    try {
        //POST code
        let resp = await fetch(dataUrl, requestOptions);
        console.log(resp);
        return resp;
        
    }
    catch (e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
};
export async function checkUser() {

    try {     

        //GET code
        return fetch(dataUserUrl)  
       .then(function(response) {
         console.log(response);
         console.log("check status"+response.status);               
         return response;
       })      
        //GET code ends here
    }
    catch (e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
};
