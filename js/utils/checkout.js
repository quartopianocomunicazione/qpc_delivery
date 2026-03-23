
import { delivery } from "./global.js";
import { sendAjaxRequest } from "./ajax.js";
import { getCookie } from "../handlers/cookies.js";

export function handlePaypalCheckout(responseText){
   var res = JSON.parse(responseText);
        if (res.redirect) {
            Cookies.set("delivery-session", '', { expires: 1 });
            document.querySelector("#delivery-checkout-error").innerHTML = "";
            document.querySelector("#delivery-checkout-ok").innerHTML = delivery.paypal_status;
            window.location.href = res.redirect;
        } else {
            document.querySelector("#loader").classList.add("hidden");
            document.querySelector("#delivery-checkout-error").innerHTML = delivery.error_status;
            document.querySelector("#delivery-checkout-ok").innerHTML = "";
        }
}

export function handleStripeCheckout(responseText){
    var obj = JSON.parse(responseText);
    if (obj.response) {
        var clientSecret = JSON.parse(obj.response).clientSecret;
        var error = JSON.parse(obj.response).error;
        if (error) {

          document.querySelector("#delivery-checkout-error").innerHTML = delivery.error;
          document.querySelector("#delivery-checkout-ok").innerHTML = "";
        } else {
          // console.dir(clientSecret);
          //getStripeKey();
          // // console.dir(delivery.stripeKey);

          stripeCheckoutInitialize(clientSecret);
        }
      } else {

        document.querySelector("#delivery-checkout-error").innerHTML = delivery.error_status;
        document.querySelector("delivery-checkout-ok").innerHTML = "";
      }


}
export function handleStripeKey(responseText){
    var res = JSON.parse(responseText);
    if (res.error) {
        document.querySelector("#delivery-login-error").innerHTML = res.error;
        return null;
    } else {
        delivery.stripe_key = res.response;
        // console.dir(delivery.stripeKey);
        const stripe = Stripe(res.response); // Replace with your key
    }
}

  async function stripeCheckoutInitialize(clientSecret) {
    try {
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
  
      // Monta il Checkout
      checkout.mount("#checkout");
  
      document.querySelector("#checkout iframe").setAttribute("scrolling", "yes");
      document.querySelector("#popup_stripe_checkout").classList.toggle("visible");
  
      document.querySelector("#popup_stripe_checkout .icon-close").addEventListener("click", () => {
        document.querySelector("#popup_stripe_checkout").classList.toggle("visible");
        checkout.unmount();
        checkout.destroy();
        document.querySelector("#loader").classList.add("hidden");
      });
    } catch (error) {
        document.querySelector("#loader").classList.add("hidden");
      console.error('Error initializing Stripe Checkout:', error);
    }
  }
  
 
export function getOrderById() {
  const orderId = document
    .querySelector("#delivery-order-completed")
    .getAttribute("delivery-order-completed");

  // Mostra il loader
  document.getElementById("loader").classList.remove("hidden");

  var data =
    "orderId=" +
    encodeURIComponent(orderId) +
    "&deliverySession=" +
    encodeURIComponent(getCookie("delivery-session")) +
    "&action=get_order";
  sendAjaxRequest(data, (response) => {
    const obj = JSON.parse(response);

    // Mostra l'elemento in base allo stato dell'ordine
    const orderElement = document.querySelector(
      `#delivery-order-${obj.status}`
    );
    if (orderElement) {
      orderElement.style.display = "block";
    }

    // Aggiorna i valori degli elementi
    Object.entries(obj).forEach(([key, value]) => {
      const valueElement = document.querySelector(
        `#delivery-order-${key}-value`
      );
      if (valueElement) {
        valueElement.innerHTML = value;
      }
    });


    document.querySelector("#loader").classList.add("hidden");
  });
}
