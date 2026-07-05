// משמר המקדש — סקריפט משותף לכל העמודים

document.addEventListener('DOMContentLoaded', function () {

  // סימון קישור הניווט הפעיל לפי עמוד נוכחי
  var currentPage = document.body.getAttribute('data-page');
  document.querySelectorAll('nav.main a[data-page]').forEach(function (a) {
    if (a.getAttribute('data-page') === currentPage && !a.classList.contains('cta')) {
      a.classList.add('active');
    }
  });

  // תפריט נייד (המבורגר)
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.main');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // חשיפה עדינה באנימציה בעת גלילה
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // בחירת סכום תרומה
  document.querySelectorAll('.donate-amt').forEach(function (el) {
    el.addEventListener('click', function () {
      document.querySelectorAll('.donate-amt').forEach(function (e) { e.classList.remove('selected'); });
      el.classList.add('selected');
      var amtField = document.getElementById('mm-donate-amt-field');
      if (amtField) amtField.value = '₪' + el.getAttribute('data-amt');
    });
  });

  // סימון אשמורת הלילה הנוכחית (אם הרכיב קיים בעמוד)
  var cells = document.querySelectorAll('.ashmurot-cell');
  if (cells.length === 3) {
    var hour = new Date().getHours();
    var idx = 1; // ברירת מחדל: אשמורת אמצעית
    if (hour >= 18 || hour < 2) idx = 0;
    else if (hour >= 2 && hour < 6) idx = 1;
    else idx = 2;
    cells.forEach(function (c, i) {
      if (i === idx) c.classList.add('is-active');
    });
  }
});

// שליחת טפסים דרך FormSubmit
var MM_EMAIL = 'sasona9584@gmail.com';

function mmSubmitForm(evt, formId, statusId, subject) {
  evt.preventDefault();
  var form = document.getElementById(formId);
  var statusEl = document.getElementById(statusId);
  var submitBtn = form.querySelector('button[type="submit"]');
  var data = new FormData(form);
  data.append('_subject', subject);
  data.append('_captcha', 'false');
  data.append('_template', 'table');

  statusEl.style.color = 'var(--stone)';
  statusEl.textContent = 'שולח...';
  submitBtn.disabled = true;

  fetch('https://formsubmit.co/ajax/' + MM_EMAIL, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: data
  })
    .then(function (res) { return res.json(); })
    .then(function () {
      statusEl.style.color = '#2E6B3E';
      statusEl.textContent = 'הפרטים נשלחו בהצלחה! ניצור איתכם קשר בקרוב.';
      form.reset();
      submitBtn.disabled = false;
    })
    .catch(function () {
      statusEl.style.color = '#9B3B2C';
      statusEl.textContent = 'אירעה שגיאה בשליחה. נסו שוב או צרו קשר טלפונית.';
      submitBtn.disabled = false;
    });

  return false;
}
