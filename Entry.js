import * as env from './env.js'
import {currentEnvironment, vus, duration, teardownTimeout} from './src/data/Testdata.js'
import * as user from './src/testcase/User.js'

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
    user.default()
}

// 2. setup()
export function teardown(){
  console.log('teardown called with CURRENT_ENVIRONMENT:', currentEnvironment)
}
