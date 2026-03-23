import { fillVoucherForm } from '../handlers/formValidation.js'; 
import { setCookie } from "../handlers/cookies.js";
import { toggleLoginFormVisibility } from "./login.js";
import { delivery } from "./global.js";


export function handleRegisterResponse(responseText) {
    var obj = JSON.parse(responseText);
    if (obj.api_token) {
      fillVoucherForm({
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,  
        password: document.getElementById("password").value,
        phone_number: document.getElementById("phone_number").value,
        deliverySession: Cookies.get("delivery-session"),

        api_token: obj.api_token
      });
      setCookie("delivery-token", obj.api_token, 36000);
      document.getElementById("delivery-register-error").innerHTML = "";
      toggleLoginFormVisibility(false);
      document.getElementById("delivery-user-ok").innerHTML = delivery.register_ok_status;
    } else {
      document.getElementById("delivery-register-error").innerHTML = obj.join("\n");
    }
  }