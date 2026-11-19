// Responsibility: form validation, loading/success/error states, double-submit prevention.
// Actual submission must go through a backend/API — never embed secrets here.
//
// <form data-form data-endpoint="…" data-fallback-email="…">
// - data-endpoint set   → POST JSON to it (fetch), success / error states.
// - no endpoint (yet)   → open the visitor's mail app with a pre-filled message
//   to data-fallback-email: an honest fallback that really works, never a fake
//   "sent" state.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MESSAGES = {
  valueMissing: "Ce champ est obligatoire.",
  typeMismatch: "Saisissez une adresse e-mail valide (ex. nom@societe.com).",
};

function fieldError(field) {
  const value = field.value.trim();
  if (field.required && !value) return MESSAGES.valueMissing;
  if (field.type === "email" && value && !EMAIL_RE.test(value)) return MESSAGES.typeMismatch;
  return "";
}

function showError(form, field, message) {
  const slot = form.querySelector(`[data-error-for="${field.name}"]`);
  if (slot) slot.textContent = message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

function playSent(panel) {
  panel.classList.remove("is-played");
  void panel.offsetWidth;
  panel.classList.add("is-played");
  if (!reduceMotion) panel.querySelectorAll("animateMotion").forEach((a) => a.beginElement?.());
}

document.querySelectorAll("form[data-form]").forEach((form) => {
  const fields = Array.from(form.querySelectorAll("input, textarea")).filter((f) => f.name);
  const submit = form.querySelector("[data-submit]");
  const errorBox = form.querySelector("[data-form-error]");
  const success = form.parentElement.querySelector("[data-form-success]");
  let sending = false;

  // Validate on blur, then live once a field has been flagged.
  fields.forEach((field) => {
    field.addEventListener("blur", () => showError(form, field, fieldError(field)));
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) showError(form, field, fieldError(field));
    });
  });

  // Character counter for the message.
  form.querySelectorAll("[data-count-for]").forEach((counter) => {
    const field = form.querySelector(`[name="${counter.dataset.countFor}"]`);
    const max = field?.maxLength > 0 ? field.maxLength : null;
    const update = () => { counter.textContent = max ? `${field.value.length} / ${max}` : ""; };
    field?.addEventListener("input", update);
    update();
  });

  const setLoading = (on) => {
    sending = on;
    submit.disabled = on;
    submit.classList.toggle("is-loading", on);
    submit.setAttribute("aria-busy", String(on));
  };

  const showSuccess = (title, text) => {
    if (!success) return;
    if (title) success.querySelector("[data-success-title]").textContent = title;
    if (text) success.querySelector("[data-success-text]").textContent = text;
    form.hidden = true;
    success.hidden = false;
    success.focus();
    playSent(success);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    errorBox.hidden = true;

    const invalid = fields.filter((field) => {
      const message = fieldError(field);
      showError(form, field, message);
      return Boolean(message);
    });
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(fields.map((f) => [f.name, f.value.trim()]));
    const endpoint = form.dataset.endpoint;
    setLoading(true);

    if (!endpoint) {
      // No backend yet: hand over to the visitor's mail app.
      const to = form.dataset.fallbackEmail;
      const subject = `Demande de contact — ${data.company}`;
      const body = `${data.message || ""}\n\n—\n${data.name}\n${data.company}\n${data.email}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setLoading(false);
      showSuccess(
        "Votre message est prêt",
        `Votre messagerie s'ouvre avec votre message adressé à ${to} : il ne reste qu'à l'envoyer.`
      );
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(String(response.status));
      setLoading(false);
      showSuccess();
    } catch {
      setLoading(false);
      errorBox.textContent = `L'envoi n'a pas abouti. Réessayez dans un instant ou écrivez-nous directement à ${form.dataset.fallbackEmail}.`;
      errorBox.hidden = false;
    }
  });

  success?.querySelector("[data-form-reset]")?.addEventListener("click", () => {
    form.reset();
    fields.forEach((field) => showError(form, field, ""));
    form.querySelectorAll("[data-count-for]").forEach((c) => c.dispatchEvent(new Event("input")));
    success.hidden = true;
    success.classList.remove("is-played");
    form.hidden = false;
    fields[0]?.focus();
  });
});
