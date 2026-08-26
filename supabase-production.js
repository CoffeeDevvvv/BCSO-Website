/* BCSO production data bridge. Uses the existing Supabase client without exposing service-role secrets. */
window.BCSO_DB={
 async listProfiles(){ if(!window.supabaseClient)return[]; const {data,error}=await window.supabaseClient.from('profiles').select('*').order('created_at',{ascending:false}); if(error)throw error; return data||[] },
 async listAwards(){ if(!window.supabaseClient)return[]; const {data,error}=await window.supabaseClient.from('awards').select('*,award_definitions(*)').order('awarded_at',{ascending:false}); if(error)throw error; return data||[] },
 async listReportTypes(){ if(!window.supabaseClient)return[]; const {data,error}=await window.supabaseClient.from('report_types').select('*,report_fields(*)').order('created_at'); if(error)throw error; return data||[] },
 async listSubdivisions(){ if(!window.supabaseClient)return[]; const {data,error}=await window.supabaseClient.from('subdivisions').select('*').order('name'); if(error)throw error; return data||[] },
 async listReports(){ if(!window.supabaseClient)return[]; const {data,error}=await window.supabaseClient.from('report_submissions').select('*,report_types(*)').order('created_at',{ascending:false}); if(error)throw error; return data||[] },
 async listApplications(){ if(!window.supabaseClient)return[]; const {data,error}=await window.supabaseClient.from('subdivision_applications').select('*').order('created_at',{ascending:false}); if(error)throw error; return data||[] },
 async listAnnouncements(){ if(!window.supabaseClient)return[]; const {data,error}=await window.supabaseClient.from('announcements').select('*').order('created_at',{ascending:false}); if(error)throw error; return data||[] },
 async listSops(){ if(!window.supabaseClient)return[]; const {data,error}=await window.supabaseClient.from('sops').select('*').order('created_at',{ascending:false}); if(error)throw error; return data||[] }
};
