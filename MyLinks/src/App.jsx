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
    border: "border-[#087f86]/30",
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
    border: "border-[#438f7c]/30",
  },
  {
    id: "social",
    label: "Social",
    dot: "#238B63",
    bg: "bg-[#6eddb1]/30",
    text: "text-[#176346]",
    border: "border-[#238b63]/30",
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
    <div className="min-h-screen w-full bg-linear-to-r from-[#94ea9c] to-[#6eddb1] text-[#173c2e] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="w-full max-w-2xl mx-auto relative z-10 flex-1">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-[#173c2e]">
                Link Vault
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles size={10} /> Pro
              </span>
            </div>
            <p className="text-sm text-[#173c2e] mt-0.5">
              Your personal hub for links, notes, & passwords.
            </p>
          </div>
          <div className="relative z-30">
            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex bg-[#238b63] items-center text-[#f9f871] gap-1.5  hover:from-blue-500 hover:to-indigo-500 active:scale-95 shadow-lg shadow-blue-500/25 transition-all duration-200  text-sm font-medium px-3.5 py-2 rounded-xl cursor-pointer"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Add New"}
            </button>
          </div>
        </div>

        {/* Time and Date Bar */}
        <div className="mt-2 mb-4 flex items-center justify-between text-xs font-mono bg-[#f2fcf5] px-3 py-2 rounded-xl border border-[#b8ebce] relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[#238b63] font-semibold">{dayStr}</span>
            <span className="text-[#94cdb0]">·</span>
            <span className="text-[#5d786b]">{dateStr}</span>
          </div>

          <span className="tabular-nums text-[#145c43] font-medium">
            {timeStr}
          </span>
        </div>

        {/* Add Link/Note Form Dropdown - High Z-Index to stay on top */}
        {showForm && (
          <div className="absolute top-24 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border border-[#b8ebce] shadow-[0_20px_50px_rgba(20,92,67,0.15)] rounded-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#145c43] flex items-center gap-2">
                <Plus size={14} className="text-[#238b63]" />
                Add Link or Note / Password
              </h3>

              <button
                onClick={() => setShowForm(false)}
                className="text-[#6b8277] hover:text-[#145c43] p-1 rounded-lg hover:bg-[#f2fcf5] cursor-pointer transition-all"
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
                className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#173c2e] placeholder:text-[#8ba99a] transition-all cursor-text"
              />

              <input
                type="text"
                placeholder="URL (Optional - leave empty for notes/passwords)"
                value={form.url}
                onChange={handleUrlChange}
                className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#173c2e] placeholder:text-[#8ba99a] transition-all cursor-text"
              />

              <textarea
                placeholder="Description / Note / Password (Optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="bg-[#f8fdf9] border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#173c2e] placeholder:text-[#8ba99a] transition-all cursor-text resize-none"
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
                        : "border-[#b8ebce] bg-[#f2fcf5] text-[#5d786b] hover:text-[#145c43] hover:bg-[#dff8e7]"
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
                onClick={addLink}
                className="mt-2 bg-[#238b63] hover:bg-[#145c43] active:scale-[0.98] transition-all text-white text-sm font-medium py-2.5 rounded-xl shadow-lg shadow-[#238b63]/20 cursor-pointer"
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
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5d786b] pointer-events-none"
          />

          <input
            type="text"
            placeholder="Search links, notes, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#f8fdf9] backdrop-blur-md border border-[#b8ebce] focus:border-[#6eddb1] focus:ring-2 focus:ring-[#6eddb1]/20 outline-none rounded-xl pl-10 pr-9 py-2.5 text-sm text-[#173c2e] placeholder:text-[#8ba99a] transition-all shadow-inner cursor-text"
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
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filter === "all"
                ? "border-[#6eddb1] bg-[#dff8e7] text-[#145c43] shadow-sm"
                : "border-[#b8ebce] bg-[#f2fcf5] text-[#5d786b] hover:text-[#145c43] hover:bg-[#dff8e7]"
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
                  : "border-[#b8ebce] bg-[#f2fcf5] text-[#5d786b] hover:text-[#145c43] hover:bg-[#dff8e7]"
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

          <div className="mt-4 grid gap-2.5 relative z-10">
            {!loaded && (
              <div className="py-12 text-center text-[#6b8277] text-sm flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#6eddb1] border-t-transparent rounded-full animate-spin" />
                Loading your vault...
              </div>
            )}

            {loaded && filtered.length === 0 && (
              <div className="text-center py-12 border border-dashed border-[#b8ebce] rounded-2xl bg-[#f2fcf5]">
                <p className="text-sm text-[#5d786b] font-medium">
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
                  className="group relative flex flex-col bg-white hover:bg-[#f8fdf9] border border-[#b8ebce] hover:border-[#6eddb1] rounded-2xl p-3.5 transition-all duration-200 hover:shadow-xl hover:shadow-[#238b63]/10 cursor-pointer backdrop-blur-sm gap-2"
                >
                  {/* Left Side: Favicon / Icon + Title */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#f2fcf5] border border-[#b8ebce] flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
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
                          <Link2 size={16} className="text-[#238b63]" />
                        ) : (
                          <FileText size={16} className="text-[#6a9e79]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#173c2e] truncate group-hover:text-[#238b63] transition-colors">
                          {link.title}
                        </p>

                        {hasUrl && (
                          <p className="text-[11px] text-[#7a9689] truncate font-mono">
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
                            className="p-2 rounded-lg text-[#6b8277] hover:text-[#238b63] hover:bg-[#dff8e7] transition-all cursor-pointer"
                          >
                            {isCopied ? (
                              <Check size={15} className="text-[#238b63]" />
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
                          className="p-2 rounded-lg text-[#6b8277] hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description View */}
                  {link.description && (
                    <div
                      onClick={(e) => {
                        if (!hasUrl) {
                          copyToClipboard(e, link.id, link.description);
                        }
                      }}
                      className="mt-1 bg-[#f8fdf9] border border-[#b8ebce] rounded-xl px-3 py-2 text-xs text-[#38594a] font-mono break-all flex items-center justify-between"
                    >
                      <span className="truncate">{link.description}</span>

                      <span className="text-[10px] text-[#8ba99a] ml-2 shrink-0">
                        {isCopied ? "Copied!" : "Click card/copy to copy"}
                      </span>
                    </div>
                  )}
                </CardWrapper>
              );
            })}
          </div>
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
