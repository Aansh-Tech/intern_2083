import { useEffect, useRef, useState } from "react";
import { Bell, MessageSquare, Mail } from "lucide-react";
import { Link } from "react-router-dom";
//
import { adminContactMessagesService } from "../contact/services/adminContact.services";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [pendingComments, setPendingComments] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    adminContactMessagesService.getAll().then((msgs) => setUnreadMessages(msgs.length));
    // Comments are per-post; a true global pending count needs a backend
    // endpoint that lists all comments across posts. Left at 0 until that
    // exists -- ask your backend friend for a global /v1/comments list.
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalCount = pendingComments + unreadMessages;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300"
      >
        <Bell className="h-[18px] w-[18px]" />
        {totalCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <Link
            to="/admin/messages"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Mail className="h-4 w-4 text-slate-400" />
            <span>{unreadMessages} unread message{unreadMessages === 1 ? "" : "s"}</span>
          </Link>
          <Link
            to="/admin/comments"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <MessageSquare className="h-4 w-4 text-slate-400" />
            <span>Pending comments</span>
          </Link>
          {totalCount === 0 && (
            <p className="px-3 py-2 text-sm text-slate-400">You're all caught up.</p>
          )}
        </div>
      )}
    </div>
  );
}