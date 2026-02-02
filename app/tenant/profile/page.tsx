import Profile from "@/components/home/Profile";
import TenantNavbar from "@/components/layout/TenantNavbar";

export default function TenantProfilePage() {
  return <Profile navbar={<TenantNavbar />} role="tenant" />;
}