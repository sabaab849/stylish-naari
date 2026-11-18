/* Stylissh Naari — contact form (prototype)
   Validates in the browser with accessible errors. It only says a message was sent when a submission service
   actually accepted it: the form posts JSON to data-endpoint (set store.support.formEndpoint in products.json).
   With no endpoint configured it says plainly that nothing was sent. In the Shopify build, replace this with
   the theme's {% form 'contact' %}, which keeps the same field names. */
(function () {
  'use strict';

  var form = document.querySelector('[data-contact-form]');
  if (!form) return;
  var status = form.querySelector('[data-contact-status]');
  var submit = form.querySelector('[data-contact-submit]');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (v) { return v ? '' : 'Enter your full name.'; },
    email: function (v) { return !v ? 'Enter your email address.' : emailPattern.test(v) ? '' : 'Enter an email address like name@example.com.'; },
    order: function () { return ''; },
    topic: function (v) { return v ? '' : 'Choose what your enquiry is about.'; },
    message: function (v) { return !v ? 'Write your message.' : v.length < 10 ? 'Add a little more detail so we can help (at least 10 characters).' : ''; },
  };

  function check(input) {
    var rule = rules[input.name];
    if (!rule) return '';
    var message = rule(input.value.trim());
    var field = input.closest('[data-field]');
    var error = field.querySelector('[data-error]');
    field.classList.toggle('is-invalid', !!message);
    if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    error.textContent = message;
    error.hidden = !message;
    return message;
  }

  var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
  inputs.forEach(function (input) {
    // Errors appear on submit or when leaving a field; once shown, they clear as soon as the value is fixed
    input.addEventListener('blur', function () { if (input.value.trim() || input.hasAttribute('aria-invalid')) check(input); });
    input.addEventListener('input', function () { if (input.hasAttribute('aria-invalid')) check(input); });
    input.addEventListener('change', function () { if (input.hasAttribute('aria-invalid')) check(input); });
  });

  function show(kind, title, text) {
    status.className = 'contact-form__status' + (kind === 'error' ? ' is-error' : '');
    status.innerHTML = '<strong></strong><span></span>';
    status.querySelector('strong').textContent = title;
    status.querySelector('span').textContent = text;
    status.hidden = false;
    status.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    inputs.forEach(function (input) { if (check(input) && !firstBad) firstBad = input; });
    if (firstBad) { status.hidden = true; firstBad.focus(); return; }

    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) {
      // No submission service yet: never pretend the message went anywhere
      show('error', 'Your message has not been sent.', 'The contact form is not connected yet. Please email us instead, and keep a copy of your message.');
      return;
    }

    var payload = {};
    inputs.forEach(function (input) { payload[input.name] = input.value.trim(); });
    submit.disabled = true; submit.setAttribute('aria-busy', 'true'); submit.textContent = 'Sending…';
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        show('ok', 'Thank you, your message has been sent.', 'We will reply to ' + payload.email + ' as soon as we can.');
      })
      .catch(function () {
        show('error', 'Your message could not be sent.', 'Please try again in a moment, or email us directly.');
      })
      .then(function () { submit.disabled = false; submit.removeAttribute('aria-busy'); submit.textContent = 'Send message'; });
  });
})();
