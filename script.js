// Auto-generated by the postman-to-k6 converter

import "./libs/shim/core.js";
import "./libs/shim/urijs.js";

export let options = { maxRedirects: 4 };

const Request = Symbol.for("request");
postman[Symbol.for("initial")]({
  options,
  environment: {
    jwtToken: "",
    guid: "",
    springBootSecurityUrl: "http://localhost:8888/springbootsecurity",
    usernameSpringBoot: "user@gmail.com",
    passwordSpringBoot: "1234"
  }
});

export default function() {
  postman[Request]({
    name: "Login",
    id: "6fdcd0a9-a32a-4200-833f-a622c2c70e67",
    method: "POST",
    address: "{{springBootSecurityUrl}}/dispatcher/api/authentication",
    data:
      '{\n    "username": "{{usernameSpringBoot}}",\n    "password": {{passwordSpringBoot}}\n}',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    post(response) {
      pm.test("Status code is 200", function() {
        pm.response.to.have.status(200);
        var jsonData = pm.response.json();
        var jwtToken = jsonData.data.jwt;
        var guid = jsonData.data.uid;
        console.log("Jwt token: " + jwtToken);
        pm.environment.set("jwtToken", jwtToken);
        pm.environment.set("guid", guid);
      });
    }
  });

  postman[Request]({
    name: "Logout",
    id: "488f2a20-667a-4c26-988e-70528c5f22d1",
    method: "DELETE",
    address:
      "{{springBootSecurityUrl}}/dispatcher/api/authentication/{{guid}}?username=user@gmail.com",
    post(response) {
      pm.test("Status code is 200", function() {
        pm.response.to.have.status(200);
        var jsonData = pm.response.json();
        var response = jsonData.data;
        if (response === null) {
          console.log(
            "Removing the Authorization token from the global scope.."
          );
          pm.environment.set("jwtToken", "");
        }
      });
    },
    auth(config, Var) {
      config.headers.Authorization = `Bearer ${pm[Var]("jwtToken")}`;
    }
  });

  postman[Request]({
    name: "Get all users",
    id: "9e1e1cd9-9f91-4d7f-b663-692ef1c6ecb8",
    method: "GET",
    address: "{{springBootSecurityUrl}}/dispatcher/api/user/all"
  });
}
