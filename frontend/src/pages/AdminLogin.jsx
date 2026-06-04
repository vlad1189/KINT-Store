import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "../components/Logo";

const AdminLogin = () => {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Bine ai revenit!");
      navigate("/admin");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Eroare la autentificare");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="bg-white border border-ink-200 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-xl bg-ink-900 flex items-center justify-center">
              <Logo className="h-9 w-9 text-white" />
            </div>
            <h1 className="font-display text-2xl text-ink-900 mt-4 font-extrabold">Admin KINT Store</h1>
            <p className="text-sm text-ink-500 mt-1">Autentifică-te pentru a continua</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kshopping.ro"
                className="mt-1.5 w-full rounded-md border border-ink-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                data-testid="admin-login-email"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider">Parolă</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-md border border-ink-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                data-testid="admin-login-password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="admin-login-submit"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              Autentificare
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-500 mt-6">
          © {new Date().getFullYear()} KINT Store. Admin panel.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
