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
    console.log('Inside login()')

    let fullUrl = loginEndPointUrl(baseUrl)
    let data = {
        "username": `${username}`,
        "password": `${password}`
    }
    let response = http.post(fullUrl,data,setHeader())
    loginTrend.add(response.timings.duration)
    
    isResponseOK = check(response, {
        "login response status 200: " : r => r.status == 200
    })
    failureRate.add(!isResponseOK)

    logger(fullUrl, response)

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
export function logout(baseUrl, uid, jwt){
    console.log('Inside logout()')

    let fullUrl = logoutEndPointUrl(baseUrl, uid, jwt)
    let response = http.delete(fullUrl)
    logoutTrend.add(response.timings.duration)

    isResponseOK = check(response, {
        "logout response status 200: " : r => r.status == 200
    })
    failureRate.add(!isResponseOK)

    logger(fullUrl, response)

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
    console.log('Inside getAllUsers()')

    let fullUrl = getAllUsersEndPointUrl(baseUrl)
    let response = http.get(fullUrl,setHeader())
    getAllUsersTrend.add(response.timings.duration)
    
    isResponseOK = check(response, {
        "getAllUsers response status 200: " : r => r.status == 200
    })
    failureRate.add(!isResponseOK)

    logger(fullUrl)

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


export function logger(url, response){
    console.log(`VU=${__VU} ITER=${__ITER} : Logger started`)
    console.log(`VU=${__VU} ITER=${__ITER} : Endpoint is ${url}`)
    console.log(`VU=${__VU} ITER=${__ITER} : Response status is ${response.status}`)
    console.log(`VU=${__VU} ITER=${__ITER} : Response body is ${JSON.stringify(JSON.parse(response.body))}`)

    try{
        // co-relation is a kind of unique id generated per rest call in a server side
        console.log(`VU=${__VU} ITER=${__ITER} : Response body is ${JSON.stringify(JSON.parse(response.headers))[`x-Correlation-Id`]}`)
    } catch(ex){

    }
}

