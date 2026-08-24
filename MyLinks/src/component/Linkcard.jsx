import { Pin, Trash2, Copy, Check, Edit } from "lucide-react";

export default function LinkCard({
  ele,
  idx,
  handleTogglePin,
  handleDelete,
  copyToClipboard,
  copiedId,
  handleEdit,
}) {
  const itemId = ele?.id || ele?._id || idx;
  const isPinned = ele?.isPinned;
  console.log("created at ", ele?.createdAt);

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
            <p className="text-xs text-[#5d786b] truncate">{ele.description}</p>
          )}

          {/* Timestamps Section */}
          <div className="flex items-center gap-3 text-[10px] text-[#5d786b] pt-1 font-mono">
            {ele?.createdAt && (
              <span>
                Created:{" "}
                {new Date(ele.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}

            {ele?.updatedAt && ele.updatedAt !== ele.createdAt && (
              <span className="text-[#238b63] font-medium">
                Updated:{" "}
                {new Date(ele.updatedAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex items-center justify-end sm:justify-start gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#b8ebce]/50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => handleTogglePin(itemId)}
          className={`p-2 rounded-xl transition-all cursor-pointer border ${
            isPinned
              ? "bg-[#238b63] text-white border-[#238b63] shadow-sm"
              : "bg-white text-[#5d786b] border-[#b8ebce] hover:bg-[#dff8e7] hover:text-[#145c43]"
          }`}
          title={isPinned ? "Unpin item" : "Pin item"}
        >
          <Pin size={14} className={isPinned ? "fill-current" : ""} />
        </button>

        <button
          onClick={handleEdit}
          className="p-2 rounded-xl bg-white text-[#5d786b] border border-[#b8ebce] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm"
          title="Edit item"
        >
          <Edit size={14} />
        </button>

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
}
