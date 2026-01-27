import { CreditCard, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

const TenantPaymentsPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 bg-primary/10 p-6 rounded-2xl border border-primary/20">
        <CreditCard className="w-12 h-12 text-primary" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3 text-text-primary">
        Payments & Rent <br />
        <span className="text-primary">Coming Soon</span>
      </h1>

      <p className="text-text-secondary text-base max-w-md mb-8">
        We are building a clean and secure system to help you 
        track your rent payments and history effortlessly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link href="/tenant/dashboard">
          <button className="primary-btn flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </Link>
        <div className="flex items-center gap-2 text-text-muted text-sm border-l border-border px-4 py-2">
          <ShieldCheck className="w-4 h-4 text-success" />
          Secure Access
        </div>
      </div>
    </div>
  );
};

export default TenantPaymentsPage;
