// Supabase connection bootstrap for BCSO portal
(function(){
  const cfg=window.BCSO_SUPABASE_CONFIG;
  if(!cfg || !cfg.url || !cfg.publishableKey || cfg.publishableKey.includes('PASTE_')) return;
  if(!window.supabase?.createClient) return;
  window.bcsoSupabase=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  window.BCSO_DB={
    async session(){const {data,error}=await bcsoSupabase.auth.getSession();return {session:data?.session||null,error};},
    async signIn(callsign,password){
      const email=`${String(callsign).trim()}@bcso.local`;
      const result=await bcsoSupabase.auth.signInWithPassword({email,password});
      if(result.error) return result;
      if(result.data.user){
        const profile=await bcsoSupabase.from('profiles').select('*').eq('id',result.data.user.id).single();
        if(profile.error) return {data:result.data,error:profile.error};
        result.data.profile=profile.data;
      }
      return result;
    },
    signOut(){return bcsoSupabase.auth.signOut();},
    profiles(){return bcsoSupabase.from('profiles').select('*').eq('active',true).order('full_name');},
    reports(){return bcsoSupabase.from('reports').select('*').order('created_at',{ascending:false});},
    myReports(id){return bcsoSupabase.from('reports').select('*').eq('author_id',id).order('created_at',{ascending:false});},
    subdivisions(){return bcsoSupabase.from('subdivisions').select('*').order('name');},
    announcements(){return bcsoSupabase.from('announcements').select('*').order('created_at',{ascending:false});},
    sops(){return bcsoSupabase.from('sops').select('*').order('title');},
    documents(){return bcsoSupabase.from('documents').select('*').order('created_at',{ascending:false});}
  };
  window.dispatchEvent(new Event('bcso-supabase-ready'));
})();
