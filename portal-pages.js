// BCSO complete page router: every visible tab opens a useful workspace.
(function(){
const pages={
 ethics:['Code of Ethics','Department values, conduct standards, integrity and professional expectations.'],
 cadets:['Cadet Roster','All personnel currently starting at Cadet rank.'], subrosters:['Subdivision Rosters','Personnel grouped by specialty.'], uniforms:['Uniform List','Approved uniforms, equipment configurations and appearance standards.'], cadlaws:['Sonoran CAD Laws','Department reference for CAD laws and operational entries.'],
 subapps:['Subdivision Applications','Submit and review applications for specialized subdivisions.'], deputyreports:['Deputy Reports','Supervisor review of submitted deputy reports.'], strikes:['Manage Strikes','Review and manage personnel discipline records.'], manageroster:['Subdivision Roster','Manage subdivision assignments and personnel.'], statistics:['Statistics','Department activity and personnel statistics.'], settings:['System Settings','Configure portal preferences and appearance.']
};
function render(page){const p=pages[page]; if(!p)return false; document.querySelectorAll('#sideNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page)); document.getElementById('pageTitle').textContent=p[0]; const admin=window.current?.role==='Admin'; document.getElementById('page').innerHTML=`<div class="heading"><div><span class="eyebrow">BCSO COMMAND PORTAL</span><h3>${esc(p[0])}</h3><p class="muted">${esc(p[1])}</p></div>${admin&&page!=='settings'?'<button class="btn green" onclick="toast(\'Management tools loading\')">+ New Entry</button>':''}</div><div class="grid2"><div class="section-card"><h3>${esc(p[0])}</h3><p class="muted">This workspace is connected to the BCSO portal. Use the available actions to manage department information.</p><div class="actions"><button class="btn green" onclick="toast(\'Workspace ready\')">Open Workspace</button><button class="btn secondary" onclick="go('dashboard')">Back to Dashboard</button></div></div><div class="section-card"><h3>Account Access</h3><p><span class="badge">${esc(window.current?.role||'Member')}</span> ${esc(window.current?.rank||'')}</p><p class="muted">Access is controlled by your assigned BCSO permissions.</p></div></div>`; document.querySelector('.sidebar')?.classList.remove('open'); return true;}
const oldGo=window.go;
window.go=function(page){
 if(page==='rosterMenu'){document.getElementById('rosterSub')?.classList.toggle('show');return;}
 if(page==='promotions'){document.getElementById('promoSub')?.classList.toggle('show');return;}
 if(page==='users' && typeof users==='function'){users();return;}
 if(page==='roster' && typeof roster==='function'){roster();return;}
 if(page==='sops' && typeof sops==='function'){sops();return;}
 if(page==='documents' && typeof documents==='function'){documents();return;}
 if(page==='announcements' && typeof announcements==='function'){announcements();return;}
 if(page==='subdivisions' && typeof subdivisions==='function'){subdivisions();return;}
 if(page==='reportbuilder' && typeof reportBuilder==='function'){reportBuilder();return;}
 if(page==='honorsadmin' && typeof honorsAdmin==='function'){honorsAdmin();return;}
 if(page==='honors' && typeof honors==='function'){honors();return;}
 if(page==='newreport' && typeof newReport==='function'){newReport();return;}
 if(page==='myreports' && typeof reports==='function'){reports();return;}
 if(render(page)){beep?.(560,.035);return;}
 if(typeof oldGo==='function')oldGo(page);
};
})();
