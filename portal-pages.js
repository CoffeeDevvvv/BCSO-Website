// BCSO Portal page router + clean scrolling fixes
(function(){
  const pages={
    ethics:['Code of Ethics','Department values, conduct standards, integrity and professional expectations.'],
    cadets:['Cadet Roster','View personnel currently assigned to the cadet program.'],
    subrosters:['Subdivision Rosters','View personnel assigned to each BCSO specialized subdivision.'],
    uniforms:['Uniform List','Approved uniforms, equipment configurations and appearance standards.'],
    cadlaws:['Sonoran CAD Laws','Department reference for CAD laws, codes and operational entries.'],
    newreport:['Create Report','Create and submit a new department report.'],
    myreports:['My Reports','Review reports submitted by your account.'],
    subapps:['Subdivision Applications','Submit and review applications for specialized subdivisions.'],
    deputyreports:['Deputy Reports','Supervisor view of submitted deputy reports.'],
    strikes:['Manage Strikes','Review and manage personnel strike records.'],
    manageroster:['Subdivision Roster','Manage subdivision assignments and personnel.'],
    suggestions:['Complaints & Suggestions','Review department complaints and suggestions.'],
    reporteddeputies:['Reported Deputies','Review deputies who have been reported to supervision.'],
    statistics:['Statistics','Department activity, personnel and reporting statistics.'],
    blacklist:['Blacklisted Deputies','Leadership view of blacklisted or separated personnel.'],
    submanagement:['Subdivision Management','Manage subdivision leadership, members and assignments.'],
    clearance:['Corporal Clearance','Review corporal clearance and eligibility records.'],
    passwordreset:['Password Reset','Reset a department account password securely.'],
    cadetmanagement:['Cadet Management','Manage cadet accounts, assignments and progression.'],
    invitations:['Deputy Invitations','Create and manage invitations for new personnel.'],
    promotions:['Promotions','Department promotion management.'],
    cadetpromotion:['Cadet Promotion','Process eligible cadet promotions.'],
    deputypromotion:['Deputy Promotions','Process deputy rank promotions.'],
    supervisorpromotion:['Supervisor Promotions','Process supervisor rank promotions.'],
    pendingpromotions:['Pending Promotions','Review promotions awaiting approval.'],
    supervisorstats:['Supervisor Statistics','Leadership statistics for supervisory personnel.'],
    loa:['LOA Approval','Review and approve leave of absence requests.'],
    reportedsupervisors:['Reported Supervisors','Review reports involving supervisory personnel.'],
    uniformmanagement:['Uniform Management','Manage approved uniform configurations.'],
    auditlogs:['Audit Logs','Review administrative actions and system activity.'],
    sheriffmanagement:['Sheriff Management','Manage senior leadership settings and permissions.'],
    settings:['System Settings','Configure portal preferences and department settings.']
  };
  function placeholder(page){
    const p=pages[page]||['BCSO Command Portal','This section is available from the department command portal.'];
    const admin=current&&current.role==='Admin';
    document.getElementById('page').innerHTML=`<div class="heading"><div><span class="eyebrow">BCSO COMMAND PORTAL</span><h3>${esc(p[0])}</h3><p class="muted">${esc(p[1])}</p></div>${admin?'<button class="btn green" onclick="toast(\'Management action ready\')">+ New Entry</button>':''}</div><div class="grid2"><div class="section-card"><h3>${esc(p[0])}</h3><p class="muted">This workspace is ready for department data and actions. Use the controls here to manage BCSO operations once the live Supabase backend is connected.</p><div class="actions"><button class="btn green" onclick="toast('Action selected')">Open Workspace</button><button class="btn secondary" onclick="go('dashboard')">Back to Dashboard</button></div></div><div class="section-card"><h3>Access</h3><p><span class="badge">${esc(current.role)}</span> ${esc(current.rank)}</p><p class="muted">Your account can access this section according to its assigned role.</p></div></div>`;
  }
  const originalGo=window.go;
  window.go=function(page){
    if(page==='rosterMenu'){document.getElementById('rosterSub')?.classList.toggle('show');return;}
    if(page==='promotions'){document.getElementById('promoSub')?.classList.toggle('show');return;}
    if(pages[page] && !['newreport','myreports','sops','documents','announcements','subdivisions','users','dashboard','roster','reports'].includes(page)){
      beep(560,.035); document.querySelectorAll('#sideNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page)); document.getElementById('pageTitle').textContent=pages[page][0]; placeholder(page); document.querySelector('.sidebar').classList.remove('open'); return;
    }
    if(page==='newreport'){newReport();return;}
    if(page==='myreports'){reports();return;}
    originalGo(page);
  };
})();
