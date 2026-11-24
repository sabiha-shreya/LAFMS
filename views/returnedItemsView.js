const { escapeHtml } = require('../lib/auth');
const { renderAdminLayout } = require('./layoutView');

function renderReturnedItemsView({ lostItems = [], foundItems = [], admin_username = 'Admin' }) {
  const lostRows = lostItems.length > 0
    ? lostItems.map(row => `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3.5 px-4 font-bold text-slate-900 text-xs">#${escapeHtml(row.lost_id)}</td>
        <td class="py-3.5 px-4 font-bold text-slate-900 text-sm">${escapeHtml(row.item_name)}</td>
        <td class="py-3.5 px-4">
          <span class="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            ${escapeHtml(row.category)}
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-700 font-semibold">${escapeHtml(row.owner_name || 'Unknown')}</td>
        <td class="py-3.5 px-4 text-xs">
          <span class="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
            ${escapeHtml(row.status)}
          </span>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="5" class="py-6 text-center text-slate-400 text-xs">No returned lost items available</td>
      </tr>
    `;

  const foundRows = foundItems.length > 0
    ? foundItems.map(row => `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3.5 px-4 font-bold text-slate-900 text-xs">#${escapeHtml(row.found_id)}</td>
        <td class="py-3.5 px-4 font-bold text-slate-900 text-sm">${escapeHtml(row.item_name)}</td>
        <td class="py-3.5 px-4">
          <span class="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            ${escapeHtml(row.category)}
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-700 font-semibold">${escapeHtml(row.owner_name || 'Unknown')}</td>
        <td class="py-3.5 px-4 text-xs">
          <span class="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
            ${escapeHtml(row.status)}
          </span>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="5" class="py-6 text-center text-slate-400 text-xs">No returned found items available</td>
      </tr>
    `;

  const content = `
    <!-- HEADER -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Returned Items</h2>
        <p class="text-sm text-slate-500 mt-1">Items that have been successfully returned to their rightful owners.</p>
      </div>
      <a href="admin-dashboard.php" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-semibold transition inline-flex items-center gap-1.5 btn">
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Back to Dashboard</span>
      </a>
    </div>

    <div class="space-y-6 container">
      <!-- RETURNED LOST ITEMS -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Returned Lost Items
          </h3>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">${lostItems.length} Resolved</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Item Name</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Owner Name</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              ${lostRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- RETURNED FOUND ITEMS -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Returned Found Items
          </h3>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">${foundItems.length} Resolved</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Item Name</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Owner Name</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              ${foundRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  return renderAdminLayout({
    title: 'Returned Items',
    activeNav: 'returned',
    admin_username,
    content
  });
}

module.exports = { renderReturnedItemsView };
