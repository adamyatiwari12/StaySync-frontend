import Profile from "@/components/Profile";
import AdminNavbar from "@/components/layout/AdminNavbar";

export default function AdminProfilePage() {
  return <Profile navbar={<AdminNavbar />} role="admin" />;
}
