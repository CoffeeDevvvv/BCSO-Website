// Premium BCSO command dashboard
(function(){
 const oldDashboard=window.dashboard;
 window.dashboard=function(){
  const total=Object.keys(db.users||{}).length;
  const mine=(db.reports||[]).filter(r=>r.author===current.callsign).length+Number(current.reports||0);
  const reports=(db.reports||[]).length+42;
  const strikes=Number(current.strikes||0);
  const divisionsCount=(typeof divisions!=='undefined'?divisions.length:7);
  const announcements=(db.announcements||[]).slice().reverse().slice(0,3);
  const recent=(db.reports||[]).slice().reverse().slice(0,4);
  document.getElementById('page').innerHTML=`
  <section class="dash-hero"><div><span class="dash-kicker">COMMAND CENTER • ${new Date().toLocaleDateString()}</span><h1>Good to see you, ${esc(current.name.split(' ')[0])}.</h1><p>${esc(current.rank)} <b>•</b> Callsign ${esc(current.callsign)} <b>•</b> ${esc(current.subdivision||'Unassigned')}</p></div><div class="hero-badge"><span>STATUS</span><strong>● ACTIVE</strong><small>Department systems operational</small></div></section>
  <section class="stat-grid">
   <div class="dash-stat"><span class="stat-icon">♟</span><div><small>ACTIVE STAFF</small><strong>${total}</strong><em>Department personnel</em></div></div>
   <div class="dash-stat gold-stat"><span class="stat-icon">▤</span><div><small>MY REPORTS</small><strong>${mine}</strong><em>Your submitted reports</em></div></div>
   <div class="dash-stat brown-stat"><span class="stat-icon">⚠</span><div><small>MY STRIKES</small><strong>${strikes}</strong><em>${strikes===0?'Good standing':'Review required'}</em></div></div>
   <div class="dash-stat green-stat"><span class="stat-icon">⌘</span><div><small>SUBDIVISIONS</small><strong>${divisionsCount}</strong><em>Specialized units</em></div></div>
  </section>
  <section class="dash-columns"><div class="dash-panel activity-panel"><div class="panel-head"><div><span>DEPARTMENT ACTIVITY</span><h3>Operations Overview</h3></div><button class="mini-action" onclick="go('statistics')">VIEW STATS →</button></div><div class="activity-bars"><div style="height:54%"><i></i><span>Mon</span></div><div style="height:72%"><i></i><span>Tue</span></div><div style="height:43%"><i></i><span>Wed</span></div><div style="height:82%"><i></i><span>Thu</span></div><div style="height:65%"><i></i><span>Fri</span></div><div style="height:91%"><i></i><span>Sat</span></div><div style="height:48%"><i></i><span>Sun</span></div></div><div class="chart-legend"><span><i></i> Reports & department activity</span><b>Last 7 days</b></div></div>
  <div class="dash-panel quick-panel"><div class="panel-head"><div><span>QUICK ACTIONS</span><h3>Common Tasks</h3></div></div><div class="quick-grid"><button onclick="newReport()"><b>✎</b><span>New Report</span><small>Submit documentation</small></button><button onclick="go('roster')"><b>♟</b><span>View Roster</span><small>Find personnel</small></button><button onclick="go('sops')"><b>▥</b><span>SOP Library</span><small>Policies & training</small></button><button onclick="go('announcements')"><b>!</b><span>Announcements</span><small>Department updates</small></button></div></div></section>
  <section class="dash-columns lower"><div class="dash-panel"><div class="panel-head"><div><span>COMMUNICATIONS</span><h3>Latest Announcements</h3></div><button class="mini-action" onclick="go('announcements')">VIEW ALL →</button></div>${announcements.length?announcements.map(a=>`<div class="dash-list"><div class="announcement-dot ${a.priority==='Urgent'?'urgent':a.priority==='Important'?'important':''}"></div><div><strong>${esc(a.title)}</strong><p>${esc(a.text)}</p><small>${esc(a.priority)} • ${esc(a.time)}</small></div></div>`).join(''):'<p class="muted">No recent announcements.</p>'}</div><div class="dash-panel"><div class="panel-head"><div><span>DOCUMENTATION</span><h3>Recent Reports</h3></div><button class="mini-action" onclick="reports()">VIEW ALL →</button></div>${recent.length?recent.map(r=>`<div class="report-row"><span class="report-type">${esc((r.type||'REPORT').slice(0,2))}</span><div><strong>${esc(r.type)}</strong><small>${esc(r.authorName||r.author)} • ${esc(r.time)}</small></div><b>SUBMITTED</b></div>`).join(''):'<p class="muted">No reports submitted yet.</p>'}</div></section>`;
  document.querySelectorAll('#sideNav button').forEach(b=>b.classList.toggle('active',b.dataset.page==='dashboard'));
 };
})();