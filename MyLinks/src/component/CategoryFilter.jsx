export default function CategoryFilters({
  categories,
  filter,
  setFilter,
  itemsList,
}) {
  return (
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

      {categories.map((c) => {
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
  );
}
