"use client";

import Link from "next/link";
import {
  Home,
  Users,
  AlertCircle,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  Building2,
  UserCheck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Banner from "@/components/Banner";
import Banner2 from "@/components/Banner2";
import Testimonial from "@/components/Testimonial";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
    <Navbar/>
    <Hero/> 
    <Services/>
    <Banner/>
    <Banner2/> 
    <Testimonial/>
    <Newsletter/> 
    <Footer/>
    </>
  )
}
// {
//   return (
//     <div className="min-h-screen bg-background text-text-primary">
//       {/* NAVBAR */}
//       <nav className="border-b border-border bg-background sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <img src="/StaySyncLogo.png" alt="StaySync Logo" className="h-8.5 w-8.5" />
//             <h1 className="text-xl font-bold">StaySync</h1>
//           </div>

//           <div className="flex gap-4">
//             <Link href="/signin">
//               <Button className="bg-transparent text-text-primary hover:text-text-primary">
//                 Login
//               </Button>
//             </Link>
//             <Link href="/signup">
//               <Button className="bg-primary hover:bg-primary-dark">
//                 Get Started
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* HERO */}
//       <section className="pt-24 pb-32 text-center">
//         <h1 className="text-5xl md:text-7xl font-bold mb-8">
//           Manage Your Stay
//           <br />
//           <span className="text-primary">Without Chaos</span>
//         </h1>

//         <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
//           A unified stay management platform to manage rooms, residents,
//           issues, and daily operations — all from one place.
//         </p>

//         <Link href="/signup">
//           <Button className="bg-primary hover:bg-primary-dark">
//             Start Managing
//             <ArrowRight className="w-5 h-5 ml-2" />
//           </Button>
//         </Link>
//       </section>

//       {/* ROLES */}
//       <section className="py-24 bg-background-muted">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-4xl font-bold text-center mb-16">
//             Built for Every Role
//           </h2>

//           <div className="grid md:grid-cols-2 gap-8">
//             <RoleCard
//               icon={<LayoutDashboard className="text-primary" />}
//               title="Manager"
//               items={[
//                 "Create and manage rooms or units",
//                 "Assign and remove residents",
//                 "Track occupancy and availability",
//                 "Handle issues and requests",
//               ]}
//             />

//             <RoleCard
//               icon={<Users className="text-secondary" />}
//               title="Resident"
//               items={[
//                 "View room or stay details",
//                 "Raise service or maintenance requests",
//                 "Track request status",
//                 "Manage personal profile",
//               ]}
//             />
//           </div>
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section className="py-24">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-4xl font-bold text-center mb-16">
//             Core Features
//           </h2>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <Feature
//               icon={<Home className="text-primary" />}
//               title="Room & Unit Management"
//               text="Create rooms or units, define capacity, and track availability."
//             />

//             <Feature
//               icon={<UserCheck className="text-secondary" />}
//               title="Resident Assignment"
//               text="Assign residents to rooms or units with proper validation."
//             />

//             <Feature
//               icon={<AlertCircle className="text-error" />}
//               title="Issue & Request Tracking"
//               text="Manage maintenance and service requests with clear status updates."
//             />

//             <Feature
//               icon={<ShieldCheck className="text-primary" />}
//               title="Secure Access Control"
//               text="Role-based access for managers and residents."
//             />

//             <Feature
//               icon={<Building2 className="text-secondary" />}
//               title="Building & Occupancy Tracking"
//               text="Organized structure with real-time occupancy insights."
//             />

//             <Feature
//               icon={<LayoutDashboard className="text-primary-dark" />}
//               title="Dedicated Dashboards"
//               text="Focused dashboards tailored to each role."
//             />
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-24 text-center border-t border-border">
//         <h2 className="text-4xl font-bold mb-6">
//           Ready to Manage Smarter?
//         </h2>
//         <p className="text-lg mb-10 text-text-secondary">
//           Start managing your stay more efficiently today.
//         </p>
//         <Link href="/register">
//           <Button className="bg-primary hover:bg-primary-dark">
//             Get Started
//             <ArrowRight className="w-5 h-5 ml-2" />
//           </Button>
//         </Link>
//       </section>
//     </div>
//   );
// }

// /* ================= COMPONENTS ================= */

// function RoleCard({
//   icon,
//   title,
//   items,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   items: string[];
// }) {
//   return (
//     <div className="border border-border rounded-2xl p-8 bg-background-card hover:border-primary/50 transition">
//       <div className="flex items-center gap-3 mb-6">
//         {icon}
//         <h3 className="text-2xl font-semibold">{title}</h3>
//       </div>
//       <ul className="space-y-3 text-text-secondary">
//         {items.map((item) => (
//           <li key={item}>• {item}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function Feature({
//   icon,
//   title,
//   text,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   text: string;
// }) {
//   return (
//     <div className="border border-border rounded-2xl p-6 bg-background-card hover:border-primary/50 transition">
//       <div className="mb-4 text-2xl">{icon}</div>
//       <h3 className="text-xl font-semibold mb-2">{title}</h3>
//       <p className="text-text-secondary">{text}</p>
//     </div>
//   );
// }
