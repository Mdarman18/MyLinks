import { X, Plus } from "lucide-react";

export default function Header({ timeStr, showForm, setShowForm }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#173c2e]">
          Link Vault
        </h1>
        <p className="text-xs sm:text-sm text-[#173c2e]/80">
          Your personal hub for links & notes.
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2">
        <span className="text-[11px] xs:text-xs font-mono bg-white/60 backdrop-blur-md px-2.5 py-2 rounded-xl border border-[#b8ebce] shadow-xs inline-block">
          {timeStr}
        </span>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex bg-[#238b63] hover:bg-[#145c43] items-center text-white gap-1.5 active:scale-95 shadow-lg transition-all duration-200 text-sm font-medium px-4 py-2 rounded-xl cursor-pointer"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add New"}
        </button>
      </div>
    </div>
  );
}