import Profile from "@/components/Profile";
import TenantNavbar from "@/components/layout/TenantNavbar";

export default function TenantProfilePage() {
  return <Profile navbar={<TenantNavbar />} role="tenant" />;
}