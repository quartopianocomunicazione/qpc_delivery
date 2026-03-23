
import { setCookie, getCookie } from './cookies.js';
import { getCartCount, getCart } from '../utils/cartUtils.js';
import { sendAjaxRequest } from '../utils/ajax.js';

export function handleRemoveFromCartResponse(responseText){
  console.dir("handleRemoveFromCartResponse "+ responseText);
  // Aggiorna il conteggio del carrello
  getCartCount();
  
    document.getElementById("delivery-cart").innerHTML = "";
    
  getCart();
  // Nascondi il loader
  document.getElementById("loader").classList.add("hidden");
}

export function handleCartButtonClick(event) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    event.preventDefault();
    event.stopImmediatePropagation();
  
    let qty;
    if (event.target.tagName.toLowerCase() === "input") {
      qty = parseInt(event.target.value) - parseInt(event.target.getAttribute("delivery-qty"));
    } else {
      qty = parseInt(event.target.getAttribute("delivery-qty"));
    }
  
    let attributePrice = 0;
    let attributeValue = event.target.getAttribute("delivery-attributeValue") || "";
    if (event.target.hasAttribute("delivery-attributePrice")) {
      attributePrice = event.target.getAttribute("delivery-attributePrice");
    }
    let attributeId = event.target.getAttribute("delivery-attributeId") || "";
    let attributeTheId = event.target.getAttribute("delivery-attributeTheId") || "";
  
    if (qty !== 0) {
      const data = new URLSearchParams({
        price: event.target.getAttribute("delivery-price"),
        attributePrice: attributePrice,
        productId: event.target.getAttribute("delivery-productId"),
        qty: qty,
        calice: attributeValue,
        attributeId: attributeId,
        attributeTheId: attributeTheId,
        deliverySession: getCookie("delivery-session"),
        action: "add_to_cart"
      });
  
      // Mostra il loader
      document.getElementById("loader").classList.remove("hidden");
  
      sendAjaxRequest(data.toString(), (res) => {
        Cookies.set("delivery-session", res, { expires: 36000 });
        getCartCount();
  
        if (document.getElementById("delivery-cart")) {
          document.getElementById("delivery-cart").innerHTML = "";
          getCart();
        }
  
        // Nascondi il loader
        document.getElementById("loader").classList.add("hidden");
      }, () => {
        console.error("errore add to cart");
        // Nascondi il loader in caso di errore
        document.getElementById("loader").classList.add("hidden");
      });
    }
  }