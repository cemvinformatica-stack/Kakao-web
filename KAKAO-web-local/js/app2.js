
(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const app = $("#app");
  const CART_KEY = "kakao-cart-v1";

  const state = {
    route: location.hash.replace("#","") || "home",
    category: "todas",
    query: ""
  };

  const categoryNames = {
    "bombones":"Bombones",
    "cacao-polvo":"Cacao en polvo",
    "tabletas":"Tabletas"
  };

  const money = value => value == null ? "Precio no disponible" :
    new Intl.NumberFormat("es-EC",{style:"currency",currency:"USD"}).format(value);

  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  };
  const saveCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const cartCount = () => getCart().reduce((n,i)=>n+i.qty,0);

  function header(){
    return `<header class="site-header">
      <div class="header-inner">
        <a class="logo" href="#home" aria-label="Kakao, inicio"><span class="logo-mark">K</span><span>Kakao</span></a>
        <div class="header-actions">
          <button class="icon-btn" data-action="menu" aria-label="Abrir menú Más"><span>☰</span><span class="label">MÁS</span></button>
          <button class="icon-btn" data-action="search" aria-label="Buscar productos"><span>⌕</span><span class="label">BUSCAR</span></button>
          <button class="icon-btn" data-action="cart" aria-label="Abrir carrito"><span>🛒</span><span class="cart-count">${cartCount()}</span></button>
        </div>
      </div>
    </header>`;
  }

  function footer(){
    return `<footer><div class="container">
      <div class="footer-grid">
        <div><h3>Kakao</h3><p>Chocolate y cacao de origen, presentado con una mirada contemporánea y artesanal.</p></div>
        <div><h3>Explorar</h3><div class="footer-links">
          <a href="#home">Inicio</a><a href="#tienda">Tienda</a><a href="#historia">Nuestra historia</a><a href="#carrito">Carrito</a>
        </div></div>
        <div><h3>Conecta</h3><div class="footer-links"><a href="https://wa.me/" target="_blank" rel="noopener">WhatsApp</a><a href="https://instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://tiktok.com/" target="_blank" rel="noopener">TikTok</a></div></div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} Kakao. Proyecto local. Datos comerciales no disponibles en los archivos proporcionados.</div>
    </div></footer>`;
  }

  function productCard(p){
    const price = p.price == null ? `<span class="price missing">Precio no disponible</span>` : `<span class="price">${money(p.price)}</span>`;
    return `<article class="product-card">
      <div class="product-image" data-product="${p.id}" role="link" tabindex="0" aria-label="Ver ${p.name}">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="product-info">
        <div class="product-cat">${categoryNames[p.category]}</div>
        <div class="product-name">${p.name}</div>
        <div class="card-row">${price}
          <button class="add-mini" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">+</button>
        </div>
      </div>
    </article>`;
  }

  function home(){
    const featured = PRODUCTS.slice(0,4);
    return `<main>
      <section class="hero">
        <div class="hero-media"><img src="assets/hero-section.png" alt="Presentación de chocolate y cacao"></div>
        <div class="container"><div class="hero-copy">
          <div class="eyebrow">Chocolate · cacao · origen</div>
          <h1>El cacao,<br>sin prisa.</h1>
          <p>Una colección de productos de cacao pensada para disfrutar el origen, la textura y el ritual de cada bocado.</p>
          <a class="btn light" href="#tienda">Ver toda la tienda →</a>
        </div></div>
      </section>

      <section class="section alt"><div class="container">
        <div class="section-head"><div><div class="kicker">Selección Kakao</div><h2>Pequeños rituales<br>de chocolate.</h2></div>
          <a class="btn ghost" href="#tienda">Explorar catálogo</a></div>
        <div class="product-grid">${featured.map(productCard).join("")}</div>
      </div></section>

      <section class="section"><div class="container">
        <div class="split">
          <div class="story-image"><img src="assets/historia-cacao.png" alt="Cacao de origen"></div>
          <div class="story-copy"><div class="kicker">Nuestra historia</div><h2>Del cacao al momento.</h2>
            <p>Esta experiencia toma como punto de partida los recursos visuales entregados para el proyecto y los convierte en una tienda coherente, clara y navegable.</p>
            <a class="btn" href="#historia">Conocer nuestra historia</a>
          </div>
        </div>
      </div></section>

      <section class="section alt"><div class="container">
        <div class="section-head"><div><div class="kicker">Tres caminos</div><h2>Encuentra tu cacao.</h2></div></div>
        <div class="feature-row">
          <div class="feature"><strong>Bombones</strong><p>Para regalar, compartir o guardar un momento solo para ti.</p></div>
          <div class="feature"><strong>Cacao en polvo</strong><p>Una base versátil para bebidas, recetas y rituales.</p></div>
          <div class="feature"><strong>Tabletas</strong><p>Texturas y perfiles para disfrutar el chocolate a tu ritmo.</p></div>
        </div>
      </div></section>
    </main>`;
  }

  function store(){
    const filtered = PRODUCTS.filter(p => state.category==="todas" || p.category===state.category);
    return `<main class="page"><div class="container">
      <a class="back" href="#home">← Volver al inicio</a>
      <div class="page-title"><div class="kicker">Catálogo</div><h1 style="color:var(--ink)">La tienda.</h1><p class="lead">Explora las tres categorías disponibles en los recursos reales del proyecto.</p></div>
      <div class="category-nav">
        <button class="filter-btn ${state.category==="todas"?"active":""}" data-category="todas">Todo</button>
        <button class="filter-btn ${state.category==="bombones"?"active":""}" data-category="bombones">Bombones</button>
        <button class="filter-btn ${state.category==="cacao-polvo"?"active":""}" data-category="cacao-polvo">Cacao en polvo</button>
        <button class="filter-btn ${state.category==="tabletas"?"active":""}" data-category="tabletas">Tabletas</button>
      </div>
      <div class="product-grid">${filtered.length ? filtered.map(productCard).join("") : `<div class="empty" style="grid-column:1/-1"><p>No encontramos productos en esta categoría.</p></div>`}</div>
      <div class="notice">Nota de datos: los archivos entregados contienen las imágenes, pero no incluyen precios, SKU, marcas ni fichas técnicas completas. Por eso esos campos se muestran como “no disponible” en lugar de inventarlos.</div>
    </div></main>`;
  }

  function productPage(){
    const p = PRODUCTS.find(x=>x.id===state.route.split("/")[1]);
    if(!p) return `<main class="page"><div class="container"><div class="empty"><h2>Producto no encontrado</h2><a class="btn" href="#tienda">Volver a la tienda</a></div></div></main>`;
    const price = p.price == null ? `<div class="detail-price" style="color:var(--muted)">Precio no disponible</div>` : `<div class="detail-price">${money(p.price)}</div>`;
    return `<main class="page"><div class="container">
      <a class="back" href="#tienda">← Volver a la tienda</a>
      <div class="product-detail">
        <div class="detail-image"><img src="${p.image}" alt="${p.name}"></div>
        <div class="detail-copy">
          <div class="kicker">${categoryNames[p.category]}</div><h1>${p.name}</h1>${price}
          <p class="detail-desc">${p.description}</p>
          <button class="btn" data-add="${p.id}">Agregar al carrito</button>
          <div class="meta">
            <div class="meta-row"><b>SKU</b><span>${p.sku ?? "No disponible en los archivos"}</span></div>
            <div class="meta-row"><b>Categoría</b><span>${categoryNames[p.category]}</span></div>
            <div class="meta-row"><b>Etiquetas</b><span>${p.tags.join(" · ")}</span></div>
            <div class="meta-row"><b>Marca</b><span>${p.brand ?? "No disponible en los archivos"}</span></div>
          </div>
          <div class="notice">Los datos comerciales que no están presentes en los archivos originales no se han inventado.</div>
        </div>
      </div>
    </div></main>`;
  }

  function history(){
    return `<main class="page"><div class="container">
      <a class="back" href="#home">← Volver al inicio</a>
      <div class="split">
        <div class="story-image"><img src="assets/historia-cacao.png" alt="Historia del cacao"></div>
        <div class="story-copy"><div class="kicker">Nuestra historia</div><h1 style="color:var(--ink);font-size:clamp(48px,6vw,82px)">Un origen que se disfruta.</h1>
          <p>La historia de esta tienda se presenta desde los recursos visuales reales del proyecto: cacao, producto, personas y una estética cálida de origen.</p>
          <p>El contenido corporativo específico no fue incluido en los archivos proporcionados, así que esta sección evita atribuir fechas, nombres o afirmaciones que no podamos verificar.</p>
          <a class="btn" href="#tienda">Ver productos</a>
        </div>
      </div>
      <section class="section" style="padding-bottom:0"><div class="section-head"><div><div class="kicker">Nuestro equipo</div><h2>Personas detrás<br>del cacao.</h2></div></div>
        <div class="feature-row">
          ${["equipo-carlos.png","equipo-elena.png","equipo-mateo.png"].map((img,i)=>`<div class="feature" style="padding:0;overflow:hidden"><img src="assets/${img}" alt="Integrante del equipo ${i+1}" style="width:100%;height:330px;object-fit:cover"><div style="padding:18px"><strong>Equipo ${i+1}</strong><p>Nombre y cargo no disponibles en los archivos.</p></div></div>`).join("")}
        </div>
      </section>
    </div></main>`;
  }

  function cart(){
    const items = getCart().map(i => ({...i, product:PRODUCTS.find(p=>p.id===i.id)})).filter(i=>i.product);
    const count = items.reduce((n,i)=>n+i.qty,0);
    if(!items.length) return `<main class="page"><div class="container">
      <a class="back" href="#tienda">← Volver a la tienda</a>
      <div class="empty"><h2>Tu carrito está vacío</h2><p>Agrega productos desde la tienda para verlos aquí.</p><a class="btn" href="#tienda">Volver a la tienda</a></div>
    </div></main>`;
    const hasPrices = items.every(i=>i.product.price != null);
    return `<main class="page"><div class="container">
      <a class="back" href="#tienda">← Seguir comprando</a><div class="page-title"><div class="kicker">${count} producto${count!==1?"s":""}</div><h1 style="color:var(--ink)">Tu carrito.</h1></div>
      <div class="cart-layout"><div class="cart-list">${items.map(i=>`<div class="cart-item">
        <img src="${i.product.image}" alt="${i.product.name}">
        <div><strong>${i.product.name}</strong><div class="qty"><button data-qty="${i.id}" data-delta="-1" aria-label="Disminuir cantidad">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1" aria-label="Aumentar cantidad">+</button></div></div>
        <div class="price">${i.product.price == null ? "Precio no disponible" : money(i.product.price*i.qty)}<br><button class="remove" data-remove="${i.id}">Eliminar</button></div>
      </div>`).join("")}</div>
      <aside class="summary"><h3>Resumen</h3>
        <div class="summary-row"><span>Subtotal</span><span>${hasPrices ? money(items.reduce((s,i)=>s+i.product.price*i.qty,0)) : "No disponible"}</span></div>
        <div class="summary-row"><span>Total</span><strong>${hasPrices ? money(items.reduce((s,i)=>s+i.product.price*i.qty,0)) : "No disponible"}</strong></div>
        <button class="btn light" data-checkout>Continuar</button>
        ${!hasPrices?'<p style="font:11px Arial;color:#b9aaa2;margin-top:14px">No se puede calcular el total porque los precios no están incluidos en los archivos.</p>':""}
      </aside></div>
    </div></main>`;
  }

  function render(){
    if(state.route.startsWith("producto/")) app.innerHTML = header()+productPage()+footer();
    else if(state.route==="tienda") app.innerHTML = header()+store()+footer();
    else if(state.route==="historia") app.innerHTML = header()+history()+footer();
    else if(state.route==="carrito") app.innerHTML = header()+cart()+footer();
    else { state.route="home"; app.innerHTML=header()+home()+footer(); }
    bind();
    updateCartCount();
  }

  function updateCartCount(){
    const el=$(".cart-count"); if(el) el.textContent=cartCount();
  }

  function toast(msg){
    let t=$(".toast"); if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}
    t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2200);
  }

  function add(id){
    const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
    const cart=getCart(); const item=cart.find(x=>x.id===id);
    item ? item.qty++ : cart.push({id,qty:1}); saveCart(cart); updateCartCount(); toast(`${p.name} agregado al carrito ✓`);
  }

  function openMenu(){
    closeSearch();
    let overlay=$(".overlay"), drawer=$(".drawer");
    if(!overlay){ document.body.insertAdjacentHTML("beforeend",`<div class="overlay"></div><aside class="drawer" aria-label="Menú Más">
      <div class="drawer-head"><div><div class="kicker">Kakao</div><h2>Más</h2></div><button class="close" data-close-menu aria-label="Cerrar menú">×</button></div>
      <nav class="drawer-nav"><button data-go="home">Inicio</button><button data-go="tienda">Tienda</button><button data-go="historia">Nuestra historia</button><button data-go="carrito">Carrito</button></nav>
    </aside>`); overlay=$(".overlay");drawer=$(".drawer"); }
    overlay.classList.add("open");drawer.classList.add("open");
  }
  function closeMenu(){ $(".overlay")?.classList.remove("open"); $(".drawer")?.classList.remove("open"); }
  function openSearch(){
    closeMenu();
    let panel=$(".search-panel");
    if(!panel){document.body.insertAdjacentHTML("beforeend",`<div class="search-panel" role="dialog" aria-label="Buscar">
      <div class="search-inner"><div class="search-head"><div><div class="kicker">Catálogo</div><h2>Buscar</h2></div><button class="close" data-close-search aria-label="Cerrar búsqueda">×</button></div>
      <input class="search-input" id="searchInput" type="search" placeholder="Escribe un producto, categoría o etiqueta…" autocomplete="off">
      <div class="search-results" id="searchResults"></div></div></div>`);panel=$(".search-panel");}
    panel.classList.add("open"); $("#searchInput").focus(); renderSearch();
  }
  function closeSearch(){ $(".search-panel")?.classList.remove("open"); }
  function renderSearch(){
    const q=(state.query||$("#searchInput")?.value||"").trim().toLowerCase();
    const list=PRODUCTS.filter(p=>!q || [p.name,p.category,...p.tags].join(" ").toLowerCase().includes(q));
    const el=$("#searchResults"); if(!el) return;
    el.innerHTML=list.length ? list.map(p=>`<button class="search-result" data-product="${p.id}"><img src="${p.image}" alt=""><span><b>${p.name}</b><br><small>${categoryNames[p.category]}</small></span></button>`).join("") : `<div class="empty" style="grid-column:1/-1"><p>No encontramos productos que coincidan con tu búsqueda.</p></div>`;
  }

  function bind(){
    document.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>({menu:openMenu,search:openSearch,cart:()=>location.hash="carrito"}[b.dataset.action])()));
    document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();add(b.dataset.add)}));
    document.querySelectorAll("[data-product]").forEach(el=>{el.addEventListener("click",()=>location.hash="producto/"+el.dataset.product);el.addEventListener("keydown",e=>{if(e.key==="Enter") location.hash="producto/"+el.dataset.product})});
    document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{state.category=b.dataset.category;render()}));
    document.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>{const c=getCart(),i=c.find(x=>x.id===b.dataset.qty);if(i){i.qty+=Number(b.dataset.delta);if(i.qty<1)c.splice(c.indexOf(i),1);saveCart(c);render()}}));
    document.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{saveCart(getCart().filter(x=>x.id!==b.dataset.remove));render()}));
    document.querySelector("[data-checkout]")?.addEventListener("click",()=>toast("El checkout requiere datos comerciales que no fueron proporcionados."));
    document.querySelector("[data-go]")?.addEventListener("click",()=>{});
  }

  document.addEventListener("click",e=>{
    if(e.target.matches("[data-close-menu]") || e.target.matches(".overlay")) closeMenu();
    if(e.target.matches("[data-close-search]")) closeSearch();
    if(e.target.matches("[data-go]")){closeMenu();location.hash=e.target.dataset.go}
    if(e.target.matches(".social-toggle")) $(".social-menu")?.classList.toggle("open");
    if(e.target.closest(".search-result")){closeSearch();location.hash="producto/"+e.target.closest(".search-result").dataset.product}
  });
  document.addEventListener("input",e=>{if(e.target.id==="searchInput"){state.query=e.target.value;renderSearch()}});

  // Floating social button 
  document.body.insertAdjacentHTML("beforeend",`<div class="social-wrap"><button class="social-toggle" aria-label="Abrir redes sociales">🌐</button><div class="social-menu"><a href="https://wa.me/" target="_blank" rel="noopener">WhatsApp</a><a href="https://instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://tiktok.com/" target="_blank" rel="noopener">TikTok</a></div></div>`);

  window.addEventListener("hashchange",()=>{state.route=location.hash.replace("#","")||"home";render();window.scrollTo({top:0,behavior:"smooth"})});
  render();
})();
