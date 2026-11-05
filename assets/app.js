// Public static demo only: no credentials, personal records, KYC data, or balances are stored.
(function () {
  const notice = document.createElement("aside");
  notice.className = "demo-banner";
  notice.setAttribute("role", "note");
  notice.textContent = "SIMULATED EDUCATIONAL DEMO — no real accounts, identity verification, wallets, funds, transactions, or returns. Never enter sensitive information.";

  function addNotice() {
    if (!document.querySelector(".demo-banner")) {
      document.body.prepend(notice);
    }

    // Defense in depth: prevent legacy forms from collecting or submitting data.
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        window.alert("Forms are disabled on this simulated demo. No data was submitted.");
      }, { once: true });
    });

    document.querySelectorAll('input[type="password"], input[type="file"]').forEach((input) => {
      input.disabled = true;
      input.removeAttribute("required");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addNotice, { once: true });
  } else {
    addNotice();
  }
})();
