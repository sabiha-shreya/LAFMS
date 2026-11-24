const { escapeHtml } = require('../lib/auth');
const { renderAdminLayout } = require('./layoutView');

function renderAdminApprovedClaimsView({ claims = [], admin_username = 'Admin' }) {
  const claimRows = claims.length > 0
    ? claims.map(row => `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3.5 px-4 font-bold text-slate-900 text-xs">#${parseInt(row.match_id, 10)}</td>
        <td class="py-3.5 px-4 font-bold text-slate-900 text-sm">${escapeHtml(row.lost_item_name)}</td>
        <td class="py-3.5 px-4 text-xs">
          <strong class="text-slate-900">${escapeHtml(row.owner_name || 'N/A')}</strong>
          <div class="text-[11px] text-slate-500 font-mono mt-0.5">${escapeHtml(row.owner_student_id || 'N/A')}</div>
          <div class="text-[11px] text-slate-400">${escapeHtml(row.owner_email || 'N/A')}</div>
        </td>
        <td class="py-3.5 px-4 font-bold text-slate-900 text-sm">${escapeHtml(row.found_item_name)}</td>
        <td class="py-3.5 px-4 text-xs">
          <strong class="text-slate-900">${escapeHtml(row.finder_name || 'N/A')}</strong>
          <div class="text-[11px] text-slate-500 font-mono mt-0.5">${escapeHtml(row.finder_student_id || 'N/A')}</div>
          <div class="text-[11px] text-slate-400">${escapeHtml(row.finder_email || 'N/A')}</div>
        </td>
        <td class="py-3.5 px-4 text-xs">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            ${escapeHtml(row.match_percentage)}%
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            Approved
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs">
          <a href="approved-claim-details.php?match_id=${parseInt(row.match_id, 10)}" class="px-3 py-1.5 bg-[#003844] hover:bg-[#0fa4af] text-white rounded-xl font-bold transition inline-block btn">
            View Claim
          </a>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="8" class="py-8 text-center text-slate-400 text-xs">No approved claims found.</td>
      </tr>
    `;

  const content = `
    <!-- HEADER -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Approved Claims</h2>
        <p class="text-sm text-slate-500 mt-1">Claims approved by the finder are shown below.</p>
      </div>
      <a href="admin-dashboard.php" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-semibold transition inline-flex items-center gap-1.5 btn">
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Back to Dashboard</span>
      </a>
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden container table-container">
      <div class="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
        <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Approved Claims Log
        </h3>
        <span class="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">${claims.length} Approved</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-3 px-4">Match ID</th>
              <th class="py-3 px-4">Lost Item</th>
              <th class="py-3 px-4">Claim Requested By</th>
              <th class="py-3 px-4">Found Item</th>
              <th class="py-3 px-4">Approved By</th>
              <th class="py-3 px-4">Match %</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            ${claimRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return renderAdminLayout({
    title: 'Approved Claims',
    activeNav: 'claims',
    admin_username,
    content
  });
}

module.exports = { renderAdminApprovedClaimsView };
