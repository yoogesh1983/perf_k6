import { username, password } from '../data/Testdata.js'
import * as service from '../service/UserService.js'

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
