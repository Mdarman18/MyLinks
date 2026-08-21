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
  Link2,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "dev",
    label: "Dev",
    dot: "#3B82F6",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    id: "salesforce",
    label: "Salesforce",
    dot: "#00A1E0",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
  },
  {
    id: "learning",
    label: "Learning",
    dot: "#F59E0B",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    id: "design",
    label: "Design",
    dot: "#A855F7",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  {
    id: "social",
    label: "Social",
    dot: "#10B981",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    id: "other",
    label: "Other",
    dot: "#6B7280",
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/20",
  },
];

function catInfo(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[5];
}

function faviconFor(url) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return null;
  }
}

export default function App() {
  const [links, setLinks] = useState([]);
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

  const dayStr = now.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("link-vault:items");
        if (res && res.value) setLinks(JSON.parse(res.value));
      } catch {
        // no data yet
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function persist(next) {
    setLinks(next);
    try {
      await window.storage.set("link-vault:items", JSON.stringify(next));
    } catch {
      // ignore write failure
    }
  }

  function normalizeUrl(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
  }

  function handleUrlChange(e) {
    const val = e.target.value;
    let newTitle = form.title;

    if (!form.title || form.title === autoTitleFromUrl(form.url)) {
      newTitle = autoTitleFromUrl(val);
    }

    setForm({ ...form, url: val, title: newTitle });
  }

  function autoTitleFromUrl(urlStr) {
    try {
      const formatted = normalizeUrl(urlStr);
      const u = new URL(formatted);
      let hostname = u.hostname.replace(/^www\./, "");
      const parts = hostname.split(".");
      if (parts.length > 0) {
        const name = parts[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
      return hostname;
    } catch {
      return "";
    }
  }

  function addLink() {
    const title = form.title.trim();
    const url = form.url.trim() ? normalizeUrl(form.url) : "";
    const description = form.description.trim();

    if (!title) {
      setError("Please add a title.");
      return;
    }
    if (!url && !description) {
      setError("Please add either a URL or a description/password.");
      return;
    }
    if (url) {
      try {
        new URL(url);
      } catch {
        setError("That link doesn't look valid.");
        return;
      }
    }

    const item = {
      id: Date.now().toString(36),
      title,
      url,
      description,
      category: form.category,
    };
    persist([item, ...links]);
    setForm({ title: "", url: "", description: "", category: "dev" });
    setError("");
    setShowForm(false);
  }

  function removeLink(id) {
    persist(links.filter((l) => l.id !== id));
  }

  function copyToClipboard(e, id, textToCopy) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filtered = links.filter((l) => {
    const matchesCat = filter === "all" || l.category === filter;
    const matchesQuery =
      !query.trim() ||
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.url.toLowerCase().includes(query.toLowerCase()) ||
      (l.description &&
        l.description.toLowerCase().includes(query.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const counts = CATEGORIES.reduce((acc, c) => {
    acc[c.id] = links.filter((l) => l.category === c.id).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="w-full max-w-2xl mx-auto relative z-10 flex-1">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Link Vault
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles size={10} /> Pro
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Your personal hub for links, notes, & passwords.
            </p>
          </div>
          <div className="relative z-30">
            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 shadow-lg shadow-blue-500/25 transition-all duration-200 text-white text-sm font-medium px-3.5 py-2 rounded-xl cursor-pointer"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Add New"}
            </button>
          </div>
        </div>

        {/* Time and Date Bar */}
        <div className="mt-2 mb-4 flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-semibold">{dayStr}</span>
            <span>·</span>
            <span>{dateStr}</span>
          </div>
          <span className="tabular-nums text-slate-200 font-medium">
            {timeStr}
          </span>
        </div>

        {/* Add Link/Note Form Dropdown - High Z-Index to stay on top */}
        {showForm && (
          <div className="absolute top-24 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-2xl border border-blue-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Plus size={14} className="text-blue-400" /> Add Link or Note /
                Password
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-all"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-3">
              <input
                type="text"
                placeholder="Title (e.g., Gmail Password or GitHub Link)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-slate-950/90 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none rounded-xl px-3.5 py-2.5 text-sm placeholder:text-slate-600 transition-all cursor-text"
              />
              <input
                type="text"
                placeholder="URL (Optional - leave empty for notes/passwords)"
                value={form.url}
                onChange={handleUrlChange}
                className="bg-slate-950/90 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none rounded-xl px-3.5 py-2.5 text-sm font-mono placeholder:text-slate-600 transition-all cursor-text"
              />
              <textarea
                placeholder="Description / Note / Password (Optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="bg-slate-950/90 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none rounded-xl px-3.5 py-2.5 text-sm placeholder:text-slate-600 transition-all cursor-text resize-none"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm({ ...form, category: c.id })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      form.category === c.id
                        ? `${c.bg} ${c.text} ${c.border} shadow-sm scale-105`
                        : "border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
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
                <p className="text-xs text-rose-400 font-medium">{error}</p>
              )}
              <button
                onClick={addLink}
                className="mt-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all text-white text-sm font-medium py-2.5 rounded-xl shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                Save to Vault
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mt-5 relative z-10">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search links, notes, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none rounded-xl pl-10 pr-9 py-2.5 text-sm placeholder:text-slate-500 transition-all shadow-inner cursor-text"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-0.5 rounded-md hover:bg-slate-800"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Categories Filter Tabs */}
        <div className="mt-3.5 flex flex-wrap gap-1.5 relative z-10">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filter === "all"
                ? "border-slate-600 bg-slate-800 text-white shadow-sm"
                : "border-slate-800/60 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            All <span className="opacity-60 ml-1">({links.length})</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                filter === c.id
                  ? `${c.bg} ${c.text} ${c.border} shadow-sm`
                  : "border-slate-800/60 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: c.dot }}
              />
              {c.label}{" "}
              <span className="opacity-60">({counts[c.id] || 0})</span>
            </button>
          ))}
        </div>

        {/* Links List */}
        <div className="mt-4 grid gap-2.5 relative z-10">
          {!loaded && (
            <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Loading your vault...
            </div>
          )}

          {loaded && filtered.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/20">
              <p className="text-sm text-slate-400 font-medium">
                {links.length === 0
                  ? "Your vault is empty. Add your first item above!"
                  : "No matching items found."}
              </p>
            </div>
          )}

          {filtered.map((link) => {
            const cat = catInfo(link.category);
            const favicon = link.url ? faviconFor(link.url) : null;
            const isCopied = copiedId === link.id;
            const hasUrl = Boolean(link.url);

            const CardWrapper = hasUrl ? "a" : "div";
            const wrapperProps = hasUrl
              ? {
                  href: link.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {};

            return (
              <CardWrapper
                key={link.id}
                {...wrapperProps}
                className="group relative flex flex-col bg-slate-900/75 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-3.5 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer backdrop-blur-sm gap-2"
              >
                <div className="flex items-center justify-between">
                  {/* Left Side: Favicon / Icon + Title */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                      {favicon ? (
                        <img
                          src={favicon}
                          alt=""
                          className="w-5 h-5 rounded-sm"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : hasUrl ? (
                        <Link2 size={16} className="text-blue-400" />
                      ) : (
                        <FileText size={16} className="text-amber-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                        {link.title}
                      </p>
                      {hasUrl && (
                        <p className="text-[11px] text-slate-500 truncate font-mono">
                          {link.url}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Category Badge + Actions */}
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full hidden sm:inline border"
                      style={{
                        backgroundColor: `${cat.dot}15`,
                        color: cat.dot,
                        borderColor: `${cat.dot}30`,
                      }}
                    >
                      {cat.label}
                    </span>

                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {link.description && (
                        <button
                          onClick={(e) =>
                            copyToClipboard(e, link.id, link.description)
                          }
                          title="Copy Note/Password"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 transition-all cursor-pointer"
                        >
                          {isCopied ? (
                            <Check size={15} className="text-emerald-400" />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeLink(link.id);
                        }}
                        title="Delete"
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description View (if available) */}
                {link.description && (
                  <div
                    onClick={(e) => {
                      if (!hasUrl) {
                        copyToClipboard(e, link.id, link.description);
                      }
                    }}
                    className="mt-1 bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono break-all flex items-center justify-between"
                  >
                    <span className="truncate">{link.description}</span>
                    <span className="text-[10px] text-slate-500 ml-2 shrink-0">
                      {isCopied ? "Copied!" : "Click card/copy to copy"}
                    </span>
                  </div>
                )}
              </CardWrapper>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full max-w-2xl mx-auto mt-10 pt-4 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        <p>© {new Date().getFullYear()} Link Vault. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with{" "}
          <Heart size={12} className="text-rose-500 fill-rose-500" /> for daily
          productivity.
        </p>
      </footer>
    </div>
  );
}
