// This static educational mockup intentionally has no account, credential,
// KYC/document, wallet, payment, or financial-data functionality.
(function () {
  const notice = document.createElement("aside");
  notice.className = "demo-banner";
  notice.setAttribute("role", "note");
  notice.textContent = "EDUCATIONAL MOCKUP ONLY — no accounts, identity checks, wallets, funds, financial services, or returns. Do not enter sensitive information.";

  function showNotice() {
    if (!document.querySelector(".demo-banner")) document.body.prepend(notice);
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        window.alert("Forms are disabled in this educational mockup. No data was submitted.");
      });
    });
    document.querySelectorAll('input[type="password"], input[type="file"]').forEach((input) => {
      input.disabled = true;
      input.removeAttribute("required");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showNotice, { once: true });
  } else {
    showNotice();
  }
})();
