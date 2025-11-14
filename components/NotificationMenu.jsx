import { useState } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

function NotificationItem({ notification, onMarkAsRead, onDelete }) {
  // const Icon = notification.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`p-4 mb-3 rounded-xl border transition-all shadow-sm hover:shadow-md ${
        notification.notification_read
          ? "bg-white border-gray-200"
          : "bg-blue-50/60 border-blue-200"
      }`}
    >
      <div className="flex gap-4 items-start">
        {/* Icon */}
        {/* <div
          className={`flex-shrink-0 w-9 h-9 rounded-full ${notification.bgColor} flex items-center justify-center shadow-inner`}
        >
          <Icon size={18} className={notification.color} />
        </div> */}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900">
              {notification.notification_title}
            </p>
            {!notification.notification_read && (
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-1"></span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3 leading-snug">
            {notification.notification_message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(notification.notification_created), { addSuffix: true, locale: fr })}</span>
            <div className="flex gap-2">
              {notification.notification_read === 'no' && (
                <button
                  onClick={() => onMarkAsRead(notification.notification_id)}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                >
                  Marquer comme lu
                </button>
              )}
              <button
                onClick={() => onDelete(notification.notification_id)}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationMenu({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}) {
  const [showUnread, setShowUnread] = useState(true);

  // const unreadNotifications = notifications.filter((n) => !n.notification_read);
  const unreadNotifications = Array.isArray(notifications)
  ? notifications.filter((n) => !n.read)
  : [];

  // const readNotifications = notifications.filter((n) => n.notification_read);
  const readNotifications = Array.isArray(notifications)
  ? notifications.filter((n) => n.read)
  : [];

  const displayedNotifications = showUnread
    ? unreadNotifications
    : readNotifications;

  return (
    <div className="flex flex-col max-h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Notifications{" "}
            <span className="text-gray-500 text-sm">
              ({unreadNotifications.length})
            </span>
          </h3>

          {notifications.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Tout marquer comme lu
              </button>
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>

        {/* Toggle plus petit */}
        <div className="flex bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => setShowUnread(true)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-full transition-all ${
              showUnread
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Non lu
          </button>
          <button
            onClick={() => setShowUnread(false)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-full transition-all ${
              !showUnread
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Lu
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1 p-4">
        {displayedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">
              Aucune notification {showUnread ? "récente" : "lu"}
            </p>
          </div>
        ) : (
          displayedNotifications.map((notif) => (
            <NotificationItem
              key={notif.notification_id}
              notification={notif}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}