import { useState, useEffect } from "react";
import { Search, X, Calendar, Home, Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, setUser, togglePin, updateItem } from "./store/slice";
import {
  addData,
  deleteData,
  handleisPinned,
  handleUpdate,
  loadContent,
} from "./services/userServices";
import AddLinkForm from "./component/AddLink";
import CategoryFilters from "./component/CategoryFilter";
import LinkCard from "./component/Linkcard";
import Header from "./component/Header";

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
  const [activeTab, setActiveTab] = useState("home"); // "home" -> Pinned & Today | "all" -> Day-wise list

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  async function handleTogglePin(itemId) {
    await handleisPinned(itemId);
    dispatch(togglePin(itemId));
  }

  const handleEditClick = (ele) => {
    const itemId = ele?.id || ele?._id;
    setForm({
      title: ele.title || "",
      url: ele.url || "",
      description: ele.description || "",
      category: ele.category || "dev",
    });
    setIsEditing(true);
    setEditingId(itemId);
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({ title: "", url: "", description: "", category: "dev" });
    setShowForm(true);
  };

  async function addLink(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please add a title.");
      return;
    }

    try {
      if (isEditing) {
        const updatedItem = await handleUpdate(editingId, form);
        dispatch(updateItem(updatedItem));
      } else {
        await addData(form);
        await loadData();
      }

      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      setForm({ title: "", url: "", description: "", category: "dev" });
      setError("");
    } catch (err) {
      setError("Kuch galat ho gaya, dubara try karo.");
      console.log(err);
    }
  }

  const itemsList = Array.isArray(userState) ? userState : [];

  const sortedItems = [...itemsList].sort((a, b) => {
    if (a?.isPinned === b?.isPinned) return 0;
    return a?.isPinned ? -1 : 1;
  });

  // Today string format matching MongoDB date prefix (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];

  // Filter based on Search and Category
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

  // Home tab items: Pinned or Created Today
  const homeFiltered = filtered.filter((l) => {
    const itemDate = l?.createdAt
      ? new Date(l.createdAt).toISOString().split("T")[0]
      : "";
    return l?.isPinned || itemDate === todayStr;
  });

  // All tab items grouped by date
  const groupedByDate = filtered.reduce((acc, ele) => {
    const dateKey = ele?.createdAt
      ? new Date(ele.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recent Links";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(ele);
    return acc;
  }, {});

  const handleDelete = async (itemId) => {
    try {
      await deleteData(itemId);
      dispatch(deleteUser(itemId));
    } catch (err) {
      console.log("Delete error:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-r from-[#e4f5e6] to-[#6eddb1] text-[#173c2e] flex flex-col justify-between p-3 xs:p-4 sm:p-8 relative overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto relative z-10 flex-1">
        <Header
          timeStr={timeStr}
          showForm={showForm}
          setShowForm={handleAddNewClick}
        />

        {/* --- Navigation Tabs (Home vs All Day-wise) --- */}
        <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-xl border border-[#b8ebce] my-4 shadow-sm">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-[#167F76] text-white shadow"
                : "text-[#3E5F5A] hover:bg-[#dff8e7]"
            }`}
          >
            <Home size={15} />
            Pinned & Today
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#167F76] text-white shadow"
                : "text-[#3E5F5A] hover:bg-[#dff8e7]"
            }`}
          >
            <Calendar size={15} />
            All Data (Day-wise)
          </button>
        </div>

        {showForm && (
          <AddLinkForm
            form={form}
            setForm={setForm}
            addLink={addLink}
            error={error}
            categories={CATEGORIES}
            setShowForm={setShowForm}
            isEditing={isEditing}
          />
        )}

        {/* Search Bar */}
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

        <CategoryFilters
          categories={CATEGORIES}
          filter={filter}
          setFilter={setFilter}
          itemsList={itemsList}
        />

        {!loaded && (
          <div className="py-16 text-center text-[#145c43] text-sm flex flex-col items-center gap-3 bg-white/50 backdrop-blur-md rounded-2xl border border-[#b8ebce] shadow-sm my-4">
            <div className="w-7 h-7 border-3 border-[#238b63] border-t-transparent rounded-full animate-spin" />
            <span className="font-medium tracking-wide">
              Loading your vault...
            </span>
          </div>
        )}

        {/* --- VIEW 1: HOME (Pinned & Today) --- */}
        {loaded && activeTab === "home" && (
          <div className="mt-4 grid gap-3 relative z-10">
            {homeFiltered.length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed border-[#b8ebce] rounded-2xl bg-white/30 backdrop-blur-md my-4">
                <p className="text-sm font-medium text-[#5d786b]">
                  {itemsList.length === 0
                    ? "No links found in your vault yet."
                    : "No pinned or today's links found."}
                </p>
              </div>
            ) : (
              homeFiltered.map((ele, idx) => (
                <LinkCard
                  key={ele?.id || ele?._id || idx}
                  ele={ele}
                  idx={idx}
                  handleTogglePin={handleTogglePin}
                  handleDelete={handleDelete}
                  copyToClipboard={copyToClipboard}
                  copiedId={copiedId}
                  handleEdit={() => handleEditClick(ele)}
                />
              ))
            )}
          </div>
        )}

        {/* --- VIEW 2: ALL DATA (Day-wise grouped list) --- */}
        {loaded && activeTab === "all" && (
          <div className="mt-4 space-y-6 relative z-10">
            {Object.keys(groupedByDate).length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed border-[#b8ebce] rounded-2xl bg-white/30 backdrop-blur-md my-4">
                <p className="text-sm font-medium text-[#5d786b]">
                  No matching links found.
                </p>
              </div>
            ) : (
              Object.entries(groupedByDate).map(([date, dateItems]) => (
                <div key={date} className="space-y-3">
                  {/* Date Header Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-[#167F76]/15 text-[#075F59] rounded-md border border-[#167F76]/20">
                      {date}
                    </span>
                    <div className="h-[1px] flex-1 bg-[#b8ebce]" />
                  </div>

                  {/* Cards for this particular date */}
                  <div className="grid gap-3">
                    {dateItems.map((ele, idx) => (
                      <LinkCard
                        key={ele?.id || ele?._id || idx}
                        ele={ele}
                        idx={idx}
                        handleTogglePin={handleTogglePin}
                        handleDelete={handleDelete}
                        copyToClipboard={copyToClipboard}
                        copiedId={copiedId}
                        handleEdit={() => handleEditClick(ele)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
