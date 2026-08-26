window.BCSO_RANKS=[
{name:'Sheriff',tier:'Department Head',strike:true,vehicle:'Department Head'},
{name:'Undersheriff',tier:'Department Head',strike:true,vehicle:'Department Head'},
{name:'Assistant Sheriff',tier:'Department Head',strike:true,vehicle:'Training Bureau & Field Services'},
{name:'Chief Deputy',tier:'Department Head',strike:true,vehicle:'Technology & Support / Recruitment'},
{name:'Colonel',tier:'High Command',strike:true,vehicle:'Unmarked & Slicktop'},
{name:'Major',tier:'High Command',strike:true,vehicle:'Unmarked & Slicktop'},
{name:'Captain',tier:'High Command',strike:true,vehicle:'Unmarked & Slicktop'},
{name:'Lieutenant',tier:'Mid Command',strike:true,vehicle:'Unmarked & Slicktop'},
{name:'Master Sergeant',tier:'Mid Command',strike:true,vehicle:'Unmarked & Slicktop'},
{name:'Sergeant',tier:'Mid Command',strike:true,vehicle:'Unmarked & Slicktop'},
{name:'Master Corporal',tier:'Low Command',strike:false,vehicle:'Unmarked & Slicktop'},
{name:'Corporal',tier:'Low Command',strike:false,vehicle:'Ghosted / Supervisor Livery Only'},
{name:'Master Deputy',tier:'Field Personnel',strike:false,vehicle:'Slicktop & Pushbar'},
{name:'Senior Deputy',tier:'Field Personnel',strike:false,vehicle:'Ghost Livery / Lightbar & Pushbar'},
{name:'Deputy 2',tier:'Field Personnel',strike:false,vehicle:'Standard Patrol'},
{name:'Deputy 1',tier:'Field Personnel',strike:false,vehicle:'Standard Patrol'},
{name:'Cadet',tier:'Field Personnel',strike:false,vehicle:'Cadet Authorized Vehicles'}
];
window.BCSO_RANK_NAMES=window.BCSO_RANKS.map(r=>r.name);
window.BCSO_RANK_ORDER=Object.fromEntries(window.BCSO_RANKS.map((r,i)=>[r.name,i]));
window.BCSO_CAN_STRIKE=r=>!!(window.BCSO_RANKS.find(x=>x.name===r)?.strike);
