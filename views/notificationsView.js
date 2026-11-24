const { escapeHtml } = require('../lib/auth');
const { renderUserLayout } = require('./layoutView');

function renderNotifications({ notifications = [], unread_count = 0, full_name = 'Student' }) {
  unread_count = parseInt(unread_count, 10) || 0;

  const notificationsHtml = (notifications && notifications.length > 0) ? notifications.map(n => {
    const notificationId = parseInt(n.notification_id, 10);
    const matchId = n.match_id ? parseInt(n.match_id, 10) : 0;
    const title = n.title || 'Notification';
    const message = n.message || '';
    const isRead = parseInt(n.is_read, 10) === 1;
    const claimStatus = n.claim_status || '';
    const notifTitleLower = title.toLowerCase();
    const notifMsgLower = message.toLowerCase();
    const hasMatchId = matchId > 0;
    const isClaimNotif = notifTitleLower.includes('claim') || notifMsgLower.includes('claim');

    let claimButtonsHtml = '';
    if (hasMatchId && isClaimNotif) {
      if (claimStatus === 'Pending') {
        claimButtonsHtml = `
          <div class="mt-3.5">
            <a href="view-claim.php?match_id=${matchId}" class="inline-flex items-center gap-2 px-4 py-2 bg-[#003844] hover:bg-[#0fa4af] text-white text-xs font-bold rounded-xl transition shadow-xs">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              <span>View Claim Request</span>
            </a>
          </div>`;
      } else if (claimStatus === 'Approved') {
        claimButtonsHtml = `
          <div class="mt-3.5">
            <a href="approved-claim-details.php?match_id=${matchId}" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs">
              <i data-lucide="badge-check" class="w-3.5 h-3.5"></i>
              <span>View Approved Details & Exchange</span>
            </a>
          </div>`;
      } else if (claimStatus === 'Rejected') {
        claimButtonsHtml = `
          <div class="mt-3.5">
            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl">
              <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
              <span>Claim Rejected</span>
            </span>
          </div>`;
      }
    }

    return `
      <div class="bg-white rounded-2xl border transition-all duration-150 p-5 ${isRead ? 'border-slate-200/90 bg-white' : 'border-teal-300 bg-teal-50/20 shadow-xs'}">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3.5 flex-1 min-w-0">
            <div class="w-9 h-9 rounded-xl ${isRead ? 'bg-slate-100 text-slate-500' : 'bg-teal-100 text-[#003844]'} flex items-center justify-center shrink-0 mt-0.5">
              <i data-lucide="${isClaimNotif ? 'git-pull-request' : 'bell'}" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-bold text-sm text-slate-900">${escapeHtml(title)}</h3>
                ${!isRead ? '<span class="bg-[#0fa4af] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">NEW</span>' : ''}
              </div>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
              <div class="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                <span class="flex items-center gap-1">
                  <i data-lucide="calendar" class="w-3 h-3"></i>
                  <span>${escapeHtml(n.created_at || 'Recently')}</span>
                </span>
              </div>
              ${claimButtonsHtml}
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            ${!isRead ? `
              <button onclick="markAsRead(${notificationId})" class="p-2 text-teal-600 hover:bg-teal-50 rounded-xl transition" title="Mark as read">
                <i data-lucide="check" class="w-4 h-4"></i>
              </button>
            ` : ''}
            <button onclick="deleteNotification(${notificationId})" class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition" title="Delete notification">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
      <div class="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <i data-lucide="bell-off" class="w-8 h-8"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-1">No Notifications</h3>
      <p class="text-sm text-slate-500 max-w-sm mx-auto">You're all caught up! New updates, claim requests, and matches will show up here.</p>
    </div>
  `;

  const content = `
    <!-- HEADER -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h2>
          ${unread_count > 0 ? `<span class="px-2.5 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">${unread_count} New</span>` : ''}
        </div>
        <p class="text-sm text-slate-500 mt-1">Updates on your posts, automated matches, and claim status requests.</p>
      </div>
      <a href="dashboard.php" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-semibold transition inline-flex items-center gap-1.5">
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Dashboard</span>
      </a>
    </div>

    <!-- NOTIFICATION LIST -->
    <div class="space-y-3.5">
      ${notificationsHtml}
    </div>
  `;

  const scripts = `
    <script>
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
        if (!confirm("Are you sure you want to delete this notification?")) return;
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
  `;

  return renderUserLayout({
    title: 'Notifications',
    activeNav: 'notifications',
    full_name,
    unread_count,
    content,
    scripts
  });
}

module.exports = { renderNotifications };
