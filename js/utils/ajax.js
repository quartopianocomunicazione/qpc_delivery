import { delivery } from './global.js';
export function sendAjaxRequest(data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", delivery.ajax, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
      }
    };
    xhr.send(data);
  }
  