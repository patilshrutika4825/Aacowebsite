const supabaseUrl = 'https://qhqwwrfmxklsfvgazvdo.supabase.co';
const supabasePublishableKey = 'sb_publishable_mUv1uQBnGavICTwFUQ-Bow_2owPRGg2';

async function saveForm(table, values) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: supabasePublishableKey,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Submission failed. Please try again.');
  }
}

const toggle = document.querySelector('.menubtn');
const nav = document.querySelector('nav');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  toggle.textContent = open ? '×' : '☰';
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.textContent = '☰';
  nav.classList.remove('open');
}));

const contactForm = document.querySelector('.contactform');
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const button = contactForm.querySelector('button[type="submit"]');
  const output = contactForm.querySelector('.formstatus');
  button.disabled = true;
  output.textContent = 'Sending your enquiry…';
  try {
    await saveForm('contact_submissions', {
      name: contactForm.elements.name.value.trim(),
      email: contactForm.elements.email.value.trim(),
      service: contactForm.elements.service.value,
      message: contactForm.elements.message.value.trim() || null,
    });
    output.textContent = 'Thanks — your enquiry has been received. Our team will be in touch within one business day.';
    contactForm.reset();
  } catch (error) {
    output.textContent = `${error.message} You can also email hello@aarohan.co.in.`;
  } finally {
    button.disabled = false;
  }
});

const newsletter = document.querySelector('.newsletter');
newsletter.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!newsletter.reportValidity()) return;
  const button = newsletter.querySelector('button');
  const output = document.querySelector('.newsstatus');
  button.disabled = true;
  output.textContent = 'Subscribing…';
  try {
    await saveForm('newsletter_subscriptions', { email: newsletter.elements.email.value.trim() });
    output.textContent = 'Thanks for subscribing.';
    newsletter.reset();
  } catch (error) {
    if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
      output.textContent = 'You’re already subscribed. Thanks for staying in touch.';
    } else {
      output.textContent = `${error.message} Please try again.`;
    }
  } finally {
    button.disabled = false;
  }
});
