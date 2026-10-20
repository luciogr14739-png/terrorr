const stories = {
  dama: {
    title: "La dama del camino",
    body: `<p>La carretera atravesaba un bosque tan viejo que las ramas parecían dedos intentando arañar el cielo. Cada noche, a la misma hora, una mujer vestida de blanco aparecía junto al camino.</p><p>Una madrugada, Tomás frenó al verla. La mujer abrió la puerta sin decir una palabra y señaló el asiento trasero. Él miró por el espejo: estaba vacío. Cuando volvió la vista al frente, ella ya estaba sentada a su lado.</p><p>—No mires atrás —susurró—. Ya vienen por mí.</p><p>Tomás aceleró. Al llegar al pueblo, la mujer había desaparecido. En el asiento encontró una fotografía antigua: la misma mujer, junto a una lápida con la fecha de esa noche.</p>`
  },
  tumba: {
    title: "La tumba vacía",
    body: `<p>El cuidador del cementerio llevaba treinta años contando las tumbas antes de cerrar la reja. Era una costumbre absurda, pero le daba tranquilidad: ciento doce lápidas, siempre ciento doce.</p><p>Una noche contó ciento trece. La nueva tumba estaba abierta y la tierra fresca tenía marcas de dedos desde adentro. Sobre la lápida alguien había escrito su nombre completo.</p><p>Corrió hacia la salida, pero la reja estaba cerrada con llave. Detrás de él, la tierra empezó a caer dentro del agujero, como si alguien estuviera saliendo.</p><p>Al amanecer, el pueblo encontró la reja abierta. El cuidador no apareció. Desde entonces, los visitantes aseguran ver a un hombre contando lápidas… y siempre se detiene en ciento trece.</p>`
  },
  tren: {
    title: "El último tren",
    body: `<p>La estación llevaba cuarenta años abandonada, pero los vecinos seguían oyendo un tren a las 00:13. No había vías conectadas con el pueblo. Solo un silbido largo y luces que atravesaban la niebla.</p><p>Clara esperó una noche con una linterna y un reloj. A las 00:13 exactas, un tren negro apareció sin hacer ruido. Las puertas se abrieron y un revisor de rostro pálido le ofreció la mano.</p><p>—¿Adónde va? —preguntó ella.</p><p>—A donde terminan los viajes —respondió él.</p><p>Clara dio un paso atrás. En la ventanilla vio a decenas de pasajeros mirándola. Todos tenían su rostro. El tren partió vacío, pero desde aquella noche el reloj de la estación quedó detenido a las 00:13.</p>`
  }
};

const facts = [
  { icon: "🎃", title: "La calabaza iluminada", text: "La tradición de tallar faroles se relaciona con antiguas costumbres irlandesas. Al emigrar, muchas comunidades adaptaron la tradición usando calabazas, más fáciles de conseguir en Norteamérica." },
  { icon: "🦇", title: "Los murciélagos nocturnos", text: "Los murciélagos son mamíferos y muchas especies se orientan mediante ecolocalización: emiten sonidos y escuchan el eco para detectar obstáculos y presas." },
  { icon: "🕯️", title: "Una noche entre estaciones", text: "Halloween se celebra el 31 de octubre. Su nombre se vincula con “All Hallows’ Eve”, la víspera del Día de Todos los Santos." },
  { icon: "👻", title: "¿Por qué usamos disfraces?", text: "Una explicación histórica relaciona los disfraces con antiguas costumbres de cubrirse o disfrazarse durante festividades vinculadas al cambio de estación y a los espíritus." }
];

const fortunes = [
  "Una oportunidad inesperada aparecerá cuando menos la esperes.",
  "No todo lo que parece oscuro es una amenaza; a veces es una puerta.",
  "La respuesta que buscas está más cerca de lo que imaginas.",
  "Esta noche, escucha con atención: una idea pequeña puede cambiarlo todo.",
  "Ten valor para dar el primer paso. El resto se revelará en el camino.",
  "Un misterio se resolverá cuando dejes de perseguirlo.",
  "La suerte favorece a quien se prepara… incluso en la oscuridad.",
  "Cuidado con tus calcetines: un fantasma podría estar robándolos."
];

const $ = (selector) => document.querySelector(selector);
const nav = $("#mainNav");
const menuToggle = $("#menuToggle");
const modal = $("#storyModal");
let factIndex = 0;
let lastFortune = -1;
let audioContext = null;
let soundOn = false;
let toastTimer;

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openStory(key) {
  const story = stories[key];
  if (!story) return;
  $("#modalTitle").textContent = story.title;
  $("#modalBody").innerHTML = story.body;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $("#modalClose").focus();
}
function closeStory() {
  modal.hidden = true;
  document.body.style.overflow = "";
}
document.querySelectorAll(".read-story").forEach(button => {
  button.addEventListener("click", () => openStory(button.dataset.story));
});
$("#modalClose").addEventListener("click", closeStory);
$("#modalDone").addEventListener("click", closeStory);
modal.querySelector(".modal-backdrop").addEventListener("click", closeStory);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) closeStory();
});

function renderFact() {
  const fact = facts[factIndex];
  $("#factIndex").textContent = `DATO ${String(factIndex + 1).padStart(2, "0")} / ${String(facts.length).padStart(2, "0")}`;
  $("#factIcon").textContent = fact.icon;
  $("#factTitle").textContent = fact.title;
  $("#factText").textContent = fact.text;
  $("#factProgress").style.width = `${((factIndex + 1) / facts.length) * 100}%`;
}
$("#factButton").addEventListener("click", () => {
  factIndex = (factIndex + 1) % facts.length;
  renderFact();
});

$("#oracleButton").addEventListener("click", () => {
  let next;
  do { next = Math.floor(Math.random() * fortunes.length); } while (next === lastFortune && fortunes.length > 1);
  lastFortune = next;
  const answer = $("#oracleAnswer");
  answer.textContent = "La niebla está hablando…";
  answer.style.opacity = ".45";
  setTimeout(() => {
    answer.textContent = `“${fortunes[next]}”`;
    answer.style.opacity = "1";
  }, 650);
  if (soundOn) playTone(220, .18);
});

$("#scareButton").addEventListener("click", () => {
  const scare = $("#jumpscare");
  scare.classList.add("active");
  scare.setAttribute("aria-hidden", "false");
  if (soundOn) playTone(90, .45);
  setTimeout(() => {
    scare.classList.remove("active");
    scare.setAttribute("aria-hidden", "true");
  }, 1150);
});

function playTone(frequency = 180, duration = .2) {
  if (!soundOn) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(35, frequency * .55), audioContext.currentTime + duration);
    gain.gain.setValueAtTime(.045, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    showToast("El audio no está disponible en este navegador.");
  }
}
$("#soundToggle").addEventListener("click", async () => {
  soundOn = !soundOn;
  $("#soundToggle").textContent = soundOn ? "♫ Sonido: encendido" : "♫ Sonido: apagado";
  $("#soundToggle").setAttribute("aria-pressed", String(soundOn));
  if (soundOn) {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") await audioContext.resume();
      playTone(160, .22);
      showToast("Sonido ambiental activado.");
    } catch (error) {
      soundOn = false;
      showToast("Tu navegador no permite reproducir audio.");
    }
  } else {
    showToast("Sonido desactivado.");
  }
});

// Bats are drawn with canvas so they work without extra image files.
const canvas = $("#bats");
const ctx = canvas.getContext("2d");
let batWidth = 0, batHeight = 0;
const bats = Array.from({ length: 13 }, (_, i) => ({
  x: Math.random() * window.innerWidth,
  y: 40 + Math.random() * window.innerHeight * .7,
  speed: .25 + Math.random() * .65,
  size: 5 + Math.random() * 9,
  phase: Math.random() * Math.PI * 2,
  alpha: .25 + Math.random() * .55,
  offset: i * .2
}));
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  batWidth = window.innerWidth;
  batHeight = window.innerHeight;
  canvas.width = batWidth * ratio;
  canvas.height = batHeight * ratio;
  canvas.style.width = `${batWidth}px`;
  canvas.style.height = `${batHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function drawBat(bat, time) {
  const flap = Math.sin(time * .006 + bat.phase) * .7;
  ctx.save();
  ctx.translate(bat.x, bat.y);
  ctx.scale(bat.size / 10, bat.size / 10);
  ctx.globalAlpha = bat.alpha;
  ctx.fillStyle = "#b8c9a8";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-5, -8 - flap * 5, -15, -7 - flap * 5);
  ctx.lineTo(-12, 1);
  ctx.lineTo(-20, -2 - flap * 5);
  ctx.lineTo(-16, 8);
  ctx.quadraticCurveTo(-7, 7, 0, 3);
  ctx.quadraticCurveTo(7, 7, 16, 8);
  ctx.lineTo(20, -2 - flap * 5);
  ctx.lineTo(12, 1);
  ctx.lineTo(15, -7 - flap * 5);
  ctx.quadraticCurveTo(5, -8 - flap * 5, 0, 0);
  ctx.fill();
  ctx.restore();
}
let animationFrame;
function animateBats(time) {
  ctx.clearRect(0, 0, batWidth, batHeight);
  bats.forEach(bat => {
    bat.x += bat.speed;
    bat.y += Math.sin(time * .001 + bat.phase) * .18;
    if (bat.x > batWidth + 30) { bat.x = -30; bat.y = 40 + Math.random() * batHeight * .7; }
    drawBat(bat, time);
  });
  animationFrame = requestAnimationFrame(animateBats);
}
resizeCanvas();
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) animateBats(0);
window.addEventListener("resize", resizeCanvas);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelAnimationFrame(animationFrame);
  else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) animateBats(0);
});

renderFact();
