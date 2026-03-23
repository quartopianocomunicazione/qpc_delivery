import { sendAjaxRequest } from "./utils/ajax.js";
import { getCookie, eraseCookie} from "./handlers/cookies.js";
import { handleRegisterResponse } from "./utils/register.js";
import {
  handlePasswordRecoveryResponse,
  handlePasswordChangeResponse,
} from "./utils/password.js";
import {
  getFormValidity,
  handleLoginResponse,
  toggleLoginFormVisibility,
  isLogged,
  getUserByToken

} from "./utils/login.js";
import { getCartCount, getCart } from "./utils/cartUtils.js";
import { handleCartButtonClick, handleRemoveFromCartResponse } from "./handlers/cart.js";
import { handlePaypalCheckout, handleStripeCheckout,handleStripeKey, getOrderById } from "./utils/checkout.js";
// Importare altre funzioni e gestori

document.addEventListener("DOMContentLoaded", () => {
  let logged = isLogged();

  if (logged) {
    getUserByToken();
  }
  
  toggleLoginFormVisibility(!(logged));


  getCartCount();

  // Verifica se l'elemento con id "delivery-cart" esiste
  // Se l'elemento esiste, chiama la funzione getCart()
  if (document.getElementById("delivery-cart") !== null) {
    getCart();
  }
  
  if (document.getElementById("delivery-order-completed")!== null) {
    getOrderById();
  }
});

// Event listeners

document.addEventListener("change", function (event) {
  if (event.target.classList.contains("delivery-add-to-cart")) {
    handleCartButtonClick(event);
  }
});
document.addEventListener("paste", function (event) {
  if (event.target.classList.contains("delivery-add-to-cart")) {
    handleCartButtonClick(event);
  }
});

document.addEventListener("click", function (event) {
  
  //  Aggiungi al carrello (cambia le quantità)
  if (event.target.classList.contains("delivery-add-to-cart")) {
    handleCartButtonClick(event);
  }

  // Rimuovi dal carrello
  if (event.target.classList.contains("delivery-remove-from-cart")) {
    console.dir("remove from cart");

    // Mostra il loader
    document.getElementById("loader").classList.remove("hidden");
    let productId = event.target.getAttribute("delivery-productId");
    if (event.target.getAttribute("delivery-attributeId") !== "") {
        productId = event.target.getAttribute("delivery-attributeId");
    }
    
    event.preventDefault();
    var data =
      "productId=" +
      encodeURIComponent(productId) +
      "&deliverySession=" +
      encodeURIComponent(getCookie("delivery-session")) +
      "&action=remove_from_cart";
      sendAjaxRequest(data, handleRemoveFromCartResponse);



    
  }


  //Login
  if (event.target.classList.contains("delivery-login")) {
    event.preventDefault();
    var form = event.target.closest("form");
    if (getFormValidity(form)) {
      event.preventDefault();
      var data =
        "email=" +
        encodeURIComponent(document.getElementById("email-login").value) +
        "&password=" +
        encodeURIComponent(document.getElementById("password-login").value) +
        "&deliverySession=" +
        encodeURIComponent(getCookie("delivery-session")) +
        "&action=login";
      sendAjaxRequest(data, handleLoginResponse);
    }
  }

  //Recupera pwd
  if (event.target.classList.contains("delivery-recover-password")) {
    var form = event.target.closest("form");
    if (getFormValidity(form)) {
      event.preventDefault();
      var data =
        "email=" +
        encodeURIComponent(document.getElementById("email-login").value) +
        "&deliverySession=" +
        encodeURIComponent(getCookie("delivery-session")) +
        "&action=recover_password";
      sendAjaxRequest(data, handlePasswordRecoveryResponse);
    }
  }

  //Cambia pwd
  if (event.target.classList.contains("delivery-change-password")) {
    var form = event.target.closest("form");
    if (getFormValidity(form)) {
      event.preventDefault();
      var data =
        "email=" +
        encodeURIComponent(document.getElementById("email").value) +
        "&password=" +
        encodeURIComponent(document.getElementById("password").value) +
        "&password_confirmation=" +
        encodeURIComponent(
          document.getElementById("password_confirmation").value) +
        "&token=" +
        encodeURIComponent(document.getElementById("token").value) +
        "&action=change_password";
      sendAjaxRequest(data, handlePasswordChangeResponse);
    }
  }

  //Logout
  if (event.target.id === "delivery-logout") {
    event.preventDefault();
    eraseCookie("delivery-token");
    eraseCookie("delivery-session");
    // Verifica se l'elemento con id "delivery-cart" esiste
    var deliveryCart = document.getElementById("delivery-cart");
  
    // Se l'elemento esiste, chiama la funzione getCart()
    if (deliveryCart !== null) {
      getCart();
    }
    getCartCount();
    if (document.getElementById("delivery-cart"))
      document.getElementById("delivery-cart").innerHTML = "";
    toggleLoginFormVisibility(true);
  }

  //Registrati  
  if (event.target.classList.contains("delivery-register")) {
    var form = event.target.closest("form");
    if (getFormValidity(form)) {
      event.preventDefault();
      var data =
        "email=" +
        encodeURIComponent(document.getElementById("email").value) +
        "&password=" +
        encodeURIComponent(document.getElementById("password").value) +
        "&first_name=" +
        encodeURIComponent(document.getElementById("first_name").value) +
        "&last_name=" +
        encodeURIComponent(document.getElementById("last_name").value) + 
        "&phone_number=" +
        encodeURIComponent(document.getElementById("phone_number").value) +
        "&deliverySession=" +
        encodeURIComponent(getCookie("delivery-session")) +
        "&action=register_user";
      sendAjaxRequest(data, handleRegisterResponse);
    }
  }

    if (event.target.classList.contains("delivery-checkout")) {
        if (getFormValidity(event.target)) {
            event.preventDefault();
            event.stopImmediatePropagation();

            const paymentMethod = event.target.id;
            var data =
            "first_name=" +
            encodeURIComponent(document.getElementById("voucher-first_name").value) +
            "&last_name=" +
            encodeURIComponent(document.getElementById("voucher-last_name").value) +
            "&email=" +
            encodeURIComponent(document.getElementById("voucher-email").value) +
            "&address=" +
            encodeURIComponent(document.getElementById("voucher-address").value) + 
            "&city=" +
            encodeURIComponent(document.getElementById("voucher-city").value) +
            "&country=" +
            encodeURIComponent(document.getElementById("voucher-country").value) +
            "&post_code=" +
            encodeURIComponent(document.getElementById("voucher-post_code").value) +
            "&phone_number=" +
            encodeURIComponent(document.getElementById("voucher-phone_number").value) +
            "&notes=" +
            encodeURIComponent(document.getElementById("voucher-notes").value) +
            "&api_token=" +
            encodeURIComponent(document.getElementById("voucher-api-token").value) +
            "&voucher_name=" +
            encodeURIComponent(document.getElementById("voucher-dest-name").value) +
            "&voucher_email=" +
            encodeURIComponent(document.getElementById("voucher-dest-email").value) +
            "&deliverySession=" +
            encodeURIComponent(getCookie("delivery-session")) +
            "&method=" +
            encodeURIComponent(paymentMethod) +
            "&action=checkout";
            console.dir(data);

            document.querySelector("#loader").classList.remove("hidden");

            if (paymentMethod == 'paypal'){
              sendAjaxRequest(data, handlePaypalCheckout);
            }
            if (paymentMethod == 'stripe'){
              var dataKey = "action=get_stripe_key";
              sendAjaxRequest(dataKey, handleStripeKey);
              sendAjaxRequest(data, handleStripeCheckout);
            }
            
        }
    }

});
