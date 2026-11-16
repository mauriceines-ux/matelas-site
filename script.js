'use strict';

/* Polices Google chargées après l'affichage : si le réseau les bloque, le site s'affiche quand même (polices système) */
(() => {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;500;700&display=swap';
  document.head.appendChild(l);
})();

/* ---------- Outils ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

/* Photos des produits : dossier img/. Chaque produit pointe vers un numéro (champ pic). */
const PICS = Array.from({ length: 13 }, (_, i) => `img/photo-${String(i + 1).padStart(2, '0')}.jpg`);
const pic = i => PICS[i];
const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="675"><rect width="100%" height="100%" fill="#dde6f8"/></svg>');
document.addEventListener('error', e => {
  const t = e.target;
  if (t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = 1; t.src = FALLBACK; }
}, true);

/* ---------- Données produits ---------- */
const PRODUCTS = [
  { id: 'nano-spire', name: 'Nano Spire Signature', tech: 'Hybride', firm: 'Équilibré', price: 1290, old: 1790, pic: 7, feat: 1, badge: 'Le préféré des Français', desc: 'Ressorts ensachés Spire et mousse Nano : un soutien précis, zone par zone.' },
  { id: 'aeris', name: 'Aéris HR 35', tech: 'Mousse HR', firm: 'Ferme', price: 549, old: 799, pic: 3, feat: 1, badge: 'Spécial mal de dos', desc: 'Mousse haute résilience 35 kg/m³ pour un maintien ferme et durable.' },
  { id: 'nuage', name: 'Nuage Latex', tech: 'Latex', firm: 'Souple', price: 899, old: 1249, pic: 6, feat: 1, badge: 'Technologie latex', desc: 'Latex naturel ventilé : un accueil enveloppant et une nuit au frais.' },
  { id: 'orion', name: 'Orion Hybride', tech: 'Hybride', firm: 'Ferme', price: 1149, old: 1590, pic: 1, desc: 'Ressorts Spire renforcés et mousse Nano pour un dos parfaitement aligné.' },
  { id: 'oceane', name: 'Océane Confort', tech: 'Mousse HR', firm: 'Souple', price: 479, old: 699, pic: 2, desc: 'Un accueil moelleux en mousse HR, idéal pour dormir sur le côté.' },
  { id: 'zenith', name: 'Zénith Latex', tech: 'Latex', firm: 'Équilibré', price: 990, old: 1390, pic: 10, desc: 'Latex à sept zones de confort : soutien équilibré et grande élasticité.' },
  { id: 'harmonie', name: 'Harmonie 3 zones', tech: 'Mousse HR', firm: 'Équilibré', price: 629, old: 899, pic: 8, desc: 'Trois zones de soutien en mousse HR pour un confort polyvalent.' },
  { id: 'sommier-tap', name: 'Sommier Tapissier Pro', tech: 'Sommier', firm: 'Ferme', price: 249, old: 349, pic: 5, desc: 'Structure en hêtre massif et lattes renforcées, pieds inclus.' },
  { id: 'sommier-relax', name: 'Sommier Relax électrique', tech: 'Sommier', firm: 'Équilibré', price: 790, old: 1090, pic: 0, desc: 'Tête et pieds relevables par télécommande, moteur silencieux.' },
  { id: 'oreiller-memoire', name: 'Oreiller ergonomique mémoire', tech: 'Accessoire', firm: 'Équilibré', price: 79, old: 109, pic: 12, acc: 1, desc: 'Mousse à mémoire de forme et housse respirante : nuque alignée.' },
  { id: 'oreiller-latex', name: 'Oreiller Latex ventilé', tech: 'Accessoire', firm: 'Ferme', price: 69, old: 95, pic: 12, acc: 1, desc: 'Latex naturel perforé, soutien ferme et fraîcheur toute la nuit.' },
  { id: 'couette', name: 'Couette 4 saisons', tech: 'Accessoire', firm: 'Souple', price: 139, old: 199, pic: 11, acc: 1, desc: 'Deux couettes qui se clipsent : légère l’été, chaude l’hiver.' },
  { id: 'protege', name: 'Protège-matelas respirant', tech: 'Accessoire', firm: 'Souple', price: 59, old: 79, pic: 9, acc: 1, desc: 'Imperméable et silencieux, lavable à 60 °C. Prolonge la vie du matelas.' }
];
const RATE = [[4.9, 612], [4.8, 348], [4.7, 191], [4.8, 164], [4.6, 207], [4.7, 133], [4.6, 98], [4.7, 76], [4.8, 52], [4.7, 120], [4.6, 64], [4.8, 143], [4.7, 88]];
PRODUCTS.forEach((p, i) => { [p.rate, p.rn] = RATE[i] || [4.7, 40]; });
const stars = n => '<span class="stars" aria-label="' + n + ' sur 5">' + '★'.repeat(Math.round(n)) + '<s>' + '★'.repeat(5 - Math.round(n)) + '</s></span>';
const COMP = {
  'Hybride': ['Housse coton lavable à 40 °C', 'Mousse Nano 3 cm', 'Ressorts ensachés Spire, 7 zones', 'Mousse HR de soutien', 'Base ventilée'],
  'Mousse HR': ['Housse stretch déhoussable', 'Mousse confort 3 cm', 'Mousse HR 35 kg/m³, 3 zones', 'Base antidérapante'],
  'Latex': ['Housse coton bio', 'Latex naturel perforé 7 zones', 'Âme de soutien en mousse HR', 'Base ventilée'],
  'Sommier': ['Structure en hêtre massif', 'Lattes renforcées', 'Pieds inclus'],
  'Accessoire': ['Housse en coton', 'Garnissage certifié OEKO-TEX', 'Lavable en machine']
};
const price = (p, s) => p.price + (p.acc ? 0 : SIZES[s]);
const oldp = (p, s) => p.old + (p.acc ? 0 : SIZES[s]);
const defSize = id => prod(id).acc ? 'Standard' : f.size;
const SIZES = { '90 × 190': -150, '140 × 190': 0, '160 × 200': 150, '180 × 200': 250, 'Standard': 0 };
const MSIZES = Object.keys(SIZES).filter(s => s !== 'Standard');
const prod = id => PRODUCTS.find(p => p.id === id);

const f = { firm: 'Tous', tech: 'Tous', size: '140 × 190' };

function card(p, i = 0) {
  return `<article class="card" style="animation-delay:${i * 70}ms">
    <div class="card-img"><img src="${pic(p.pic)}" alt="${p.name}" loading="lazy">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
    <div class="card-body">
      <div class="tags"><span>${p.tech}</span><span>${p.firm}</span></div>
      <h3>${p.name}</h3><div class="rt">${stars(p.rate)} <small>${p.rate.toString().replace('.', ',')} (${p.rn})</small></div><p>${p.desc}</p>
      <div class="price"><strong>${eur(price(p, f.size))}</strong><del>${eur(oldp(p, f.size))}</del><em>-${Math.round((1 - p.price / p.old) * 100)} %</em></div>
      <button class="btn btn-primary" data-view="${p.id}">Voir le produit</button>
    </div></article>`;
}

/* ---------- Accueil ---------- */
$('#featured').innerHTML = PRODUCTS.filter(p => p.feat).map(card).join('');

/* ---------- Catalogue et filtres ---------- */
const FILTERS = { firm: ['Tous', 'Ferme', 'Équilibré', 'Souple'], tech: ['Tous', 'Mousse HR', 'Latex', 'Hybride', 'Sommier', 'Accessoire'], size: MSIZES };
const LABELS = { firm: 'Soutien', tech: 'Technologie', size: 'Taille' };

$('#filters').innerHTML = Object.keys(FILTERS).map(g =>
  `<div class="frow"><b>${LABELS[g]}</b>${FILTERS[g].map(v => `<button class="chip" data-g="${g}" data-v="${v}">${v}</button>`).join('')}</div>`
).join('');

function renderCatalogue() {
  $$('#filters .chip').forEach(c => c.classList.toggle('on', f[c.dataset.g] === c.dataset.v));
  const list = PRODUCTS.filter(p =>
    (f.firm === 'Tous' || p.firm === f.firm) &&
    (f.tech === 'Tous' ? !['Sommier', 'Accessoire'].includes(p.tech) : p.tech === f.tech));
  $('#count').textContent = `${list.length} produit${list.length > 1 ? 's' : ''} · prix en ${f.size} cm`;
  $('#featured').innerHTML = PRODUCTS.filter(p => p.feat).map(card).join('');
  $('#grid').innerHTML = list.map(card).join('') ||
    '<p class="empty">Aucun produit ne correspond. Essayez un autre soutien ou une autre technologie.</p>';
}

/* ---------- Fiche produit ---------- */
function openProduct(id) {
  const p = prod(id);
  $('#modal').innerHTML = `<div class="modal-in">
    <img src="${pic(p.pic)}" alt="${p.name}">
    <div class="modal-txt">
      <div class="tags"><span>${p.tech}</span><span>${p.firm}</span></div>
      <h2>${p.name}</h2>
      <div class="rt">${stars(p.rate)} <small>${p.rate.toString().replace('.', ',')} · ${p.rn} avis</small></div>
      <p>${p.desc} Fabrication française, garantie 10 ans${p.acc ? '' : ', 100 nuits d’essai'}.</p>
      <ul class="comp">${COMP[p.tech].map(c => `<li>${c}</li>`).join('')}</ul>
      ${p.acc ? '<input type="hidden" id="size" value="Standard">' : `<label>Dimensions<select id="size">${MSIZES.map(s => `<option value="${s}"${s === f.size ? ' selected' : ''}>${s} cm – ${eur(price(p, s))}</option>`).join('')}</select></label>`}
      <div class="price"><strong id="mPrice">${eur(price(p, f.size))}</strong><del id="mOld">${eur(oldp(p, f.size))}</del></div>
      <p class="mini">Livraison estimée sous 5 à 10 jours · paiement en 3x sans frais</p>
      <button class="btn btn-primary" data-add="${p.id}">Ajouter au panier</button>
    </div>
    <button class="icon-btn x" id="mClose" aria-label="Fermer">✕</button></div>`;
  $('#modal').showModal();
}

/* ---------- Panier ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('bl-cart')) || []; } catch (e) { cart = []; }
cart = cart.filter(i => prod(i.id) && i.size in SIZES);
let promo = false;
try { promo = localStorage.getItem('bl-promo') === '1'; } catch (e) {}
const unit = i => price(prod(i.id), i.size);

function renderCart() {
  const n = cart.reduce((s, i) => s + i.qty, 0);
  $('#cartCount').textContent = n;
  $('#cartCount').hidden = !n;
  $('#cartItems').innerHTML = cart.length ? cart.map((i, k) => {
    const p = prod(i.id);
    return `<div class="line"><img src="${pic(p.pic)}" alt="">
      <div><b>${p.name}</b><small>${i.size} cm</small>
        <div class="qty"><button data-q="${k}" data-d="-1" aria-label="Moins">−</button><span>${i.qty}</span><button data-q="${k}" data-d="1" aria-label="Plus">+</button></div></div>
      <div class="line-r"><b>${eur(unit(i) * i.qty)}</b><button data-rm="${k}" aria-label="Retirer">Retirer</button></div></div>`;
  }).join('') : '<p class="empty">Votre panier est vide. Parcourez nos matelas pour commencer.</p>';
  updateTotals();
  try { localStorage.setItem('bl-cart', JSON.stringify(cart)); } catch (e) {}
}

function updateTotals() {
  const sub = cart.reduce((s, i) => s + unit(i) * i.qty, 0), disc = promo ? Math.round(sub * .15) : 0, net = sub - disc;
  const ship = !cart.length || net >= 500 ? 0 : 49, tot = net + ship;
  $('#cartSub').textContent = eur(sub);
  $('#discRow').hidden = !disc;
  $('#cartDisc').textContent = '−' + eur(disc);
  $('#cartShip').textContent = cart.length ? (ship ? eur(ship) : 'Offerte') : '—';
  $('#cartTotal').textContent = eur(tot);
  $('#ship').innerHTML = cart.length ? (net >= 500 ? 'Livraison offerte ✓' : `Plus que <b>${eur(500 - net)}</b> pour la livraison offerte`) + `<i style="width:${Math.min(100, net / 5)}%"></i>` : '';
  $('#fin').textContent = tot >= 300 ? `ou 3 × ${eur(Math.ceil(tot / 3))} sans frais` : '';
  try { localStorage.setItem('bl-promo', promo ? '1' : '0'); } catch (e) {}
}

function addToCart(id, size) {
  const found = cart.find(i => i.id === id && i.size === size);
  found ? found.qty++ : cart.push({ id, size, qty: 1 });
  renderCart();
  toast('Ajouté au panier');
}

function toggleCart(open) {
  $('#cart').classList.toggle('open', open);
  $('#overlay').classList.toggle('show', open);
  $('#cart').setAttribute('aria-hidden', !open);
}

let tt;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- Quiz ---------- */
const QUIZ = [
  { k: 'pos', q: 'Quelle est votre position de sommeil ?', o: [['dos', 'Sur le dos'], ['cote', 'Sur le côté'], ['ventre', 'Sur le ventre'], ['mixte', 'Je change souvent']] },
  { k: 'feel', q: 'Préférez-vous un accueil moelleux ou ferme ?', o: [['0', 'Moelleux et enveloppant'], ['1', 'Équilibré'], ['2', 'Ferme et tonique']] },
  { k: 'dos', q: 'Avez-vous mal au dos ?', o: [['oui', 'Oui, régulièrement'], ['parfois', 'Parfois, au réveil'], ['non', 'Non, pas du tout']] }
];
const WHY = {
  'Hybride': 'Les ressorts ensachés soulagent les zones dorsales tout en gardant un accueil confortable.',
  'Latex': 'Le latex épouse les épaules et le bassin : aucun point de pression, même sur le côté.',
  'Mousse HR': 'La mousse HR offre un soutien régulier et durable, avec un excellent rapport qualité-prix.'
};
let qs = 0, ans = {};

function swap() {
  const b = $('#quizBox');
  b.classList.remove('swap');
  void b.offsetWidth;
  b.classList.add('swap');
}

function renderQuiz() {
  if (qs >= QUIZ.length) return showResult();
  const Q = QUIZ[qs];
  $('#quizBox').innerHTML = `<div class="progress"><i style="width:${qs / QUIZ.length * 100}%"></i></div>
    <p class="step">Question ${qs + 1} sur ${QUIZ.length}</p>
    <h2>${Q.q}</h2>
    <div class="opts">${Q.o.map(([v, l]) => `<button class="opt" data-k="${Q.k}" data-v="${v}">${l}</button>`).join('')}</div>
    ${qs ? '<button class="link" id="qBack">← Question précédente</button>' : ''}`;
  swap();
}

function showResult() {
  $('#quizBox').innerHTML = '<div class="loader"><span></span><p>Analyse de votre profil de sommeil…</p></div>';
  swap();
  setTimeout(() => {
    const score = +ans.feel + { cote: -.5, ventre: .5, dos: 0, mixte: 0 }[ans.pos] + { oui: .75, parfois: .25, non: 0 }[ans.dos];
    const firm = ['Souple', 'Équilibré', 'Ferme'][Math.min(2, Math.max(0, Math.round(score)))];
    const pref = ans.dos === 'oui' ? 'Hybride' : ans.pos === 'cote' ? 'Latex' : 'Mousse HR';
    const pool = PRODUCTS.filter(p => p.tech !== 'Sommier' && p.firm === firm);
    const p = pool.find(x => x.tech === pref) || pool[0];
    $('#quizBox').innerHTML = `<div class="result">
      <img src="${pic(p.pic)}" alt="${p.name}">
      <div>
        <span class="match">Compatibilité ${p.tech === pref ? 97 : 92} %</span>
        <h2>${p.name}</h2>
        <p>Soutien ${firm.toLowerCase()} recommandé. ${WHY[p.tech]}</p>
        <div class="price"><strong>${eur(price(p, f.size))}</strong><del>${eur(oldp(p, f.size))}</del></div>
        <div class="actions">
          <button class="btn btn-primary" data-add="${p.id}">Ajouter au panier</button>
          <button class="btn btn-line" data-view="${p.id}">Voir le produit</button>
        </div>
        <button class="link" id="qRestart">Refaire le test</button>
      </div></div>`;
    swap();
  }, 1400);
}

/* ---------- Navigation (routage par #hash) ---------- */
const VIEWS = ['accueil', 'catalogue', 'technologies', 'quiz', 'contact'];
const TITLES = { catalogue: ['Nos matelas', 'Filtrez par soutien, technologie et taille pour affiner votre sélection.'], sommiers: ['Nos sommiers', 'Tapissiers ou relevables, pour un support adapté à votre matelas.'], accessoires: ['Nos accessoires', 'Oreillers ergonomiques, couettes et protège-matelas pour compléter votre literie.'] };
let page = location.hash.slice(1) || 'accueil';
function go(h) {
  page = h || 'accueil';
  try { history.replaceState(null, '', '#' + page); } catch (e) {}
  route();
}
function route() {
  const cur = page;
  let v = cur;
  if (['catalogue', 'sommiers', 'accessoires'].includes(cur)) {
    f.firm = 'Tous';
    f.tech = { sommiers: 'Sommier', accessoires: 'Accessoire' }[cur] || 'Tous';
    v = 'catalogue';
    [$('#catTitle').textContent, $('#catSub').textContent] = TITLES[cur];
    renderCatalogue();
  }
  if (!VIEWS.includes(v)) v = 'accueil';
  $$('.view').forEach(s => s.classList.toggle('active', s.id === v));
  $$('#nav a').forEach(a => a.classList.toggle('active', a.hash === '#' + cur));
  $('#nav').classList.remove('open');
  $('#burger').setAttribute('aria-expanded', 'false');
  scrollTo({ top: 0, behavior: 'instant' });
}
addEventListener('hashchange', () => go(location.hash.slice(1)));

/* ---------- Événements ---------- */
document.addEventListener('click', e => {
  const c = s => e.target.closest(s);
  let el;
  if ((el = c('a[href^="#"]'))) { e.preventDefault(); return go(el.getAttribute('href').slice(1)); }
  if (e.target.id === 'modal') return e.target.close();
  if ((el = c('#filters .chip'))) { f[el.dataset.g] = el.dataset.v; return renderCatalogue(); }
  if ((el = c('[data-simn]'))) { SIM.n = +el.dataset.simn; return renderSim(); }
  if ((el = c('[data-read]'))) return toast('Article de démonstration : contenu à venir');
  if ((el = c('[data-view]'))) return openProduct(el.dataset.view);
  if ((el = c('[data-add]'))) {
    const size = c('#modal') ? $('#size').value : el.dataset.size || defSize(el.dataset.add);
    addToCart(el.dataset.add, size);
    return $('#modal').open && $('#modal').close();
  }
  if (c('#mClose')) return $('#modal').close();
  if ((el = c('.opt'))) { ans[el.dataset.k] = el.dataset.v; qs++; return renderQuiz(); }
  if (c('#qBack')) { qs--; return renderQuiz(); }
  if (c('#qRestart')) { qs = 0; ans = {}; return renderQuiz(); }
  if ((el = c('[data-q]'))) {
    const k = +el.dataset.q;
    cart[k].qty += +el.dataset.d;
    if (cart[k].qty < 1) cart.splice(k, 1);
    return renderCart();
  }
  if ((el = c('[data-rm]'))) { cart.splice(+el.dataset.rm, 1); return renderCart(); }
  if (c('#cartBtn')) return toggleCart(true);
  if (c('#cartClose') || e.target.id === 'overlay') return toggleCart(false);
  if (c('#checkout')) {
    if (!cart.length) return toast('Votre panier est vide');
    cart = []; promo = false; renderCart(); toggleCart(false);
    return toast('Merci ! Commande simulée avec succès');
  }
  if (c('#burger')) {
    const open = $('#nav').classList.toggle('open');
    $('#burger').setAttribute('aria-expanded', open);
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'size') {
    const p = prod($('#modal [data-add]').dataset.add);
    $('#mPrice').textContent = eur(price(p, e.target.value));
    $('#mOld').textContent = eur(oldp(p, e.target.value));
  }
  if (e.target.id === 'simM') { SIM.m = e.target.value; renderSim(); }
  if (e.target.id === 'simS') { SIM.s = e.target.value; renderSim(); }
});
$('#promoForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#promoIn').value.trim().toUpperCase(), ok = ['BULTEX15', 'SOMNIA15'].includes(v);
  promo = ok;
  $('#promoMsg').textContent = ok ? 'Code appliqué : −15 % sur votre panier.' : 'Code invalide. Essayez BULTEX15.';
  $('#promoMsg').className = 'pmsg ' + (ok ? 'ok' : 'ko');
  updateTotals();
});
$('#newsForm').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Merci ! Votre code BULTEX15 est en route.'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleCart(false); });
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  e.target.reset();
  toast('Message envoyé. Nous vous répondons sous 24 h.');
});

/* ---------- Simulateur de budget ---------- */
const SIM = { m: 'nano-spire', s: '160 × 200', n: 3 };
function renderSim() {
  const p = prod(SIM.m), pr = price(p, SIM.s), op = oldp(p, SIM.s);
  const mens = SIM.n === 1 ? pr : Math.ceil(pr / SIM.n);
  $('#sim').innerHTML = `<div class="sim-in">
    <label>Modèle<select id="simM">${PRODUCTS.filter(x => !x.acc && x.tech !== 'Sommier').map(x => `<option value="${x.id}"${x.id === SIM.m ? ' selected' : ''}>${x.name}</option>`).join('')}</select></label>
    <label>Taille<select id="simS">${MSIZES.map(s => `<option${s === SIM.s ? ' selected' : ''}>${s}</option>`).join('')}</select></label>
    <div><span class="lbl">Paiement</span><div class="pay">${[1, 3, 4].map(n => `<button type="button" class="chip${n === SIM.n ? ' on' : ''}" data-simn="${n}">${n === 1 ? 'Comptant' : n + ' fois'}</button>`).join('')}</div></div>
  </div>
  <div class="sim-out">
    <div><small>${SIM.n === 1 ? 'À payer aujourd’hui' : 'Par mois, sans frais'}</small><b>${eur(mens)}</b><span>${SIM.n === 1 ? 'paiement unique' : SIM.n + ' mensualités'}</span></div>
    <div><small>Économie vs prix conseillé</small><b>${eur(op - pr)}</b><span>-${Math.round((1 - pr / op) * 100)} %</span></div>
    <div><small>Coût par nuit sur 10 ans</small><b>${(pr / 3650).toFixed(2).replace('.', ',')} €</b><span>garantie 10 ans</span></div>
    <button class="btn btn-primary" data-add="${p.id}" data-size="${SIM.s}">Ajouter au panier</button>
  </div>`;
}

/* ---------- Avis clients ---------- */
const REVIEWS = [
  ['Claire L.', 'Lyon', 5, 'Fini les réveils à 4 h du matin', 'Après trois semaines d’adaptation, mon dos va beaucoup mieux. Le soutien est précis, sans être dur.', 'Nano Spire Signature'],
  ['Julien M.', 'Nantes', 5, 'On ne sent plus l’autre bouger', 'L’indépendance de couchage est bluffante. Ma compagne se lève tôt, je n’entends plus rien.', 'Orion Hybride'],
  ['Sophie D.', 'Bordeaux', 4, 'Très confortable, livraison un peu longue', 'Le matelas est parfait pour dormir sur le côté. J’ai attendu 9 jours, mais l’équipe m’a tenue informée.', 'Nuage Latex'],
  ['Karim B.', 'Lille', 5, 'Excellent rapport qualité-prix', 'Premier achat en ligne d’un matelas, rassuré par l’essai de 100 nuits. Je le garde sans hésiter.', 'Aéris HR 35'],
  ['Hélène P.', 'Toulouse', 5, 'Fraîcheur toute la nuit', 'Je transpirais beaucoup. Avec le latex ventilé, c’est une autre histoire, même en été.', 'Zénith Latex'],
  ['Thomas R.', 'Strasbourg', 4, 'Soutien ferme comme je l’aime', 'Un peu ferme les premières nuits, puis le corps s’habitue. Bonne finition et housse lavable.', 'Aéris HR 35']
];
$('#reviews').innerHTML = REVIEWS.map(([n, v, s, t, m, pr]) => `<article class="review">${stars(s)}<h3>${t}</h3><p>${m}</p><footer><b>${n}</b>, ${v}<small>Acheteur vérifié · ${pr}</small></footer></article>`).join('');
$('#rsum').innerHTML = `<div class="big"><b>4,8</b>${stars(5)}<small>1 240 avis vérifiés</small></div><div class="bars">${[[5, 84], [4, 12], [3, 3], [2, 1], [1, 0]].map(([n, w]) => `<div><span>${n} ★</span><i><u style="width:${w}%"></u></i><em>${w} %</em></div>`).join('')}</div><p class="rec"><b>96 %</b> des clients recommandent nos matelas à leurs proches.</p>`;

/* ---------- Strates de confort ---------- */
const STRATA = [
  ['Housse coton', '#f4f7ff', 'Déhoussable et lavable, elle garde le matelas sain.'],
  ['Mousse Nano', '#9ab0e8', 'S’adapte à la chaleur et à la pression du corps.'],
  ['Ressorts Spire', '#5f7fd3', 'Ressorts ensachés indépendants, sept zones de confort.'],
  ['Mousse HR de soutien', '#2a3f86', 'Stabilise l’ensemble et évite l’affaissement.'],
  ['Base ventilée', '#0b1b3d', 'Antidérapante, elle laisse circuler l’air.']
];
$('#strSvg').innerHTML = STRATA.map(([n, c], i) => `<g class="lay" data-i="${i}" tabindex="0"><rect x="20" y="${28 + i * 50}" width="320" height="${i === 2 ? 56 : 42}" rx="12" fill="${c}"/>${i === 2 ? Array.from({ length: 9 }, (_, k) => `<rect x="${42 + k * 34}" y="${48 + i * 50 - 6}" width="10" height="34" rx="5" fill="#fff" opacity=".45"/>`).join('') : ''}<title>${n}</title></g>`).join('');
$('#strList').innerHTML = STRATA.map(([n, c, d], i) => `<li data-i="${i}"><i style="background:${c}"></i><div><b>${n}</b><span>${d}</span></div></li>`).join('');
const hiLay = i => { $$('#strList li').forEach(l => l.classList.toggle('on', l.dataset.i == i)); $$('.lay').forEach(l => l.classList.toggle('dim', i !== null && l.dataset.i != i)); };
$$('.lay').forEach(l => { l.onmouseenter = l.onfocus = () => hiLay(l.dataset.i); l.onmouseleave = l.onblur = () => hiLay(null); });
$$('#strList li').forEach(l => { l.onmouseenter = () => hiLay(l.dataset.i); l.onmouseleave = () => hiLay(null); });

/* ---------- Blog ---------- */
$('#blog').innerHTML = [
  ['Conseils', '4 min', 'Comment choisir la fermeté de son matelas ?', 'Position de sommeil, poids, préférences : les trois critères à croiser avant d’acheter.'],
  ['Entretien', '3 min', 'Quand changer de matelas ?', 'Entre 8 et 10 ans en moyenne. Les signes qui montrent qu’il est temps de le remplacer.'],
  ['Bien-être', '5 min', 'Dormir au frais pendant les fortes chaleurs', 'Matières respirantes, ventilation, literie : nos conseils pour garder des nuits réparatrices.']
].map(([t, m, h, p]) => `<article class="post"><span>${t} · ${m}</span><h3>${h}</h3><p>${p}</p><button class="link" data-read>Lire l’article →</button></article>`).join('');

/* ---------- Démarrage ---------- */
renderSim();
renderCart();
renderQuiz();
route();
renderCatalogue();
