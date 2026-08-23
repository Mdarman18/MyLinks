import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Search,
  X,
  Copy,
  Check,
  Sparkles,
  Heart,
  FileText,
  Pin,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, setUser } from "./store/slice";
import { addData, deleteData, loadContent } from "./services/userServices";
import { persistor } from "./store/store";

const CATEGORIES = [
  {
    id: "dev",
    label: "Dev",
    dot: "#167F76",
    bg: "bg-[#5bcdbf]/25",
    text: "text-[#075F59]",
    border: "border-[#167f76]/30",
  },
  {
    id: "salesforce",
    label: "Salesforce",
    dot: "#087F86",
    bg: "bg-[#5bcdbf]/20",
    text: "text-[#075F65]",
    border: "border-[#087f65]/30",
  },
  {
    id: "learning",
    label: "Learning",
    dot: "#638F20",
    bg: "bg-[#c3f384]/35",
    text: "text-[#4D7015]",
    border: "border-[#638f20]/30",
  },
  {
    id: "design",
    label: "Design",
    dot: "#438F7C",
    bg: "bg-[#82dcc5]/25",
    text: "text-[#286B5B]",
    border: "border-[#286f7c]/30",
  },
  {
    id: "social",
    label: "Social",
    dot: "#238B63",
    bg: "bg-[#6eddb1]/30",
    text: "text-[#176346]",
    border: "border-[#176346]/30",
  },
  {
    id: "other",
    label: "Other",
    dot: "#527873",
    bg: "bg-[#7fa9a2]/25",
    text: "text-[#3E5F5A]",
    border: "border-[#527873]/30",
  },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "dev",
  });
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [now, setNow] = useState(new Date());

  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user.user);

  const loadData = async () => {
    try {
      const data = await loadContent();
      dispatch(setUser(data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  function copyToClipboard(e, id, textToCopy) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Real-time Pin/Unpin handler
  function handleTogglePin(itemId) {
    const updatedList = itemsList.map((item) => {
      const currentId = item?.id || item?._id;
      if (currentId === itemId) {
        return { ...item, isPinned: !item.isPinned };
      }
      return item;
    });
    dispatch(setUser(updatedList));
  }
  async function addLink(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please add a title.");
      return;
    }

    try {
      const newItem = await addData(form);
      dispatch(setUser(newItem));
      setShowForm(false);
      setForm({ title: "", url: "", description: "", category: "dev" });
      setError("");
    } catch (err) {
      setError("Kuch galat ho gaya, dubara try karo.");
      console.log(err);
    }
  }

  const itemsList = Array.isArray(userState) ? userState : [];

  // Optional: Pin kiye hue items ko upar dikhane ke liye sort kar sakte hain
  const sortedItems = [...itemsList].sort((a, b) => {
    if (a?.isPinned === b?.isPinned) return 0;
    return a?.isPinned ? -1 : 1;
  });

  const filtered = sortedItems.filter((l) => {
    const matchesCat = filter === "all" || l?.category === filter;
    const matchesQuery =
      !query.trim() ||
      l?.title?.toLowerCase().includes(query.toLowerCase()) ||
      l?.url?.toLowerCase().includes(query.toLowerCase()) ||
      (l?.description &&
        l?.description.toLowerCase().includes(query.toLowerCase()));
    return matchesCat && matchesQuery;
  });
  const handleDelete = async (itemId) => {
    const previousItems = [...itemsList];
    const optimisticList = itemsList.filter((item) => {
      const currentId = item?.id || item?._id;
      return currentId !== itemId;
    });
    dispatch(setUser(optimisticList));
    try {
      await deleteData(itemId);
    } catch (err) {
      console.log("Delete error:", err);
      dispatch(setUser(previousItems));
      alert("Failed to delete item. Please try again.");
    }
  };
  return (
    <div className="min-h-screen w-full bg-linear-to-r from-[#e4f5e6] to-[#6eddb1] text-[#173c2e] flex flex-col justify-between p-3 xs:p-4 sm:p-8 relative overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto relative z-10 flex-1">
        {/* Header Title Section & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#173c2e]">
              Link Vault
            </h1>
            <p className="text-xs sm:text-sm text-[#173c2e]/80">
              Your personal hub for links & notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-white/60 backdrop-blur-md px-3 py-2 rounded-xl border border-[#b8ebce] shadow-xs hidden sm:inline-block">
              {timeStr}
            </span>
            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex bg-[#238b63] hover:bg-[#145c43] items-center text-white gap-1.5 active:scale-95 shadow-lg transition-all duration-200 text-sm font-medium px-4 py-2 rounded-xl cursor-pointer w-full sm:w-auto justify-center"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Add New"}
            </button>
          </div>
        </div>

        {/* Add Link Form Modal / Dropdown */}
        {showForm && (
          <div className="mb-6 bg-white/95 backdrop-blur-2xl border border-[#b8ebce] shadow-xl rounded-2xl p-4 sm:p-5 animate-in fade-in duration-200">
            <h3 className="text-sm font-semibold text-[#145c43] mb-3 flex items-center gap-2">
              <Plus size={14} className="text-[#238b63]" />
              Add New Link or Note
            </h3>

            <form onSubmit={addLink} className="grid gap-3">
              <input
                type="text"
                placeholder="Title (e.g., GitHub Repo)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#173c2e] placeholder:text-[#8ba99a]"
              />

              <input
                type="text"
                placeholder="URL (As-is user entered)"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#173c2e] placeholder:text-[#8ba99a]"
              />

              <textarea
                placeholder="Description / Note (Optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#173c2e] placeholder:text-[#8ba99a] resize-none"
              />

              {/* Categories Selection for Form */}
              <div className="flex flex-wrap gap-2 pt-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
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

              {error && (
                <p className="text-xs text-rose-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                className="mt-2 bg-[#238b63] hover:bg-[#145c43] active:scale-[0.98] transition-all text-white text-sm font-medium py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                Save to Vault
              </button>
            </form>
          </div>
        )}

        {/* Search Bar Section */}
        <div className="mt-4 relative z-10">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5d786b] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search links, notes, or descriptions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-md border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl pl-10 pr-9 py-2.5 text-sm text-[#173c2e] placeholder:text-[#8ba99a] transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b8277] hover:text-[#145c43] cursor-pointer p-0.5 rounded-md hover:bg-[#dff8e7] transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Categories Filter Tabs */}
        <div className="mt-3.5 flex flex-wrap gap-1.5 relative z-10">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filter === "all"
                ? "border-[#6eddb1] bg-white text-[#145c43] shadow-sm font-bold"
                : "border-[#b8ebce] bg-white/50 text-[#5d786b] hover:text-[#145c43]"
            }`}
          >
            All <span className="opacity-60 ml-1">({itemsList.length})</span>
          </button>

          {CATEGORIES.map((c) => {
            const count = itemsList.filter((l) => l?.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  filter === c.id
                    ? `${c.bg} ${c.text} ${c.border} shadow-sm font-bold`
                    : "border-[#b8ebce] bg-white/50 text-[#5d786b] hover:text-[#145c43]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: c.dot }}
                />
                {c.label} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Loading Effect */}
        {!loaded && (
          <div className="py-16 text-center text-[#145c43] text-sm flex flex-col items-center gap-3 bg-white/50 backdrop-blur-md rounded-2xl border border-[#b8ebce] shadow-sm my-4">
            <div className="w-7 h-7 border-3 border-[#238b63] border-t-transparent rounded-full animate-spin" />
            <span className="font-medium tracking-wide">
              Loading your vault...
            </span>
          </div>
        )}

        {/* Empty State */}
        {loaded && filtered.length === 0 && (
          <div className="text-center py-16 px-4 border border-dashed border-[#b8ebce] rounded-2xl bg-white/30 backdrop-blur-md my-4">
            <p className="text-sm font-medium text-[#5d786b]">
              {itemsList.length === 0
                ? "No links found in your vault yet."
                : "No matching links found."}
            </p>
          </div>
        )}

        {/* Main List Container */}
        <div className="mt-4 grid gap-3 relative z-10">
          {loaded &&
            filtered.map((ele, idx) => {
              const itemId = ele?.id || ele?._id || idx;
              const isPinned = ele?.isPinned;

              return (
                <div
                  key={itemId}
                  className={`group relative overflow-hidden backdrop-blur-xl border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isPinned
                      ? "bg-[#e8f8ed] border-[#5bcdbf] shadow-md ring-1 ring-[#238b63]/30"
                      : "bg-white/85 border-[#b8ebce] hover:border-[#6eddb1]"
                  }`}
                >
                  {/* Left Side: Details */}
                  <div className="flex items-start gap-3.5 overflow-hidden flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#dff8e7] text-[#238b63] flex items-center justify-center shrink-0 font-bold text-sm shadow-inner uppercase">
                      {ele?.title ? ele.title.charAt(0) : "🔗"}
                    </div>

                    <div className="overflow-hidden space-y-1 w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-[#173c2e] truncate">
                          {ele?.title}
                        </h3>

                        {ele?.category && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#238b63]/10 text-[#238b63] border border-[#238b63]/25 capitalize">
                            {ele.category}
                          </span>
                        )}

                        {isPinned && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
                            Pinned
                          </span>
                        )}
                      </div>

                      {ele?.url && (
                        <div className="flex items-center gap-2">
                          <a
                            href={ele.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#238b63] hover:underline font-mono truncate block"
                          >
                            {ele.url}
                          </a>
                          <button
                            onClick={(e) => copyToClipboard(e, itemId, ele.url)}
                            className="text-[#5d786b] hover:text-[#145c43] p-1 rounded transition-colors"
                            title="Copy URL"
                          >
                            {copiedId === itemId ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      )}

                      {ele?.description && (
                        <p className="text-xs text-[#5d786b] truncate">
                          {ele.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Action Buttons (Hover par show honge) */}
                  <div className="flex items-center justify-end sm:justify-start gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#b8ebce]/50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Pin / Unpin Button */}
                    <button
                      onClick={() => handleTogglePin(itemId)}
                      className={`p-2 rounded-xl transition-all cursor-pointer border ${
                        isPinned
                          ? "bg-[#238b63] text-white border-[#238b63] shadow-sm"
                          : "bg-white text-[#5d786b] border-[#b8ebce] hover:bg-[#dff8e7] hover:text-[#145c43]"
                      }`}
                      title={isPinned ? "Unpin item" : "Pin item"}
                    >
                      <Pin
                        size={14}
                        className={isPinned ? "fill-current" : ""}
                      />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        // Edit logic ya modal open karne ke liye yahan likh sakte hain
                      }}
                      className="p-2 rounded-xl bg-white text-[#5d786b] border border-[#b8ebce] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm"
                      title="Edit item"
                    >
                      <Sparkles size={14} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(itemId)}
                      className="p-2 rounded-xl bg-white text-rose-400 border border-[#b8ebce] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer shadow-sm"
                      title="Delete item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
