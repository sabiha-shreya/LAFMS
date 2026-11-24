const { escapeHtml, csrfPostScript } = require('../lib/auth');
const { renderAdminLayout } = require('./layoutView');

function renderDeletePostsView({ lostPosts = [], foundPosts = [], csrfToken = '', admin_username = 'Admin' }) {
  const lostRows = lostPosts.length > 0
    ? lostPosts.map(post => `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3.5 px-4 font-bold text-slate-900 text-xs">#${parseInt(post.lost_id, 10)}</td>
        <td class="py-3.5 px-4">
          <strong class="text-slate-900 text-sm">${escapeHtml(post.item_name)}</strong>
          <span class="inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 lost-label">LOST</span>
        </td>
        <td class="py-3.5 px-4">
          <span class="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            ${escapeHtml(post.category)}
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-700 font-semibold">${escapeHtml(post.full_name || 'Unknown User')}</td>
        <td class="py-3.5 px-4 text-xs status">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">${escapeHtml(post.status)}</span>
        </td>
        <td class="py-3.5 px-4 text-xs">
          <a
            href="delete-posts.php?delete_lost=${parseInt(post.lost_id, 10)}"
            data-post="1"
            class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold transition inline-flex items-center gap-1 delete-btn"
            onclick="return confirm('Are you sure you want to delete this lost item post? Related matches and notifications will also be removed.');"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            <span>Delete</span>
          </a>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="6" class="py-6 text-center text-slate-400 text-xs empty">No lost item posts available.</td>
      </tr>
    `;

  const foundRows = foundPosts.length > 0
    ? foundPosts.map(post => `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3.5 px-4 font-bold text-slate-900 text-xs">#${parseInt(post.found_id, 10)}</td>
        <td class="py-3.5 px-4">
          <strong class="text-slate-900 text-sm">${escapeHtml(post.item_name)}</strong>
          <span class="inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 found-label">FOUND</span>
        </td>
        <td class="py-3.5 px-4">
          <span class="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            ${escapeHtml(post.category)}
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-700 font-semibold">${escapeHtml(post.full_name || 'Unknown User')}</td>
        <td class="py-3.5 px-4 text-xs status">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">${escapeHtml(post.status)}</span>
        </td>
        <td class="py-3.5 px-4 text-xs">
          <a
            href="delete-posts.php?delete_found=${parseInt(post.found_id, 10)}"
            data-post="1"
            class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold transition inline-flex items-center gap-1 delete-btn"
            onclick="return confirm('Are you sure you want to delete this found item post? Related matches and notifications will also be removed.');"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            <span>Delete</span>
          </a>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="6" class="py-6 text-center text-slate-400 text-xs empty">No found item posts available.</td>
      </tr>
    `;

  const content = `
    <!-- HEADER -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Delete Posts</h2>
        <p class="text-sm text-slate-500 mt-1 subtitle">Remove obsolete or invalid lost and found item listings.</p>
      </div>
      <a href="admin-dashboard.php" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-semibold transition inline-flex items-center gap-1.5 back-btn">
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Back to Dashboard</span>
      </a>
    </div>

    <div class="space-y-6 container">
      <!-- LOST POSTS -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden table-wrapper">
        <div class="px-6 py-4 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2 section-title">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Lost Item Posts
          </h3>
          <span class="text-xs font-semibold text-rose-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">${lostPosts.length} Posts</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Item Name</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Posted By</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              ${lostRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- FOUND POSTS -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden table-wrapper">
        <div class="px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2 section-title">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Found Item Posts
          </h3>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">${foundPosts.length} Posts</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">Item Name</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Posted By</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Action</th>
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
    title: 'Delete Posts',
    activeNav: 'delete',
    admin_username,
    content,
    scripts: csrfPostScript(csrfToken)
  });
}

module.exports = { renderDeletePostsView };
