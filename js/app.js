
(() => {
  const modal = document.getElementById("contactModal");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");
  const form = document.getElementById("contactForm");
  const submitButton = document.getElementById("contactSubmitButton");
  const status = document.getElementById("contactStatus");

  const WEB3FORMS_URL = "https://api.web3forms.com/submit";

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    document.getElementById("contactName").focus();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    status.textContent = "";
  };

  document.querySelectorAll('.contact-btn').forEach(item => {
    item.addEventListener('click', e => openModal())
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    status.textContent = "";

    try {
      const formData = new FormData(form);
      const botCheck = formData.get("botcheck").value;
      if (botCheck && botCheck.trim() !== "") {
        console.warn("Spam submission blocked.");
        return;
      }

      const response = await fetch(WEB3FORMS_URL, {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to send message."
        );
      }

      form.reset();

      status.textContent = "Message sent successfully.";

      setTimeout(() => {
        closeModal();
      }, 500);

    } catch (error) {
      console.error(error);

      status.textContent =
        "There was a problem sending your message. Please try again or give us a call.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  });
})();
