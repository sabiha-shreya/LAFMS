const { escapeHtml } = require('../lib/auth');
const { renderAdminLayout } = require('./layoutView');

function renderAdminDashboard({ admin_username = 'Admin', pending_lost = [], pending_found = [] }) {
  const lostCount = pending_lost ? pending_lost.length : 0;
  const foundCount = pending_found ? pending_found.length : 0;
  const totalPending = lostCount + foundCount;

  let notifsHtml = '';

  if (pending_lost && pending_lost.length > 0) {
    notifsHtml += pending_lost.map(row => `
      <div class="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-4">
        <div>
          <p class="text-xs font-bold text-amber-900">🔔 <b>New Lost Item Post</b></p>
          <p class="text-xs text-amber-800 mt-0.5">A new lost item <b>${escapeHtml(row.item_name)}</b> is waiting for approval.</p>
        </div>
        <a href="pending-posts.php?id=${row.lost_id}&type=lost" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shrink-0">
          Review Post
        </a>
      </div>
    `).join('');
  }

  if (pending_found && pending_found.length > 0) {
    notifsHtml += pending_found.map(row => `
      <div class="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between gap-4">
        <div>
          <p class="text-xs font-bold text-teal-900">🔔 <b>New Found Item Post</b></p>
          <p class="text-xs text-teal-800 mt-0.5">A new found item <b>${escapeHtml(row.item_name)}</b> is waiting for approval.</p>
        </div>
        <a href="pending-posts.php?id=${row.found_id}&type=found" class="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition shrink-0">
          Review Post
        </a>
      </div>
    `).join('');
  }

  if ((!pending_lost || pending_lost.length === 0) && (!pending_found || pending_found.length === 0)) {
    notifsHtml = `<p class="text-xs text-slate-400 italic py-2">No New Notifications</p>`;
  }

  const content = `
    <!-- HEADER -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h2>
        <p class="text-sm text-slate-500 mt-1">Welcome, ${escapeHtml(admin_username)}! Overview of system activity and pending actions.</p>
      </div>
      <a href="pending-posts.php" class="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm">
        <i data-lucide="clock" class="w-4 h-4"></i>
        <span>${totalPending} Pending Approval</span>
      </a>
    </div>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Lost</p>
          <p class="text-2xl font-black text-rose-600 mt-1">${lostCount}</p>
          <a href="pending-posts.php" class="text-[11px] font-semibold text-rose-600 hover:underline mt-1 inline-block">Review Lost &rarr;</a>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <i data-lucide="file-question" class="w-6 h-6"></i>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Found</p>
          <p class="text-2xl font-black text-emerald-600 mt-1">${foundCount}</p>
          <a href="pending-posts.php" class="text-[11px] font-semibold text-emerald-600 hover:underline mt-1 inline-block">Review Found &rarr;</a>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <i data-lucide="package-check" class="w-6 h-6"></i>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Admin</p>
          <p class="text-base font-extrabold text-slate-900 mt-1">${escapeHtml(admin_username)}</p>
          <span class="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full mt-1">SUPERADMIN</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <i data-lucide="shield" class="w-6 h-6"></i>
        </div>
      </div>
    </div>

    <!-- NOTIFICATIONS CARD -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
          <i data-lucide="bell" class="w-4 h-4 text-amber-500"></i>
          <span>Notifications</span>
        </h3>
        <span class="text-xs text-slate-400 font-medium">${totalPending} pending tasks</span>
      </div>
      <div class="space-y-3">
        ${notifsHtml}
      </div>
    </div>

    <!-- QUICK ACTIONS DIRECTORY -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <h3 class="text-base font-bold text-slate-900 mb-4">Management Modules</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 dashboard-buttons">
        <a href="view-lost-items.php" class="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-center transition flex flex-col items-center gap-2">
          <i data-lucide="file-text" class="w-5 h-5 text-rose-500"></i>
          <span class="text-xs font-bold text-slate-800 btn">View All Lost Items</span>
        </a>
        <a href="view-found-items.php" class="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-center transition flex flex-col items-center gap-2">
          <i data-lucide="package-search" class="w-5 h-5 text-emerald-500"></i>
          <span class="text-xs font-bold text-slate-800 btn">View All Found Items</span>
        </a>
        <a href="pending-posts.php" class="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-center transition flex flex-col items-center gap-2">
          <i data-lucide="clock" class="w-5 h-5 text-amber-500"></i>
          <span class="text-xs font-bold text-slate-800 btn">Pending Posts</span>
        </a>
        <a href="returned-items.php" class="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-center transition flex flex-col items-center gap-2">
          <i data-lucide="check-circle" class="w-5 h-5 text-teal-500"></i>
          <span class="text-xs font-bold text-slate-800 btn">Returned Items</span>
        </a>
        <a href="manage-users.php" class="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-center transition flex flex-col items-center gap-2">
          <i data-lucide="users" class="w-5 h-5 text-indigo-500"></i>
          <span class="text-xs font-bold text-slate-800 btn">Manage Users</span>
        </a>
        <a href="delete-posts.php" class="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-center transition flex flex-col items-center gap-2">
          <i data-lucide="trash-2" class="w-5 h-5 text-rose-500"></i>
          <span class="text-xs font-bold text-slate-800 btn">Delete Posts</span>
        </a>
        <a href="admin-approved-claims.php" class="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-center transition flex flex-col items-center gap-2">
          <i data-lucide="badge-check" class="w-5 h-5 text-emerald-600"></i>
          <span class="text-xs font-bold text-slate-800 btn">Approve Claim</span>
        </a>
        <a href="admin-logout.php" class="p-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-center transition flex flex-col items-center gap-2">
          <i data-lucide="log-out" class="w-5 h-5 text-rose-600"></i>
          <span class="text-xs font-bold text-rose-700">Logout</span>
        </a>
      </div>
    </div>
  `;

  return renderAdminLayout({
    title: 'Admin Dashboard',
    activeNav: 'dashboard',
    admin_username,
    content
  });
}

module.exports = { renderAdminDashboard };
