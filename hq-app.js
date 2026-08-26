(function(){
window.BCSO_SUBDIVISIONS=[
{name:'Air/Water',icon:'🚁',description:'Air and marine support operations'},
{name:'CIU',icon:'🔎',description:'Criminal Investigation Unit'},
{name:'Dispatch',icon:'🎧',description:'Communications and dispatch operations'},
{name:'FTO',icon:'📋',description:'Field Training Officer program'},
{name:'Traffic Unit',icon:'🚦',description:'Traffic enforcement and highway operations'},
{name:'SWAT',icon:'🛡️',description:'Special Weapons and Tactics'},
{name:'K9',icon:'🐕',description:'Canine operations'},
{name:'STIU',icon:'⚡',description:'Specialized tactical investigations unit'},
{name:'VICE',icon:'🕶️',description:'Vice enforcement operations'}
];
window.divisions=BCSO_SUBDIVISIONS.map(x=>[x.name,x.icon,x.description]);
const oldGo=window.go;
window.go=function(page){
if(page==='rosterMenu'){document.getElementById('rosterSub')?.classList.toggle('open');return;}
if(page==='promotions'){document.getElementById('promoSub')?.classList.toggle('open');return;}
const aliases={newreport:'newReport',myreports:'reports',deputyreports:'reports',subrosters:'subdivisions',manageroster:'subdivisions',submanagement:'subdivisions',documents:'documents',announcements:'announcements'};
if(aliases[page]&&typeof window[aliases[page]]==='function'){document.querySelectorAll('#sideNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));document.getElementById('pageTitle').textContent=page==='newreport'?'Create Report':page.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase());window[aliases[page]]();return;}
if(typeof oldGo==='function')oldGo(page);
};
window.subdivisions=function(){
if(!window.current||current.role!=='Admin'){toast('Admin access required');return;}
const users=window.db?.users||{};
document.getElementById('page').innerHTML='<div class="heading"><div><span class="eyebrow">SPECIALIZED UNITS</span><h3>BCSO Subdivisions</h3><p class="muted">Manage leaders, members, applications and unit information.</p></div></div><div class="sub-grid">'+BCSO_SUBDIVISIONS.map(d=>{const members=Object.entries(users).filter(([c,u])=>u.subdivision===d.name);const leaders=members.filter(([c,u])=>u.role!=='Ranger');return '<div class="sub-card"><div class="sub-icon">'+d.icon+'</div><h3>'+d.name+'</h3><p>'+d.description+'</p><div style="display:flex;gap:8px;align-items:center;margin:10px 0"><span class="badge">'+members.length+' members</span><span class="badge gold">'+leaders.length+' leadership</span></div><button class="btn secondary" onclick="manageSubHQ(\''+d.name.replace(/'/g,"\\'")+'\')">Manage Unit →</button></div>';}).join('')+'</div>';
};
window.manageSubHQ=function(name){
const users=window.db?.users||{};const people=Object.entries(users);const members=people.filter(([c,u])=>u.subdivision===name);
modal('<span class="eyebrow">UNIT MANAGEMENT</span><h2>'+esc(name)+'</h2><p class="muted">Current members: '+members.length+'</p><label>Subdivision Leader<select id="hqLeader"><option value="">Select supervisor</option>'+people.filter(([c,u])=>u.role!=='Ranger').map(([c,u])=>'<option value="'+c+'">'+esc(u.name)+' — '+esc(u.rank)+' ('+c+')</option>').join('')+'</select></label><div style="margin:18px 0"><strong>Members</strong><div class="table-wrap" style="margin-top:8px"><table class="table"><thead><tr><th>NAME</th><th>CALLSIGN</th><th>RANK</th></tr></thead><tbody>'+(members.map(([c,u])=>'<tr><td>'+esc(u.name)+'</td><td>'+c+'</td><td>'+esc(u.rank)+'</td></tr>').join('')||'<tr><td colspan="3">No members assigned.</td></tr>')+'</tbody></table></div></div><button class="btn green" onclick="saveSubLeaderHQ(\''+name.replace(/'/g,"\\'")+'\')">Save Leader</button>');
};
window.saveSubLeaderHQ=function(name){const leader=document.getElementById('hqLeader')?.value;if(!leader){toast('Select a leader first');return}db.subLeaders=db.subLeaders||{};db.subLeaders[name]=leader;save();closeModal();subdivisions();toast('Subdivision leadership saved');};
localStorage.setItem('bcsoSubdivisions',JSON.stringify(BCSO_SUBDIVISIONS));
})();
