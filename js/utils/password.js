
  
  export function handlePasswordRecoveryResponse(responseText) {
    var obj = JSON.parse(responseText);
    if (obj.message === null) {
      document.getElementById("delivery-recover-ok").innerHTML = delivery.recover_ok_status;
      document.getElementById("delivery-recover-error").innerHTML = "";
    } else {
      document.getElementById("delivery-recover-ok").innerHTML = "";
      document.getElementById("delivery-recover-error").innerHTML = obj.message;
    }
  }
  
  export function handlePasswordChangeResponse(responseText) {
    var obj = JSON.parse(responseText);
    var error;
    if (obj.errors) {
      error = obj.message + "<br/>";
      obj.errors.forEach(function(val) {
        val.forEach(function(val2) {
          error += val2 + "<br/>";
        });
      });
      document.getElementById("delivery-change-ok").innerHTML = "";
      document.getElementById("delivery-change-error").innerHTML = error;
    } else {
      document.getElementById("delivery-change-error").innerHTML = "";
      document.getElementById("delivery-change-ok").innerHTML = obj.message;
    }
  }
  