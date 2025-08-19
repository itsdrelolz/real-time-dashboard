import { useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "~/store/auth.store";
import { supabase } from "~/lib/supabase";
export function Dashboard() { 


  const navigate = useNavigate();

    const { status, profile } = useAuthStore();
    
    
    useEffect(() => { 
    
    if (status === 'unauthenticated') { 
    
    navigate('/login', { replace: true });
	}
}, [status, navigate]);

if (status === 'loading') { 
return <div>Verifying Authentication</div>

}
if (status === 'authenticated' && profile) {
    return (
      <div>
        <h2>Dashboard</h2>
        <p>Welcome, <strong>{profile.email}</strong>!</p>
		<button
  onClick={async () => {
    await supabase.auth.signOut();
  }}
>
  Log Out
</button>
             </div>
    );
  }

  return null;
}

