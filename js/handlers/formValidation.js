
export function fillVoucherForm(data) {
    document.getElementById("voucher-first_name").value = data.first_name ?? '';
    document.getElementById("voucher-last_name").value = data.last_name ?? '';
    document.getElementById("voucher-email").value = data.email   ?? '';
    document.getElementById("voucher-address").value = data.address ?? '';
    document.getElementById("voucher-city").value = data.city ?? '';
    document.getElementById("voucher-country").value = data.country ?? '';
    document.getElementById("voucher-post_code").value = data.post_code ?? '';
    document.getElementById("voucher-phone_number").value = data.phone_number ?? '';
    document.getElementById("voucher-api-token").value = data.api_token ?? '';
  }
  