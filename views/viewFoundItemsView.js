const { escapeHtml } = require('../lib/auth');
const { renderAdminLayout } = require('./layoutView');

function renderFoundItemDetail({ item, admin_username = 'Admin' }) {
  const content = `
    <!-- HEADER -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Found Item Details</h2>
        <p class="text-sm text-slate-500 mt-1">Complete details of the approved found item post.</p>
      </div>
      <a href="view-found-items.php" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-semibold transition inline-flex items-center gap-1.5 back-button">
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Back to Found Items</span>
      </a>
    </div>

    <!-- DETAILS GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- FINDER INFO -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div class="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <i data-lucide="user" class="w-5 h-5 text-emerald-500"></i>
          <h3 class="text-base font-bold text-slate-900">Finder Information</h3>
        </div>
        <div class="space-y-3 text-xs">
          <div>
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Full Name</span>
            <p class="font-bold text-slate-900 text-sm">${escapeHtml(item.full_name || 'N/A')}</p>
          </div>
          <div>
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Student ID</span>
            <p class="font-bold text-slate-900 text-sm font-mono">${escapeHtml(item.student_id || 'N/A')}</p>
          </div>
          <div>
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Email</span>
            <p class="font-semibold text-slate-800 text-sm">${escapeHtml(item.email || 'N/A')}</p>
          </div>
          <div>
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Department</span>
            <p class="font-semibold text-slate-800 text-sm">${escapeHtml(item.department || 'N/A')}</p>
          </div>
        </div>
      </div>

      <!-- ITEM INFO -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div class="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <i data-lucide="package-check" class="w-5 h-5 text-emerald-500"></i>
          <h3 class="text-base font-bold text-slate-900">Item Information</h3>
        </div>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Item Name</span>
            <p class="font-bold text-slate-900 text-sm">${escapeHtml(item.item_name)}</p>
          </div>
          <div>
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Category</span>
            <p class="font-bold text-slate-800 text-sm">${escapeHtml(item.category)}</p>
          </div>
          <div>
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Found Date</span>
            <p class="font-bold text-slate-800">${escapeHtml(item.found_date)}</p>
          </div>
          <div>
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Found Location</span>
            <p class="font-bold text-slate-800">${escapeHtml(item.found_location)}</p>
          </div>
          <div class="col-span-2">
            <span class="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Finder Contact Information</span>
            <p class="font-bold text-slate-800 font-mono">${escapeHtml(item.finder_contact_information)}</p>
          </div>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span class="text-slate-400 text-[11px] font-bold uppercase block mb-1">Description</span>
          <p class="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">${escapeHtml(item.description || '').replace(/\n/g, '<br>')}</p>
        </div>

        <div class="flex items-center justify-between text-xs pt-2">
          <div>
            <span class="text-slate-400 font-semibold">Status:</span>
            <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold status">${escapeHtml(item.status)}</span>
          </div>
          <span class="text-slate-400">Posted: ${escapeHtml(item.created_at)}</span>
        </div>
      </div>
    </div>
  `;

  return renderAdminLayout({
    title: 'Found Item Details',
    activeNav: 'found-items',
    admin_username,
    content
  });
}

function renderFoundItemsList({ items = [], admin_username = 'Admin' }) {
  const rowsHtml = (items && items.length > 0) ? items.map(row => `
    <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
      <td class="py-3.5 px-4 font-bold text-slate-900 text-xs">#${escapeHtml(row.found_id)}</td>
      <td class="py-3.5 px-4 font-bold text-slate-900 text-sm">${escapeHtml(row.item_name)}</td>
      <td class="py-3.5 px-4">
        <span class="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
          ${escapeHtml(row.category)}
        </span>
      </td>
      <td class="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">${escapeHtml(row.description || '')}</td>
      <td class="py-3.5 px-4 text-xs text-slate-600">${escapeHtml(row.found_date)}</td>
      <td class="py-3.5 px-4 text-xs text-slate-600">${escapeHtml(row.found_location)}</td>
      <td class="py-3.5 px-4 text-xs text-slate-600 font-mono">${escapeHtml(row.finder_contact_information)}</td>
      <td class="py-3.5 px-4 text-xs">
        <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">${escapeHtml(row.status)}</span>
      </td>
      <td class="py-3.5 px-4 text-xs">
        <a href="view-found-items.php?id=${row.found_id}" class="px-3 py-1.5 bg-[#003844] hover:bg-[#0fa4af] text-white rounded-xl font-bold transition inline-block btn">View Details</a>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="9" class="py-8 text-center text-slate-400 text-xs">No found items available</td></tr>`;

  const content = `
    <!-- HEADER -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">All Found Items</h2>
        <p class="text-sm text-slate-500 mt-1">Directory of all approved found item reports.</p>
      </div>
      <a href="admin-dashboard.php" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-semibold transition inline-flex items-center gap-1.5 back-dashboard">
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Back to Dashboard</span>
      </a>
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden table-card">
      <div class="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
        <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Approved Found Item Reports
        </h3>
        <span class="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">${items.length} Items</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">Item Name</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Description</th>
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4">Location</th>
              <th class="py-3 px-4">Finder Contact</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return renderAdminLayout({
    title: 'All Found Items',
    activeNav: 'found-items',
    admin_username,
    content
  });
}

module.exports = { renderFoundItemDetail, renderFoundItemsList };
