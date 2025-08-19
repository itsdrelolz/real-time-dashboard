import { useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "~/store/auth.store";

export function Dashboard() { 


  const navigate = useNavigate();

    const { status, profile, logout } = useAuthStore();
    
    
    useEffect(() => { 
    
    if (status === 'unauthenticated') { 
    
    navigate('/login');
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
        <button onClick={logout}>Log Out</button>
      </div>
    );
  }

  return null;
}

