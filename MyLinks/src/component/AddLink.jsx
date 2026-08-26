import { Plus, Loader2 } from "lucide-react";

export default function AddLinkForm({
  form,
  setForm,
  addLink,
  error,
  categories,
  setShowForm,
  isEditing,
  loading = false, // <-- Loading prop accept kiya
}) {
  return (
    <div className="mb-6 bg-white/95 backdrop-blur-2xl border border-[#b8ebce] shadow-xl rounded-2xl p-4 sm:p-5 animate-in fade-in duration-200">
      <h3 className="text-sm font-semibold text-[#145c43] mb-3 flex items-center gap-2">
        <Plus size={14} className="text-[#238b63]" />
        {isEditing ? "Edit Link or Note" : "Add New Link or Note"}
      </h3>

      <form onSubmit={addLink} className="grid gap-3">
        <input
          type="text"
          placeholder="Title (e.g., GitHub Repo)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          disabled={loading}
          className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#173c2e] placeholder:text-[#8ba99a] disabled:opacity-50"
        />

        <input
          type="text"
          placeholder="URL (As-is user entered)"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          disabled={loading}
          className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#173c2e] placeholder:text-[#8ba99a] disabled:opacity-50"
        />

        <textarea
          placeholder="Description / Note (Optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          disabled={loading}
          className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#173c2e] placeholder:text-[#8ba99a] resize-none disabled:opacity-50"
        />

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={loading}
              onClick={() => setForm({ ...form, category: c.id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                form.category === c.id
                  ? `${c.bg} ${c.text} ${c.border} shadow-sm scale-105`
                  : "border-[#b8ebce] bg-[#f2fcf5] text-[#5d786b] hover:text-[#145c43]"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: c.dot }}
              />
              {c.label}
            </button>
          ))}
        </div>

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-[#238b63] hover:bg-[#145c43] active:scale-[0.98] transition-all text-white text-sm font-medium py-2.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {isEditing ? "Updating..." : "Saving to Vault..."}
            </>
          ) : isEditing ? (
            "Update Link"
          ) : (
            "Save to Vault"
          )}
        </button>
      </form>
    </div>
  );
}
