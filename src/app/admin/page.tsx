
import { getAdminDashboardCounts, type AdminDashboardCounts } from './actions';
import { AdminDashboard } from '@/components/admin-dashboard';

export default async function AdminPage() {
  const counts = await getAdminDashboardCounts();

  return <AdminDashboard counts={counts} />;
}
