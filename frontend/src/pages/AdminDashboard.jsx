import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";
import { LogOut, Plus, Pencil, Trash2, Loader2, X, Package, Save } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "../components/Logo";

const emptyProduct = {
  name: "",
  tagline: "",
  category: "general",
  price: 0,
  old_price: 0,
  short_description: "",
  description: "",
  image: "",
  images: [],
  benefits: [],
  bullets: [],
  stock: 20,
  rating: 4.8,
  reviews_count: 0,
  units_sold: 0,
  paperform_url: "",
  offer_ends_in_hours: 24,
  active: true,
  
  // Problem section fields
  problem_points: [],
  problem_image: "",
  problem_gif: "",
  
  // Truth/consequences section fields
  consequences: [],
  truth_image: "",
  truth_gif: "",
  
  // Solution section fields
  solution_points: [],
  solution_images: [],
  demo_video: "",
  demo_gif: "",
};

const CATEGORIES = [
  { value: "general", label: "General · Verde brand" },
  { value: "industrial", label: "Casă & Reparații · Roșu industrial" },
  { value: "auto", label: "Auto & Moto · Albastru navy" },
  { value: "home", label: "Casă & Living · Teal" },
  { value: "beauty", label: "Beauty & Cosmetice · Roz" },
  { value: "tech", label: "Tech & Gadgets · Cyan" },
  { value: "fitness", label: "Sport & Fitness · Portocaliu energic" },
  { value: "kitchen", label: "Bucătărie & Gătit · Amber" },
  { value: "kids", label: "Copii & Jucării · Galben playful" },
  { value: "pets", label: "Animale de companie · Amber cald" },
  { value: "garden", label: "Grădină & Terasă · Emerald" },
  { value: "fashion", label: "Modă & Accesorii · Violet" },
  { value: "health", label: "Sănătate & Wellness · Sky blue" },
];

const AdminDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/admin/login");
  }, [user, loading, navigate]);

  const loadProducts = () => {
    setFetching(true);
    api.get("/admin/products")
      .then((r) => setProducts(r.data))
      .catch(() => toast.error("Eroare la încărcare"))
      .finally(() => setFetching(false));
  };

  useEffect(() => { if (user) loadProducts(); }, [user]);

  const onLogout = () => { logout(); navigate("/admin/login"); };
  const openNew = () => { setEditing({ ...emptyProduct }); setShowForm(true); };
  const openEdit = (p) => { setEditing({ ...p }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const onSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editing,
        price: parseFloat(editing.price) || 0,
        old_price: editing.old_price ? parseFloat(editing.old_price) : null,
        stock: parseInt(editing.stock) || 0,
        rating: parseFloat(editing.rating) || 0,
        reviews_count: parseInt(editing.reviews_count) || 0,
        units_sold: parseInt(editing.units_sold) || 0,
        offer_ends_in_hours: parseInt(editing.offer_ends_in_hours) || 24,
        benefits: Array.isArray(editing.benefits)
          ? editing.benefits
          : String(editing.benefits || "").split("\n").map(s => s.trim()).filter(Boolean),
        bullets: Array.isArray(editing.bullets)
          ? editing.bullets
          : String(editing.bullets || "").split("\n").map(s => s.trim()).filter(Boolean),
        images: Array.isArray(editing.images)
          ? editing.images
          : String(editing.images || "").split("\n").map(s => s.trim()).filter(Boolean),
        // Problem section
        problem_points: Array.isArray(editing.problem_points)
          ? editing.problem_points
          : String(editing.problem_points || "").split("\n").map(s => s.trim()).filter(Boolean),
        // Consequences section
        consequences: Array.isArray(editing.consequences)
          ? editing.consequences
          : String(editing.consequences || "").split("\n").map(s => s.trim()).filter(Boolean),
        // Solution section
        solution_points: Array.isArray(editing.solution_points)
          ? editing.solution_points
          : String(editing.solution_points || "").split("\n").map(s => s.trim()).filter(Boolean),
        solution_images: Array.isArray(editing.solution_images)
          ? editing.solution_images
          : String(editing.solution_images || "").split("\n").map(s => s.trim()).filter(Boolean),
      };
      if (editing.id) {
        await api.put(`/admin/products/${editing.id}`, payload);
        toast.success("Produs actualizat");
      } else {
        await api.post("/admin/products", payload);
        toast.success("Produs creat");
      }
      closeForm();
      loadProducts();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Eroare la salvare");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p) => {
    if (!window.confirm(`Ștergi produsul "${p.name}"?`)) return;
    try {
      await api.delete(`/admin/products/${p.id}`);
      toast.success("Produs șters");
      loadProducts();
    } catch {
      toast.error("Eroare la ștergere");
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-ink-50" data-testid="admin-dashboard">
      <header className="bg-white border-b border-ink-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-ink-900 flex items-center justify-center">
              <Logo className="h-5 w-5 text-white" />
            </div>
            <div className="font-display font-extrabold text-ink-900">KINT Store Admin</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-600 hidden sm:inline">{user.email}</span>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 text-sm text-ink-700 hover:text-red-600 transition-colors font-medium"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-4 h-4" /> Ieșire
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-ink-900 font-extrabold">Produse</h1>
            <p className="text-sm text-ink-500 mt-1">{products.length} produse în catalog</p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold px-4 py-2.5 rounded-md transition-all hover:-translate-y-0.5"
            data-testid="add-product-btn"
          >
            <Plus className="w-4 h-4" /> Adaugă produs
          </button>
        </div>

        {fetching ? (
          <div className="text-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-500 inline" /></div>
        ) : (
          <div className="bg-white border border-ink-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-200">
                <tr className="text-left text-xs uppercase tracking-wider text-ink-600">
                  <th className="px-5 py-3">Produs</th>
                  <th className="px-5 py-3">Categorie</th>
                  <th className="px-5 py-3">Preț</th>
                  <th className="px-5 py-3">Stoc</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/50" data-testid={`product-row-${p.id}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.image && <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-md" />}
                        <div>
                          <div className="font-semibold text-ink-900">{p.name}</div>
                          <div className="text-xs text-ink-500">/product/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs uppercase tracking-wider font-bold text-ink-700">{p.category || "general"}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-ink-900">{p.price?.toFixed(2)} lei</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold ${p.stock <= 10 ? "text-orange-600" : "text-ink-700"}`}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.active ? "bg-emerald-50 text-emerald-700" : "bg-ink-100 text-ink-500"}`}>
                        {p.active ? "Activ" : "Inactiv"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-ink-600 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" data-testid={`edit-product-${p.id}`}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(p)} className="p-2 text-ink-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors" data-testid={`delete-product-${p.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Edit/Create Drawer */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 backdrop-blur-sm" onClick={closeForm}>
          <div
            className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="product-form-drawer"
          >
            <div className="sticky top-0 z-10 bg-white border-b border-ink-200 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-ink-900">
                {editing.id ? "Editează produs" : "Adaugă produs nou"}
              </h2>
              <button onClick={closeForm} className="p-1.5 text-ink-500 hover:text-ink-900 rounded transition-colors" data-testid="close-form-btn">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <Field label="Nume produs" value={editing.name} onChange={(v) => setEditing({...editing, name: v})} testid="form-name" />
              <Field label="Tagline (sub categorie pe landing page)" value={editing.tagline} onChange={(v) => setEditing({...editing, tagline: v})} testid="form-tagline" placeholder="Ex: Rezistă până la 1420 kg" />

              <div>
                <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider">Categorie (definește tema vizuală)</label>
                <select
                  value={editing.category || "general"}
                  onChange={(e) => setEditing({...editing, category: e.target.value})}
                  data-testid="form-category"
                  className="mt-1.5 w-full rounded-md border border-ink-300 px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <Field label="Descriere scurtă" value={editing.short_description} onChange={(v) => setEditing({...editing, short_description: v})} testid="form-short-desc" />
              <Field label="Descriere completă" value={editing.description} onChange={(v) => setEditing({...editing, description: v})} multiline testid="form-desc" />

              <div className="grid grid-cols-2 gap-4">
                <Field label="Preț (lei)" type="number" value={editing.price} onChange={(v) => setEditing({...editing, price: v})} testid="form-price" />
                <Field label="Preț vechi (lei)" type="number" value={editing.old_price || ""} onChange={(v) => setEditing({...editing, old_price: v})} testid="form-old-price" />
                <Field label="Stoc" type="number" value={editing.stock} onChange={(v) => setEditing({...editing, stock: v})} testid="form-stock" />
                <Field label="Oferta expiră în (ore)" type="number" value={editing.offer_ends_in_hours} onChange={(v) => setEditing({...editing, offer_ends_in_hours: v})} testid="form-offer-hours" />
                <Field label="Rating (0-5)" type="number" value={editing.rating} onChange={(v) => setEditing({...editing, rating: v})} testid="form-rating" />
                <Field label="Nr. recenzii" type="number" value={editing.reviews_count} onChange={(v) => setEditing({...editing, reviews_count: v})} testid="form-reviews-count" />
                <Field label="Unități vândute" type="number" value={editing.units_sold} onChange={(v) => setEditing({...editing, units_sold: v})} testid="form-units-sold" />
              </div>

              <Field label="Imagine principală (URL)" value={editing.image} onChange={(v) => setEditing({...editing, image: v})} testid="form-image" />
              <Field
                label="Imagini suplimentare (un URL per linie)"
                value={Array.isArray(editing.images) ? editing.images.join("\n") : editing.images}
                onChange={(v) => setEditing({...editing, images: v})}
                multiline testid="form-images"
              />
              <Field
                label="Bullet points (3-4, scurte — apar lângă preț)"
                value={Array.isArray(editing.bullets) ? editing.bullets.join("\n") : editing.bullets}
                onChange={(v) => setEditing({...editing, bullets: v})}
                multiline testid="form-bullets"
                placeholder="Ex: Rezistă până la 1420 kg"
              />
              <Field
                label="Beneficii (apar în secțiunea de beneficii)"
                value={Array.isArray(editing.benefits) ? editing.benefits.join("\n") : editing.benefits}
                onChange={(v) => setEditing({...editing, benefits: v})}
                multiline testid="form-benefits"
              />
              <Field label="Link Paperform" value={editing.paperform_url} onChange={(v) => setEditing({...editing, paperform_url: v})} placeholder="https://..." testid="form-paperform" />

              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={!!editing.active}
                  onChange={(e) => setEditing({...editing, active: e.target.checked})}
                  className="w-4 h-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
                  data-testid="form-active"
                />
                Produs activ (vizibil pe site)
              </label>
            </div>

            {/* Problem Section */}
            <div className="border-t border-ink-200 px-6 py-4">
              <h3 className="font-display font-extrabold text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">✕</span>
                Secțiunea: Problema
              </h3>
              <Field
                label="Puncte problemă (unul per linie, max 4)"
                value={Array.isArray(editing.problem_points) ? editing.problem_points.join("\n") : editing.problem_points}
                onChange={(v) => setEditing({...editing, problem_points: v})}
                multiline testid="form-problem-points"
                placeholder="Ex: Se rupe după prima utilizare"
              />
              <Field label="Imagine problemă (URL)" value={editing.problem_image} onChange={(v) => setEditing({...editing, problem_image: v})} testid="form-problem-image" placeholder="https://..." />
              <Field label="GIF problemă (URL - are prioritate)" value={editing.problem_gif} onChange={(v) => setEditing({...editing, problem_gif: v})} testid="form-problem-gif" placeholder="https://..." />
            </div>

            {/* Truth/Consequences Section */}
            <div className="border-t border-ink-200 px-6 py-4">
              <h3 className="font-display font-extrabold text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">⚠️</span>
                Secțiunea: Adevărul Dur
              </h3>
              <Field
                label="Consecințe (unul per linie, max 4)"
                value={Array.isArray(editing.consequences) ? editing.consequences.join("\n") : editing.consequences}
                onChange={(v) => setEditing({...editing, consequences: v})}
                multiline testid="form-consequences"
                placeholder="Ex: Problema se agravează în timp"
              />
              <Field label="Imagine adevăr dur (URL)" value={editing.truth_image} onChange={(v) => setEditing({...editing, truth_image: v})} testid="form-truth-image" placeholder="https://..." />
              <Field label="GIF adevăr dur (URL - are prioritate)" value={editing.truth_gif} onChange={(v) => setEditing({...editing, truth_gif: v})} testid="form-truth-gif" placeholder="https://..." />
            </div>

            {/* Solution Section */}
            <div className="border-t border-ink-200 px-6 py-4">
              <h3 className="font-display font-extrabold text-ink-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">✨</span>
                Secțiunea: Soluția
              </h3>
              <Field
                label="Puncte soluție (unul per linie, max 6)"
                value={Array.isArray(editing.solution_points) ? editing.solution_points.join("\n") : editing.solution_points}
                onChange={(v) => setEditing({...editing, solution_points: v})}
                multiline testid="form-solution-points"
                placeholder="Ex: Rezolvă problema în 30 secunde"
              />
              <Field
                label="Imagini soluție (un URL per linie)"
                value={Array.isArray(editing.solution_images) ? editing.solution_images.join("\n") : editing.solution_images}
                onChange={(v) => setEditing({...editing, solution_images: v})}
                multiline testid="form-solution-images"
              />
              <Field label="Video demo (URL)" value={editing.demo_video} onChange={(v) => setEditing({...editing, demo_video: v})} testid="form-demo-video" placeholder="https://..." />
              <Field label="GIF demo (URL)" value={editing.demo_gif} onChange={(v) => setEditing({...editing, demo_gif: v})} testid="form-demo-gif" placeholder="https://..." />
            </div>

            <div className="sticky bottom-0 bg-white border-t border-ink-200 px-6 py-4 flex justify-start gap-3">
              <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold px-5 py-2 rounded-md transition-all disabled:opacity-50"
                data-testid="save-product-btn"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvează
              </button>
              <button onClick={closeForm} className="px-4 py-2 text-sm text-ink-700 hover:bg-ink-100 rounded-md transition-colors">
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", multiline = false, placeholder = "", testid }) => (
  <div>
    <label className="text-xs font-semibold text-ink-700 uppercase tracking-wider">{label}</label>
    {multiline ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        data-testid={testid}
        className="mt-1.5 w-full rounded-md border border-ink-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
    ) : (
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={testid}
        step={type === "number" ? "0.01" : undefined}
        className="mt-1.5 w-full rounded-md border border-ink-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
    )}
  </div>
);

export default AdminDashboard;
