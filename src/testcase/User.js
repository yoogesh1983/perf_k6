import {currentEnvironment, username, password, vus, duration, teardownTimeout} from '../data/Testdata.js'
import * as service from '../service/UserService.js'
import * as env from '../../env.js'

// 1. init()
let baseUrl;
if (currentEnvironment == env.prod) {
  baseUrl = env.prodBaseUrl;
} else if (currentEnvironment == env.dev) {
  baseUrl = env.devBaseUrl;
} else if (currentEnvironment == env.local) {
  baseUrl = env.localBaseUrl;
}
export let options = {
    vus,
    duration,
    teardownTimeout, //this prevents teardown() function from going into infinite loop
}

// 2. setup()
export function setup(){
  console.log('setup called.....')
}

// 3. default
export default function(){
  try{

    //login and logout
    r = service.login(baseUrl, username, password)
    service.logout(baseUrl, r.uid, r.jwt)

    //getAllusers
    service.getAllUsers(baseUrl)

  } catch(ex){
    console.log(`Exception occured during the execution of testcases`)
  }
}
