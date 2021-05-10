import {currentEnvironment, username, password, vus, duration, teardownTimeout} from '../data/Testdata.js'
import * as service from '../service/UserService.js'
import * as env from '../../env.js'

// 1. init()
let baseUrl;
if (currentEnvironment == env.prod) {
  baseUrl = env.prodBaseUrl.SERVER_ENDPOINT;
} else if (currentEnvironment == env.dev) {
  baseUrl = env.devBaseUrl.SERVER_ENDPOINT;
} else if (currentEnvironment == env.local) {
  baseUrl = env.localBaseUrl.SERVER_ENDPOINT;
}
export let options = {
    vus,
    duration,
    teardownTimeout, //this prevents teardown() function from going into infinite loop
}

// 2. setup()
export function setup(){
  console.log('setup called with CURRENT_ENVIRONMENT:', currentEnvironment)
}

// 3. default
export default function(){
  try{

    //login
    let r = service.login(baseUrl, username, password)

    //logout
    service.logout(baseUrl, r.uid, username, r.jwt)

    //getAllusers
    service.getAllUsers(baseUrl)

  } catch(ex){
    console.log(`Exception occured during the execution of testcases ${ex}`)
  }
}
