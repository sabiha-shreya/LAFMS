const { escapeHtml, csrfPostScript } = require('../lib/auth');
const { renderAdminLayout } = require('./layoutView');

function renderManageUsersView({ users = [], deleted = false, csrfToken = '', admin_username = 'Admin' }) {
  const userRows = users.length > 0
    ? users.map(user => `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3.5 px-4 font-bold text-slate-900 text-xs user-id">#${parseInt(user.user_id, 10)}</td>
        <td class="py-3.5 px-4 font-bold text-slate-900 text-sm user-name">${escapeHtml(user.full_name)}</td>
        <td class="py-3.5 px-4 font-mono text-xs text-slate-600 student-id">${escapeHtml(user.student_id)}</td>
        <td class="py-3.5 px-4 text-xs text-slate-600 email">${escapeHtml(user.email)}</td>
        <td class="py-3.5 px-4 department">
          <span class="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            ${escapeHtml(user.department)}
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-400 date">${escapeHtml(user.created_at)}</td>
        <td class="py-3.5 px-4 text-xs">
          <a
            href="manage-users.php?delete_id=${parseInt(user.user_id, 10)}"
            data-post="1"
            class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold transition inline-flex items-center gap-1 delete-btn"
            onclick="return confirm('Are you sure you want to delete this user? The user notifications will also be deleted.');"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            <span>Delete</span>
          </a>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400 text-xs empty">No users available.</td>
      </tr>
    `;

  const content = `
    <!-- HEADER -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Users</h2>
        <p class="text-sm text-slate-500 mt-1">Directory of registered students and campus users.</p>
      </div>
      <a href="admin-dashboard.php" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-semibold transition inline-flex items-center gap-1.5">
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Back to Dashboard</span>
      </a>
    </div>

    ${deleted ? `
      <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-6 flex items-center gap-2 success-message">
        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
        <span>User and related notifications deleted successfully.</span>
      </div>
    ` : ''}

    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden content-card">
      <div class="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i data-lucide="users" class="w-4 h-4 text-amber-500"></i>
          <h3 class="font-bold text-base text-slate-900">Registered Users</h3>
        </div>
        <span class="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
          Total: ${users.length}
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-3 px-4">User ID</th>
              <th class="py-3 px-4">Full Name</th>
              <th class="py-3 px-4">Student ID</th>
              <th class="py-3 px-4">Email</th>
              <th class="py-3 px-4">Department</th>
              <th class="py-3 px-4">Joined Date</th>
              <th class="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            ${userRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return renderAdminLayout({
    title: 'Manage Users',
    activeNav: 'users',
    admin_username,
    content,
    scripts: csrfPostScript(csrfToken)
  });
}

module.exports = { renderManageUsersView };
