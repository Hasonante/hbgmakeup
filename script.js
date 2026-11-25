/* 1. DATOS DE CONTACTO: cambia aquí enlaces o teléfono si lo necesitas */
const CONFIG = {
  whatsapp: '34662966970',
  instagram: 'https://www.instagram.com/hbgmakeup/',
  tiktok: 'https://www.tiktok.com/@hbgmakeup'
};

/* 2. MENSAJES QUE SE ESCRIBEN AUTOMÁTICAMENTE EN WHATSAPP */
const messages = {
  novia: 'Hola, me gustaría recibir el dosier de servicios para novias. La fecha de mi boda es: ',
  invitada: 'Hola, me gustaría recibir el dosier de servicios para invitadas y eventos. La fecha del evento es: ',
  general: 'Hola, me gustaría recibir información sobre tus servicios de maquillaje.'
};

function whatsappUrl(message) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

/* 3. ACTIVAR ENLACES DE WHATSAPP, INSTAGRAM Y TIKTOK */
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const message = messages[link.dataset.whatsapp] || messages.general;
  link.href = whatsappUrl(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

for (const name of ['instagram', 'tiktok']) {
  const link = document.getElementById(`${name}-link`);
  if (!link) continue;
  link.href = CONFIG[name];
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
}
const galleryLink = document.getElementById('instagram-gallery-link');
if (galleryLink) {
  galleryLink.href = CONFIG.instagram;
  galleryLink.target = '_blank';
  galleryLink.rel = 'noopener noreferrer';
}

/* 4. NAVEGACIÓN: enseñar solo el apartado seleccionado */
const panels = [...document.querySelectorAll('.panel')];
const navLinks = [...document.querySelectorAll('#navigation a[href^="#"]')];
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('navigation');
const previousArrow = document.getElementById('flechaAnterior');
const nextArrow = document.getElementById('flechaSiguiente');

function closeMenu() {
  if (!menu || !nav) return;
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menú');
  menu.textContent = '☰';
}

function showPanel(id, updateAddress = true) {
  const target = panels.find(panel => panel.id === id) || panels[0];
  panels.forEach(panel => {
    const active = panel === target;
    panel.classList.toggle('active', active);
    panel.setAttribute('aria-hidden', String(!active));
    if (active) panel.removeAttribute('inert');
    else panel.setAttribute('inert', '');
  });
  navLinks.forEach(link => {
    const active = link.hash === `#${target.id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (previousArrow) previousArrow.disabled = panels.indexOf(target) === 0;
  if (nextArrow) nextArrow.disabled = panels.indexOf(target) === panels.length - 1;
  window.scrollTo(0, 0);
  if (updateAddress && location.hash !== `#${target.id}`) {
    history.pushState(null, '', `#${target.id}`);
  }
  closeMenu();
}

navLinks.forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  showPanel(link.hash.slice(1));
}));
document.querySelectorAll('a.brand[href="#inicio"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showPanel('inicio');
  });
});

/* 5. MENÚ DESPLEGABLE EN MÓVILES */
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.textContent = open ? '×' : '☰';
  });
}

/* 6. FLECHAS PARA CAMBIAR DE APARTADO */
function moverSeccion(direccion) {
  const indice = panels.findIndex(panel => panel.classList.contains('active'));
  const nuevoIndice = indice + direccion;
  if (nuevoIndice >= 0 && nuevoIndice < panels.length) showPanel(panels[nuevoIndice].id);
}
previousArrow?.addEventListener('click', () => moverSeccion(-1));
nextArrow?.addEventListener('click', () => moverSeccion(1));
window.addEventListener('popstate', () => showPanel(location.hash.slice(1) || 'inicio', false));
showPanel(location.hash.slice(1) || 'inicio', false);

/* 7. AÑO AUTOMÁTICO EN EL PIE DE PÁGINA */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* 8. CONFIRMACIÓN AL VOLVER DEL FORMULARIO */
const returnUrl = new URL(window.location.href);
if (returnUrl.hash === '#contacto' && returnUrl.searchParams.get('solicitud') === 'enviada') {
  const confirmation = document.getElementById('contact-success').content.cloneNode(true);
  const heading = confirmation.querySelector('h3');
  document.querySelector('.contact-form').replaceWith(confirmation);
  heading.focus();

  returnUrl.searchParams.delete('solicitud');
  history.replaceState(history.state, '', returnUrl);
}
