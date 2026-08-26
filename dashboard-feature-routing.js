/* Final dashboard routing bridge. Loaded after all feature scripts. */
(function(){
  const oldGo=window.go;
  function route(page){
    document.querySelectorAll('#sideNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    const titles={users:'User Management',reportbuilder:'Report Builder',honorsadmin:'Awards & Subdivisions',honors:'My Awards',subdivisions:'Subdivision Management',newreport:'Create Report',myreports:'My Reports'};
    const title=document.getElementById('pageTitle'); if(title) title.textContent=titles[page]||page.charAt(0).toUpperCase()+page.slice(1);
    try{
      if(page==='reportbuilder'&&typeof window.reportBuilder==='function') return window.reportBuilder();
      if(page==='honorsadmin'&&typeof window.managePersonnelHonors==='function') return window.managePersonnelHonors();
      if(page==='honors'&&typeof window.viewAwards==='function') return window.viewAwards(window.current?.callsign||current?.callsign);
      if(page==='newreport'&&typeof window.configurableReports==='function') return window.configurableReports();
      if(page==='users'&&typeof window.users==='function') return window.users();
      if(page==='subdivisions'&&typeof window.subdivisions==='function') return window.subdivisions();
      if(page==='myreports'&&typeof window.reports==='function') return window.reports();
      if(typeof oldGo==='function') return oldGo(page);
    }catch(e){console.error('BCSO navigation error:',e);if(typeof toast==='function')toast('This section had an error loading. Refresh and try again.');}
  }
  window.go=route;
  document.addEventListener('click',function(e){const b=e.target.closest('#sideNav button[data-page]');if(!b)return;e.preventDefault();route(b.dataset.page)},true);
  window.addEventListener('load',function(){setTimeout(function(){
    if(typeof current!=='undefined'&&current&&current.role==='Admin') document.querySelectorAll('.admin-only').forEach(x=>x.style.display='block');
  },50)});
})();
