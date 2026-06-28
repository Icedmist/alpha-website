import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  createdAt: string;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: ""
  });

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners");
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = "/api/partners";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setFormData({ name: "", logoUrl: "", websiteUrl: "" });
        setEditingId(null);
        await fetchPartners();
      } else {
        alert("Failed to save partner.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving partner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setFormData({
      name: partner.name,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPartners(partners.filter(p => p.id !== id));
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", logoUrl: "", websiteUrl: "" });
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="font-display font-black text-4xl text-white uppercase tracking-tighter mb-2">
          Manage Partners
        </h1>
        <p className="text-white/50 text-sm">
          Add, edit, or remove partners shown in the scrolling marquee.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
            <h2 className="font-bold text-lg text-white mb-6 uppercase tracking-wider">
              {editingId ? "Edit Partner" : "Add New Partner"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                  placeholder="e.g. Google"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase mb-2">
                  Logo URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.logoUrl}
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                  placeholder="https://..."
                />
                <p className="text-[10px] text-white/30 mt-1">Provide a direct URL to a greyscale PNG or SVG.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Add Partner"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-xs uppercase transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
              </div>
            ) : partners.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-white/30 py-20">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm">No partners added yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {partners.map(partner => (
                  <div key={partner.id} className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-lg bg-white/10 shrink-0 flex items-center justify-center p-2">
                      <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{partner.name}</h3>
                      {partner.websiteUrl && (
                        <a href={partner.websiteUrl} target="_blank" rel="noreferrer" className="text-[10px] text-brand-orange hover:underline truncate block mt-1">
                          {partner.websiteUrl}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(partner)} className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(partner.id)} className="p-2 text-red-400/50 hover:text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
