// Quita la clase no-js para activar animaciones si hay JS
document.body.classList.remove('no-js');

// Año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// Modo oscuro/claro (persistente)
const root = document.documentElement;
const THEME_KEY = 'novasuite-theme';
function setTheme(mode){
  if(mode === 'light'){ root.classList.add('light'); }
  else{ root.classList.remove('light'); }
  localStorage.setItem(THEME_KEY, mode);
}
const saved = localStorage.getItem(THEME_KEY);
if(saved){ setTheme(saved); }
document.getElementById('themeToggle').addEventListener('click', ()=>{
  const isLight = root.classList.toggle('light');
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
});

// Menú móvil
const toggleBtn = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');
if(toggleBtn){
  toggleBtn.addEventListener('click', ()=>{
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.gap = '8px';
    toggleBtn.setAttribute('aria-expanded', String(!open));
  });
  // Cerrar al hacer click en un enlace
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    if(window.innerWidth < 720){ links.style.display = 'none'; toggleBtn.setAttribute('aria-expanded','false'); }
  }));
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, {threshold: 0.18});
revealEls.forEach(el=> io.observe(el));

// Carrusel simple
document.querySelectorAll('.carousel').forEach(carousel=>{
  const track = carousel.querySelector('.carousel__track');
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  let index = 0;
  const slideCount = track.children.length;

  function goTo(i){
    index = (i + slideCount) % slideCount;
    const offset = track.children[index].offsetLeft;
    track.scrollTo({left: offset, behavior: 'smooth'});
  }

  if(prev && next){
    prev.addEventListener('click', ()=> goTo(index - 1));
    next.addEventListener('click', ()=> goTo(index + 1));
  }

  // autoplay opcional
  const autoplay = carousel.dataset.autoplay === 'true';
  const interval = Number(carousel.dataset.interval || 5000);
  if(autoplay){
    setInterval(()=> goTo(index + 1), interval);
  }
});

// Formulario (demo)
const form = document.querySelector('form');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg = form.querySelector('.form__msg');
    // Validación simple
    const required = ['nombre','email','mensaje'];
    const data = Object.fromEntries(new FormData(form));
    const missing = required.filter(k => !data[k] || String(data[k]).trim()==='');
    if(missing.length){
      msg.textContent = 'Por favor completa los campos requeridos.';
      msg.style.color = 'var(--danger)';
      return;
    }
    // Simular envío
    msg.textContent = '¡Mensaje enviado! Te contactaremos en breve.';
    msg.style.color = 'var(--success)';
    form.reset();
  });
}


// FAQ open/close visual cue
document.querySelectorAll('.faq__item').forEach(d=>{
  d.addEventListener('toggle', ()=> d.classList.toggle('is-open', d.open));
});
