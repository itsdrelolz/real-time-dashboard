import { GuestRoute } from '~/components/layout/GuestRoute';
import { LoginForm } from '~/components/auth/LoginForm';
// ... other imports

export default function Login() {
  return (
    <GuestRoute>
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    </GuestRoute>
  );
}
