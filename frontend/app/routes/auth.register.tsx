import { GuestRoute } from '~/components/layout/GuestRoute';
import { RegisterForm } from '~/components/auth/RegisterForm';

export default function Login() {
  return (
    <GuestRoute>
      <div className="min-h-screen flex items-center justify-center">
        <RegisterForm />
      </div>
    </GuestRoute>
  );
}
