import { delivery } from "./global.js";
import { setCookie, getCookie } from "../handlers/cookies.js";
import { sendAjaxRequest } from "./ajax.js";

// Utility functions
function currencyFormat(num) {
  return (
    num
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      .replace(".", ",") + " €"
  );
}

export function getCartCount() {
  const deliverySession = getCookie("delivery-session");
  const data = new URLSearchParams({
    deliverySession,
    action: "getCart",
  });

  sendAjaxRequest(
    data.toString(),
    (res) => {
      const tot = countCartItems(res);
      document.getElementById("delivery-cart-count").innerHTML = tot;
      const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
      addToCartButtons.forEach((btn) => {
        if (tot === 0) btn.style.display = "none";
        else btn.style.display = "block";
      });
    },
    () => {
      console.error("errore get cart");
    }
  );
}

function countCartItems(res) {
  let total = 0;

  if (res) {
    const obj = JSON.parse(res);

    if (obj){
    // Iterazione sugli oggetti usando Object.keys
      Object.keys(obj).forEach((key) => {
        const val = obj[key];
        total += parseInt(val.quantity);
      });
    }
  }

  return total;
}

export function getCart() {
  const deliverySession = getCookie("delivery-session");
  const data = new URLSearchParams({
    deliverySession,
    action: "getCart",
  });

  // Mostra il loader
  document.getElementById("loader").classList.remove("hidden");

  sendAjaxRequest(
    data.toString(),
    (res) => {
      let obj = [];
      console.dir(res);
      if (res !== "" && res !== "null") {
        
        obj = JSON.parse(res);
        let subtotal = 0;
        let rowTotal = 0;
        let rowProduct = "";
        let html = "";

        if (!document.getElementById("row-head")) {
          html = `
          <div class='grid'>
            <div class='row head' id='row-head'>
              <div class='col-6'>${delivery.gift_label}</div>
              <div class='col-3'>${delivery.persons_label}</div>
              <div class='col-3 alignRight'>${delivery.total_label}</div>
            </div>
          </div>`;
          document
            .getElementById("delivery-cart")
            .insertAdjacentHTML("beforeend", html);
        }

        Object.values(obj).forEach(function (val) {
          let attributeValue = "";
          let attributeId = "";
          let attributeTheId = "";
          if (!document.getElementById(`row-${val.id}`)) {
            rowTotal = val.quantity * val.price;
            rowProduct = val.name;
            if (val.attributes.attributeId !== undefined) {
              rowProduct +=
                " + " +
                val.attributes.label.replace(/\\'/g, "'").replace(/\\/g, "");
              attributeValue = val.attributes.label.replace(/'/g, "&#39;");
              attributeId = val.attributes.attributeId;
              attributeTheId = val.attributes.attributeTheId;
            }
            html = `
            <div class='row' id='row-${val.id}'>
              <div class='col-6'>
                <a href=''>${rowProduct}</a>
                <a href='#' class='no-barba delivery-cart-button delivery-remove-from-cart'><span class='icon-qpc-delivery-06  delivery-remove-from-cart' delivery-attributeId='${attributeId}'  delivery-productId='${
              val.attributes.productId
            }'></span></a>
              </div>
              <div class='col-3'>
                <a href='#' class='no-barba delivery-cart-button delivery-add-to-cart' delivery-attributeValue='${attributeValue}' delivery-attributeId='${attributeId}' delivery-attributeTheId='${attributeTheId}' delivery-price='${
              val.price
            }' delivery-productId='${
              val.attributes.productId
            }' delivery-qty='-1'>-</a>
                <input type='text' class='delivery-add-to-cart' delivery-price='${
                  val.price
                }' delivery-productId='${
              val.attributes.productId
            }' delivery-qty='${val.quantity}' value='${
              val.quantity
            }' delivery-attributeValue='${attributeValue}' delivery-attributeId='${attributeId}' delivery-attributeTheId='${attributeTheId}' />
                <a href='#' class='no-barba delivery-cart-button delivery-add-to-cart' delivery-attributeValue='${attributeValue}' delivery-attributeId='${attributeId}' delivery-attributeTheId='${attributeTheId}' delivery-price='${
              val.price
            }' delivery-productId='${
              val.attributes.productId
            }' delivery-qty='1'>+</a>
              </div>
              <div class='col-3 alignRight boldFont'>${currencyFormat(
                rowTotal
              )}</div>
            </div>`;
            document
              .getElementById("delivery-cart")
              .insertAdjacentHTML("beforeend", html);
            subtotal += rowTotal;
          }
        });

        if (!document.getElementById("row-total")) {
          html = `
          <div class='row' id='row-total'>
            <div class='col-3'></div>
            <div class='col-3'></div>
            <div class='col-6 alignRight'>${
              delivery.subtotal_label
            } ${currencyFormat(subtotal)}</div>
          </div>`;
          document
            .getElementById("delivery-cart")
            .insertAdjacentHTML("beforeend", html);
        }
      }

      // Nascondi il loader
      document.getElementById("loader").classList.add("hidden");
    },
    () => {
      console.error("errore get cart");
    }
  );

}
