const { escapeHtml } = require('../lib/auth');
const { renderUserLayout } = require('./layoutView');

function renderSearchResult({ status = 'All', result_lost = [], result_found = [], full_name = 'Student', unread_count = 0 }) {
  const showLost = status === 'All' || status === 'Lost' || status === '';
  const showFound = status === 'All' || status === 'Found' || status === '';

  let lostRows = '';
  if (result_lost && result_lost.length > 0) {
    lostRows = result_lost.map(row => `
      <tr class="hover:bg-slate-50/80 cursor-pointer transition border-b border-slate-100" onclick="window.location='item-details.php?id=${encodeURIComponent(row.lost_id)}&type=lost&from=search'">
        <td class="py-3.5 px-4 font-bold text-slate-900 text-xs">#${escapeHtml(row.lost_id)}</td>
        <td class="py-3.5 px-4">
          <p class="font-bold text-sm text-slate-900">${escapeHtml(row.item_name)}</p>
        </td>
        <td class="py-3.5 px-4">
          <span class="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            ${escapeHtml(row.category)}
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">${escapeHtml(row.description || '')}</td>
        <td class="py-3.5 px-4 text-xs text-slate-600">${escapeHtml(row.lost_date)}</td>
        <td class="py-3.5 px-4 text-xs text-slate-600">${escapeHtml(row.lost_location)}</td>
        <td class="py-3.5 px-4">
          <span class="inline-block bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
            ${escapeHtml(row.status)}
          </span>
        </td>
      </tr>
    `).join('');
  } else if (status !== 'All') {
    lostRows = `<tr><td colspan="7" class="py-6 text-center text-slate-400 text-xs">No Lost Item Found</td></tr>`;
  }

  let foundRows = '';
  if (result_found && result_found.length > 0) {
    foundRows = result_found.map(row => `
      <tr class="hover:bg-slate-50/80 cursor-pointer transition border-b border-slate-100" onclick="window.location='item-details.php?id=${encodeURIComponent(row.found_id)}&type=found&from=search'">
        <td class="py-3.5 px-4 font-bold text-slate-900 text-xs">#${escapeHtml(row.found_id)}</td>
        <td class="py-3.5 px-4">
          <p class="font-bold text-sm text-slate-900">${escapeHtml(row.item_name)}</p>
        </td>
        <td class="py-3.5 px-4">
          <span class="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            ${escapeHtml(row.category)}
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">${escapeHtml(row.description || '')}</td>
        <td class="py-3.5 px-4 text-xs text-slate-600">${escapeHtml(row.found_date)}</td>
        <td class="py-3.5 px-4 text-xs text-slate-600">${escapeHtml(row.found_location)}</td>
        <td class="py-3.5 px-4">
          <span class="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
            ${escapeHtml(row.status)}
          </span>
        </td>
      </tr>
    `).join('');
  } else if (status !== 'All') {
    foundRows = `<tr><td colspan="7" class="py-6 text-center text-slate-400 text-xs">No Found Item Found</td></tr>`;
  }

  const content = `
    <!-- HEADER -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Search Result</h2>
        <p class="text-sm text-slate-500 mt-1">Results matching your search query.</p>
      </div>

      <div class="flex items-center gap-2">
        <a href="search-item.html" class="text-xs bg-[#003844] hover:bg-[#0fa4af] text-white px-4 py-2 rounded-xl font-bold transition inline-flex items-center gap-1.5 shadow-xs">
          <i data-lucide="search" class="w-3.5 h-3.5"></i>
          <span>New Search</span>
        </a>
        <a href="dashboard.php" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-semibold transition inline-flex items-center gap-1.5">
          <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
          <span>Dashboard</span>
        </a>
      </div>
    </div>

    <div class="space-y-6">
      ${showLost ? `
      <!-- LOST ITEMS -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <h3 class="font-bold text-base text-slate-900">Matching Lost Items</h3>
          </div>
          <span class="text-xs font-semibold text-rose-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
            ${result_lost ? result_lost.length : 0} Found
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Item Name</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Description</th>
                <th class="py-3 px-4">Lost Date</th>
                <th class="py-3 px-4">Location</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              ${lostRows || '<tr><td colspan="7" class="py-6 text-center text-slate-400 text-xs">No matching lost items</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}

      ${showFound ? `
      <!-- FOUND ITEMS -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 class="font-bold text-base text-slate-900">Matching Found Items</h3>
          </div>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
            ${result_found ? result_found.length : 0} Found
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Item Name</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Description</th>
                <th class="py-3 px-4">Found Date</th>
                <th class="py-3 px-4">Location</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              ${foundRows || '<tr><td colspan="7" class="py-6 text-center text-slate-400 text-xs">No matching found items</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}
    </div>
  `;

  return renderUserLayout({
    title: 'Search Result',
    activeNav: 'search',
    full_name,
    unread_count,
    content
  });
}

module.exports = { renderSearchResult };
