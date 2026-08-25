function toggleMenu(){document.querySelector('.nav nav').classList.toggle('open')}
function showInfo(title,text){document.getElementById('modalTitle').textContent=title;document.getElementById('modalText').textContent=text;document.getElementById('modal').classList.add('show')}
function closeInfo(){document.getElementById('modal').classList.remove('show')}
function filterRoster(){const q=document.getElementById('rosterSearch').value.toLowerCase();document.querySelectorAll('#rosterBody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeInfo()});
