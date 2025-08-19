import { ProtectedRoute } from '~/components/layout/ProtectedRoute';
import { Dashboard } from '~/components/dashboard/Dashboard';

export default function Index() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
