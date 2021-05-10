import {check} from 'k6'
import {Rate, Trend} from 'k6/metrics'
import http from 'k6/http'

// Failure rate
let failureRate = new Rate("failure_rate")

//Trend
let loginTrend = new Trend("Trend_login")
let logoutTrend = new Trend("Trend_logout")
let getAllUsersTrend = new Trend("Trend_get_all_users")

export const loginEndPointUrl = baseUrl => `${baseUrl}/authentication`
export const logoutEndPointUrl = (baseUrl, guid, username) => `${baseUrl}/authentication/${guid}?username=${username}`
export const getAllUsersEndPointUrl = baseUrl => `${baseUrl}/user/all`


export const setHeader = jwtToken => {
    let header =  {
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        }
    }
    return header
}


//login
export function login(baseUrl, username, password){
    let fullUrl = loginEndPointUrl(baseUrl)

    var payload = JSON.stringify({
        username: `${username}`,
        password: `${password}`,
      });

    let response = http.post(fullUrl,payload,setHeader())
    loginTrend.add(response.timings.duration)


    let isResponseOK = check(response, {
        "login response status 200: " : r => r.status == 200
    })
    
    failureRate.add(!isResponseOK)

    logger(fullUrl, response, 'POST', 'LOGIN', false)

    let body
    try{
        body = JSON.parse(response.body).data
    }catch(ex){
        isResponseOK =  check(response, {
            // random status which always returns false so it logs always
            "login failed!!" : r => r.status == 8765 
        })
        failureRate.add(!isResponseOK)
    }

    return body
}

//logout
export function logout(baseUrl, uid, username, jwt){
    let fullUrl = logoutEndPointUrl(baseUrl, uid, username)

    let params = {
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      };

    let response = http.del(fullUrl, null, params)
    logoutTrend.add(response.timings.duration)

    let isResponseOK = check(response, {
        "logout response status 200: " : r => r.status == 200
    })
    failureRate.add(!isResponseOK)

    logger(fullUrl, response, 'DELETE', 'LOGOUT', false)

    let body

    //check whether the response returns valid data
    try{
        body = JSON.parse(response.body).transactionId
    }catch(ex){
        isResponseOK =  check(response, {
            // random status which always returns false so it logs always
            "logout failed!!" : r => r.status == 8765 
        })
        failureRate.add(!isResponseOK)
        body = null
    }

    return body
}


//getAllUsers
export function getAllUsers(baseUrl){
    let fullUrl = getAllUsersEndPointUrl(baseUrl)

    let response = http.get(fullUrl,setHeader())
    getAllUsersTrend.add(response.timings.duration)
    
    let isResponseOK = check(response, {
        "getAllUsers response status 200: " : r => r.status == 200
    })
    failureRate.add(!isResponseOK)

    logger(fullUrl, response, 'GET', 'GETALLUSERS', false)

    let body

    //check whether the response returns valid data
    try{
        body = JSON.parse(response.body).data
    }catch(ex){
        isResponseOK =  check(response, {
            // random status which always returns false so it logs always
            "login failed!!" : r => r.status == 8765 
        })
        failureRate.add(!isResponseOK)
        body = Null
    }

    return body
}


export function logger(url, response, type, name, logResponseBody){
    console.log(`VU=${__VU} ITER=${__ITER} | Method: ${type} | Name: ${name} | URL: ${url} | Status: ${response.status}${response.status > 399 || logResponseBody === true ? ` | Response: ${JSON.stringify(JSON.parse(response.body))}` : ''}`)
    try{
        // co-relation is a kind of unique id generated per rest call in a server sidet
        console.log(`VU=${__VU} ITER=${__ITER} : X-correlationID: ${JSON.stringify(JSON.parse(response.headers))[`x-Correlation-Id`]}`)
    } catch(ex){

    }
}

