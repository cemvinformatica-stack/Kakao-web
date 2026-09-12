const products = [
  {id:"gran-cru", name:"Tableta Gran Cru 8-5%", meta:"Origen Único • Los Ríos", price:18, category:"tabletas", intensity:"alta", image:"assets/tableta-gran-cru.png", featured:true},
  {id:"bombones", name:"Bombones de Origen", meta:"Selección Exclusiva • Manabí & Esmeraldas", price:24, category:"bombones", intensity:"media", image:"assets/bombones-origen.png", featured:true},
  {id:"cacao-polvo", name:"Cacao en Polvo Ceremonial", meta:"Cacao Orgánico • Amazonía Ecuatoriana", price:32, category:"cacao", intensity:"alta", image:"assets/cacao-polvo.png", featured:true},
  {id:"sal-marina", name:"Tableta con Sal Marina", meta:"Cacao Orgánico • Manabí", price:22, category:"tabletas", intensity:"media", image:"assets/tableta-sal-marina.png", featured:false},
  {id:"nibs", name:"Nibs de Cacao Tostado", meta:"Grano Tostado • Los Ríos", price:16, category:"cacao", intensity:"alta", image:"assets/nibs-cacao.png", featured:false},
  {id:"degustacion", name:"Set de Degustación", meta:"Selección de Bombones • Varios", price:45, category:"bombones", intensity:"media", image:"assets/set-degustacion.png", featured:false}
];

let cart = JSON.parse(localStorage.getItem("kakao-cart") || "{}");

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

function money(value){ return `$${value.toFixed(2)}`; }

function productCard(product){
  return `
    <article class="product-card">
      <div class="product-image" data-product="${product.id}" role="link" tabindex="0" aria-label="Ver ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-meta">${product.meta}</p>
        <div class="product-price">${money(product.price)}</div>
        <button class="product-add" data-add="${product.id}">AÑADIR AL CARRITO</button>
      </div>
    </article>`;
}

function productDetails(product){
  const description = window.PRODUCT_DESCRIPTIONS?.[product.id] || `${product.name}. Producto de cacao ecuatoriano seleccionado por KAKAO.`;
  const tags = product.category;
  const category = product.category === "cacao" ? "Cacao en polvo" : product.category;
  return `<div class="product-detail-wrap">
    <button class="back-link" data-view="store">← VOLVER A LA TIENDA</button>
    <div class="product-detail">
      <div class="detail-image"><img src="${product.image}" alt="${product.name}"></div>
      <div class="detail-copy">
        <p class="eyebrow">${category}</p>
        <h1>${product.name}</h1>
        <div class="detail-price">${money(product.price)}</div>
        <p class="detail-desc">${description}</p>
        <button class="gold-button" data-add="${product.id}">AÑADIR AL CARRITO</button>
        <div class="detail-meta">
          <div><strong>ORIGEN</strong><span>${product.meta}</span></div>
          <div><strong>ETIQUETAS</strong><span>${tags}</span></div>
        </div>
      </div>
    </div>
  </div>`;
}

function openProduct(id){
  const product = products.find(item => item.id === id);
  if(!product) return;
  $("#product-detail-view").innerHTML = productDetails(product);
  goToView("product");
  history.replaceState(null, "", `#producto/${id}`);
}

function renderProducts(){
  $("#featured-grid").innerHTML = products.filter(p=>p.featured).map(productCard).join("");
  renderStore("all");
}

function renderStore(filter="all"){
  let list = products;
  if(["cacao","tabletas","bombones"].includes(filter)) list = products.filter(p=>p.category===filter);
  $("#store-grid").innerHTML = list.map(productCard).join("");
  $$(".filter-button").forEach(b=>b.classList.toggle("is-selected", b.dataset.filter===filter));
}

function saveCart(){
  localStorage.setItem("kakao-cart", JSON.stringify(cart));
}

function cartCount(){
  return Object.values(cart).reduce((sum,item)=>sum+item.qty,0);
}

function addToCart(id){
  const product = products.find(p=>p.id===id);
  if(!product) return;
  if(!cart[id]) cart[id] = {qty:0};
  cart[id].qty += 1;
  saveCart();
  renderCart();
  showToast(`${product.name} añadido al carrito`);
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function removeItem(id){
  delete cart[id];
  saveCart();
  renderCart();
}

function renderCart(){
  const ids = Object.keys(cart);
  $(".cart-count").textContent = cartCount();
  if(!ids.length){
    $("#cart-items").innerHTML = `<div class="empty-cart"><h3>Tu carrito está vacío</h3><p>Descubre nuestra colección y agrega tus favoritos.</p><button class="outline-button" data-view="store">EXPLORAR LA TIENDA</button></div>`;
    $("#cart-total").textContent = "$0.00";
    return;
  }
  let total = 0;
  $("#cart-items").innerHTML = ids.map(id=>{
    const p = products.find(x=>x.id===id);
    const qty = cart[id].qty;
    const line = p.price * qty;
    total += line;
    return `<div class="cart-row">
      <img src="${p.image}" alt="${p.name}">
      <div>
        <h3>${p.name}</h3>
        <p>${p.meta}</p>
        <div class="qty-control">
          <button data-qty="${id}" data-delta="-1" aria-label="Reducir cantidad">−</button>
          <span>${qty}</span>
          <button data-qty="${id}" data-delta="1" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <div class="cart-price">${money(line)}<button class="remove-item" data-remove="${id}" aria-label="Eliminar producto">♧</button></div>
    </div>`;
  }).join("");
  $("#cart-total").textContent = money(total);
}

function openMenu(){
  $(".menu-overlay").classList.add("is-open");
  $(".menu-overlay").setAttribute("aria-hidden","false");
  $("[data-action='menu']").setAttribute("aria-expanded","true");
  document.body.style.overflow="hidden";
}
function closeMenu(){
  $(".menu-overlay").classList.remove("is-open");
  $(".menu-overlay").setAttribute("aria-hidden","true");
  $("[data-action='menu']").setAttribute("aria-expanded","false");
  if(!$(".cart-overlay").classList.contains("is-open")) document.body.style.overflow="";
}
function openCart(){
  $(".cart-overlay").classList.add("is-open");
  $(".cart-overlay").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  renderCart();
}
function closeCart(){
  $(".cart-overlay").classList.remove("is-open");
  $(".cart-overlay").setAttribute("aria-hidden","true");
  if(!$(".menu-overlay").classList.contains("is-open")) document.body.style.overflow="";
}

function goToView(view){
  $$(".view").forEach(v=>v.classList.toggle("is-active", v.dataset.viewPanel===view));
  closeMenu();
  closeCart();
  closeSearch();
  if(view !== "product") history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo({top:0,behavior:"smooth"});
}

function openSearch(){
  $(".search-overlay").classList.add("is-open");
  $(".search-overlay").setAttribute("aria-hidden", "false");
  $("#search-input").focus();
  renderSearch();
}

function closeSearch(){
  $(".search-overlay").classList.remove("is-open");
  $(".search-overlay").setAttribute("aria-hidden", "true");
}

function renderSearch(){
  const query = $("#search-input").value.trim().toLowerCase();
  const results = products.filter(product => [product.name, product.meta, product.category].join(" ").toLowerCase().includes(query));
  $("#search-results").innerHTML = results.length ? results.map(product => `<button class="search-result" data-product="${product.id}"><img src="${product.image}" alt=""><span><strong>${product.name}</strong><small>${product.meta}</small></span></button>`).join("") : `<p class="search-empty">No encontramos productos que coincidan con tu búsqueda.</p>`;
}

function showToast(message){
  const toast=$("#toast");
  toast.textContent=message;
  toast.classList.add("is-visible");
  clearTimeout(window.__toast);
  window.__toast=setTimeout(()=>toast.classList.remove("is-visible"),2200);
}

document.addEventListener("click", e=>{
  const productLink=e.target.closest("[data-product]");
  if(productLink && !e.target.closest("[data-add]")){ openProduct(productLink.dataset.product); return; }

  const viewBtn=e.target.closest("[data-view]");
  if(viewBtn){ e.preventDefault(); goToView(viewBtn.dataset.view); return; }

  const add=e.target.closest("[data-add]");
  if(add){ addToCart(add.dataset.add); return; }

  const qty=e.target.closest("[data-qty]");
  if(qty){ changeQty(qty.dataset.qty, Number(qty.dataset.delta)); return; }

  const remove=e.target.closest("[data-remove]");
  if(remove){ removeItem(remove.dataset.remove); return; }

  if(e.target.closest("[data-action='menu']")){ openMenu(); return; }
  if(e.target.closest("[data-action='search']")){ openSearch(); return; }
  if(e.target.closest("[data-close-search]")){ closeSearch(); return; }
  if(e.target.closest(".social-toggle")){ $(".social-menu").classList.toggle("open"); return; }
  if(e.target.closest("[data-close-menu]")){ closeMenu(); return; }
  if(e.target.closest("[data-action='cart'], .cart-trigger")){ openCart(); return; }
  if(e.target.closest("[data-close-cart]")){ closeCart(); return; }

  const filter=e.target.closest("[data-filter]");
  if(filter){ renderStore(filter.dataset.filter); return; }

  if(e.target.closest("#login-button")){
    showToast("El acceso de clientes estará disponible próximamente.");
    closeMenu();
    return;
  }

  if(e.target.closest("#checkout-button")){
    showToast("Checkout desactivado en esta versión local.");
    return;
  }
});

document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){ closeMenu(); closeCart(); closeSearch(); }
  if(e.key==="Enter" && e.target.closest(".product-image")){ openProduct(e.target.closest(".product-image").dataset.product); }
});

$("#search-input").addEventListener("input", renderSearch);

window.addEventListener("hashchange", ()=>{
  const match = location.hash.match(/^#producto\/(.+)$/);
  if(match) openProduct(match[1]);
});

document.body.insertAdjacentHTML("beforeend", `<div class="social-wrap"><button class="social-toggle" aria-label="Abrir redes sociales">🌐</button><div class="social-menu"><a href="https://wa.me/" target="_blank" rel="noopener">WhatsApp</a><a href="https://instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://tiktok.com/" target="_blank" rel="noopener">TikTok</a></div></div>`);

renderProducts();
renderCart();

const initialProduct = location.hash.match(/^#producto\/(.+)$/);
if(initialProduct) openProduct(initialProduct[1]);
