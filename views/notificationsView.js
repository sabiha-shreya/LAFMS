const { escapeHtml } = require('../lib/auth');

function renderNotifications({ notifications, unread_count }) {
  const notificationsHtml = (notifications && notifications.length > 0) ? notifications.map(n => {
    const notificationId = parseInt(n.notification_id, 10);
    const matchId = n.match_id ? parseInt(n.match_id, 10) : 0;
    const title = n.title || '';
    const message = n.message || '';
    const isRead = parseInt(n.is_read, 10);
    const claimStatus = n.claim_status || '';
    const notifTitleLower = title.toLowerCase();
    const notifMsgLower = message.toLowerCase();
    const hasMatchId = matchId > 0;
    const isClaimNotif = notifTitleLower.includes('claim') || notifMsgLower.includes('claim');

    let claimButtonsHtml = '';
    if (hasMatchId && isClaimNotif) {
      if (claimStatus === 'Pending') {
        claimButtonsHtml = `
          <div class="mt-4">
            <a href="view-claim.php?match_id=${matchId}" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <i data-lucide="eye" class="w-4 h-4"></i> View Claim Request
            </a>
          </div>`;
      } else if (claimStatus === 'Approved') {
        claimButtonsHtml = `
          <div class="mt-4">
            <a href="approved-claim-details.php?match_id=${matchId}" class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <i data-lucide="badge-check" class="w-4 h-4"></i> View Approved Details
            </a>
          </div>`;
      } else if (claimStatus === 'Rejected') {
        claimButtonsHtml = `
          <div class="mt-4">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
              <i data-lucide="x-circle" class="w-4 h-4"></i> Claim Rejected
            </span>
          </div>`;
      }
    }

    return `
      <div class="bg-white rounded-2xl shadow p-5 border-l-4 ${isRead ? 'border-gray-300' : 'border-blue-500'}">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              ${!isRead ? '<span class="w-2 h-2 bg-blue-500 rounded-full"></span>' : ''}
              <h3 class="font-bold text-lg text-gray-800">${escapeHtml(title)}</h3>
            </div>
            <p class="text-gray-600 mt-2">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            <p class="text-sm text-gray-400 mt-3">${escapeHtml(n.created_at)}</p>
            ${claimButtonsHtml}
          </div>
          <div class="flex flex-col gap-2">
            ${!isRead ? `
              <button onclick="markAsRead(${notificationId})" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Mark as read">
                <i data-lucide="check" class="w-5 h-5"></i>
              </button>
            ` : ''}
            <button onclick="deleteNotification(${notificationId})" class="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
              <i data-lucide="trash-2" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="bg-white rounded-2xl shadow p-10 text-center">
      <i data-lucide="bell-off" class="mx-auto w-12 h-12 text-gray-400"></i>
      <h2 class="text-xl font-bold text-gray-700 mt-4">No Notifications</h2>
      <p class="text-gray-500 mt-2">You don't have any notifications yet.</p>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifications</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gray-100 min-h-screen">
<div class="max-w-4xl mx-auto p-6">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
            <div class="flex items-center gap-3">
                <h1 class="text-3xl font-bold text-gray-800">Notifications</h1>
                ${unread_count > 0 ? `<span class="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">${unread_count} New</span>` : ''}
            </div>
            <p class="text-gray-500 mt-1">Your latest notifications</p>
        </div>
        <a href="dashboard.php" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">← Dashboard</a>
    </div>

    <div class="space-y-4">
        ${notificationsHtml}
    </div>
</div>

<script>
lucide.createIcons();

function markAsRead(notificationId) {
    fetch("mark-notification-read.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "notification_id=" + encodeURIComponent(notificationId)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) { location.reload(); }
        else { alert(data.message || "Failed to mark notification as read."); }
    })
    .catch(error => { console.error(error); alert("Something went wrong."); });
}

function deleteNotification(notificationId) {
    if (!confirm("Are you sure you want to delete this notification?")) { return; }
    fetch("delete-notification.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "notification_id=" + encodeURIComponent(notificationId)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) { location.reload(); }
        else { alert(data.message || "Failed to delete notification."); }
    })
    .catch(error => { console.error(error); alert("Something went wrong."); });
}
</script>
</body>
</html>`;
}

module.exports = { renderNotifications };

