
import { fillVoucherForm } from '../handlers/formValidation.js'; 
import { setCookie, getCookie } from '../handlers/cookies.js';
import { delivery } from './global.js';
import { sendAjaxRequest } from "./ajax.js";


export function getFormValidity(submit_button) {
    // Trova il form genitore dell'elemento submit_button
    var form = submit_button.closest("form");
  
    if (!form) {
      console.error("Il pulsante submit non è contenuto in un form.");
      return false;
    }
  
    // Ottieni tutti gli elementi del form
    var form_elements = form.elements;
  
    // Verifica se form_elements è definito e ha una lunghezza maggiore di zero
    if (!form_elements || form_elements.length === 0) {
      console.error("Il form non contiene elementi validi.");
      return false;
    }
    
    // Inizializza la variabile di ritorno
    var isValid = true;
  
    // Itera attraverso gli elementi del form
    for (var i = 0; i < form_elements.length; i++) {
      var form_element = form_elements[i];
  
      // Verifica la validità solo per gli elementi <input>
      if (form_element.tagName.toLowerCase() === "input" && !form_element.checkValidity()) {
        isValid = false;
        break; // Esci dal ciclo se trovi un input non valido
      }
    }
  
    return isValid;
  }
  
  

export function handleLoginResponse(responseText) {
    var obj = JSON.parse(responseText);
    if (obj.error) {
      document.getElementById("delivery-login-error").innerHTML = obj.error;
    } else {
      fillVoucherForm(obj);
      setCookie("delivery-token", obj.api_token, 36000);
      document.getElementById("delivery-login-error").innerHTML = "";
      document.getElementById("delivery-user-ok").innerHTML = delivery.login_ok_status;
      toggleLoginFormVisibility(false);
      document.querySelector(".delivery-logout").style.display = "block";

    }
  }
  
  export function toggleLoginFormVisibility(show) {
    if (document.getElementById("delivery-login-forms")){
      document.getElementById("delivery-login-forms").style.display = show ? "block" : "none";
    }
    if (document.getElementById("delivery-voucher-form")){
      document.getElementById("delivery-voucher-form").style.display = show ? "none" : "block";
    }
    if (document.querySelector(".delivery-logout")){
      document.querySelector(".delivery-logout").style.display = show ? "none" : "block";
    }

  }
  export function isLogged(){
    return getCookie("delivery-token") ? true : false;
  }

  export function getUserByToken(){
    if (document.getElementById("delivery-login-forms")){


    var data =
    
        "&deliveryToken=" +
        encodeURIComponent(getCookie("delivery-token")) +
        "&action=get_user";
        
      sendAjaxRequest(data, handleLoginResponse);
    }
  }
