
(() => {
  const wipe=document.querySelector('.page-wipe');
  const navToggle=document.querySelector('.nav-toggle');
  const mainNav=document.querySelector('.main-nav');
  const progress=document.querySelector('.scroll-progress');
  const backTop=document.querySelector('.back-top');

  // Current nav item
  const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const files=(a.dataset.nav||'').split(',');
    if(files.includes(file)) a.classList.add('active');
  });

  // Mobile nav
  navToggle?.addEventListener('click',()=>{
    const open=mainNav.classList.toggle('open');
    navToggle.classList.toggle('open',open);
    navToggle.setAttribute('aria-expanded',String(open));
  });

  // Cross-page transition fallback
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]'); if(!a) return;
    const href=a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || a.target==='_blank') return;
    const url=new URL(href,location.href);
    if(url.origin!==location.origin) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    wipe?.classList.add('active');
    setTimeout(()=>location.href=url.href,360);
  });

  window.addEventListener('pageshow',()=>{wipe?.classList.remove('active');document.body.classList.remove('is-leaving')});

  // Reveal animation
  const obs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}}),{threshold:.1});
  document.querySelectorAll('.reveal,.stagger').forEach(el=>obs.observe(el));

  // Impact counters
  let started=false;
  const counterWrap=document.querySelector('[data-counters]');
  const runCounters=()=>{
    if(started)return;started=true;
    document.querySelectorAll('.counter').forEach(el=>{
      const target=Number(el.dataset.target||0),start=performance.now(),duration=1100;
      const tick=now=>{let p=Math.min((now-start)/duration,1);p=1-Math.pow(1-p,3);el.textContent=Math.floor(target*p);if(p<1)requestAnimationFrame(tick);else el.textContent=target};
      requestAnimationFrame(tick);
    });
  };
  if(counterWrap){const co=new IntersectionObserver(e=>{if(e[0].isIntersecting){runCounters();co.disconnect()}},{threshold:.25});co.observe(counterWrap)}

  // Scroll progress and back-to-top
  const onScroll=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    if(progress) progress.style.width=(max>0?scrollY/max*100:0)+'%';
    backTop?.classList.toggle('show',scrollY>550);
    // gentle hero parallax
    const ph=document.querySelector('.page-hero .hero-bg'); if(ph && scrollY<500) ph.style.transform=`scale(1.04) translateY(${scrollY*.08}px)`;
  };
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  backTop?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  // FAQ
  document.querySelectorAll('.faq-q').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open')));

  // News filters
  document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.news-card[data-cat]').forEach(card=>card.classList.toggle('hidden',f!=='all'&&card.dataset.cat!==f));
  }));

  // Static demo forms
  document.querySelectorAll('form[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return}
    const msg=form.querySelector('.success-message');msg?.classList.add('show');form.reset();
  }));

  // Footer year
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();
