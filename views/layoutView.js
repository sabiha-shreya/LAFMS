const { escapeHtml } = require('../lib/auth');

/**
 * User Layout with unified modern Sidebar, Topbar, and Mobile Drawer
 */
function renderUserLayout({ title, activeNav, full_name, unread_count = 0, content, scripts = '' }) {
  full_name = full_name || 'Student';
  unread_count = parseInt(unread_count, 10) || 0;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'dashboard.php' },
    { id: 'add-lost', label: 'Add Lost Item', icon: 'plus-circle', href: 'add-lost-item.php' },
    { id: 'add-found', label: 'Add Found Item', icon: 'plus-square', href: 'add-found-item.php' },
    { id: 'search', label: 'Search Item', icon: 'search', href: 'search-item.html' },
    { id: 'view-items', label: 'View All Items', icon: 'clipboard-list', href: 'view-items.php' },
    { id: 'matches', label: 'My Matches', icon: 'heart', href: 'my-matches.php' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', href: 'notifications.php', badge: unread_count }
  ];

  const navLinksHtml = navItems.map(item => {
    const isActive = activeNav === item.id;
    const activeClass = isActive
      ? 'bg-[#0fa4af] text-white shadow-md'
      : 'text-teal-100/75 hover:text-white hover:bg-white/10';

    return `
      <a href="${item.href}" class="flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${activeClass}">
        <div class="flex items-center gap-3.5">
          <i data-lucide="${item.icon}" class="w-4 h-4 shrink-0"></i>
          <span>${item.label}</span>
        </div>
        ${item.badge && item.badge > 0 ? `
          <span class="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            ${item.badge}
          </span>
        ` : ''}
      </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} | Campus Lost & Found</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dashboard.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <link rel="stylesheet" href="css/style.css">
    <script src="js/tailwind.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/lucide.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
      body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    </style>
</head>
<body class="flex h-screen overflow-hidden bg-slate-50 text-slate-800 antialiased selection:bg-teal-500 selection:text-white">

<!-- MOBILE SIDEBAR BACKDROP -->
<div id="sidebarBackdrop" onclick="toggleSidebar(false)" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden hidden transition-opacity"></div>

<!-- SIDEBAR -->
<aside id="sidebar" class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#003844] text-white flex flex-col justify-between p-5 shrink-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out select-none shadow-2xl lg:shadow-none">
    <div>
        <!-- BRAND LOGO -->
        <div class="flex items-center justify-between mb-8 px-1">
            <a href="dashboard.php" class="flex items-center gap-3">
                <img src="images/new-logo.jpeg" alt="CAMPUS LOST & FOUND" class="h-10 w-auto object-contain rounded-xl shadow-sm">
            </a>
            <button type="button" onclick="toggleSidebar(false)" class="lg:hidden text-teal-200 hover:text-white p-1 rounded-lg">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <!-- NAVIGATION LINKS -->
        <nav class="space-y-1.5 font-semibold text-sm">
            ${navLinksHtml}
        </nav>
    </div>

    <!-- SIDEBAR FOOTER -->
    <div class="pt-4 border-t border-teal-800/40 text-center">
        <div class="relative mx-auto flex items-center justify-center mb-1">
            <img src="images/box.jpeg" alt="Lost Box" class="w-28 h-auto object-contain rounded-2xl drop-shadow-md mx-auto opacity-90 hover:opacity-100 transition">
        </div>

        <p class="text-[11px] text-teal-200/80 font-normal italic mt-2">
            "Reuniting lost items with their rightful owners."
        </p>

        <div class="mt-3">
            <a href="logout.php" class="text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 px-3.5 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 font-semibold">
                <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                <span>Logout</span>
            </a>
        </div>
    </div>
</aside>

<!-- MAIN CONTENT WRAPPER -->
<div class="flex-1 flex flex-col h-screen overflow-y-auto">

    <!-- STICKY TOPBAR -->
    <header class="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-5 sm:px-8 py-3.5 flex justify-between items-center sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div class="flex items-center gap-4">
            <button type="button" onclick="toggleSidebar(true)" class="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition">
                <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
            <div class="flex items-center gap-2">
                <span class="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                <h1 class="font-bold text-slate-900 text-base md:text-lg tracking-tight">
                    ${escapeHtml(title)}
                </h1>
            </div>
        </div>

        <!-- RIGHT ACTIONS -->
        <div class="flex items-center gap-3 sm:gap-5">
            <!-- QUICK REPORT BUTTON (DESKTOP) -->
            <a href="add-lost-item.php" class="hidden sm:inline-flex items-center gap-1.5 bg-[#0fa4af] hover:bg-[#0c8a94] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Report Lost</span>
            </a>

            <!-- NOTIFICATION BELL -->
            <a href="notifications.php" class="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition" title="Notifications">
                <i data-lucide="bell" class="w-5 h-5"></i>
                ${unread_count > 0 ? `
                <span class="absolute top-1 right-1 bg-emerald-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                    ${unread_count}
                </span>` : ''}
            </a>

            <!-- USER AVATAR & NAME -->
            <div class="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div class="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shadow-xs">
                    <i data-lucide="user" class="w-4 h-4 text-teal-700"></i>
                </div>
                <span class="hidden md:inline-block text-xs font-bold text-slate-800 max-w-[130px] truncate">
                    ${escapeHtml(full_name)}
                </span>
            </div>
        </div>
    </header>

    <!-- PAGE INJECTED CONTENT -->
    <main class="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        ${content}
    </main>

</div>

<script>
    function toggleSidebar(open) {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (open) {
            sidebar.classList.remove('-translate-x-full');
            backdrop.classList.remove('hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
            backdrop.classList.add('hidden');
        }
    }

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
</script>
${scripts}
</body>
</html>`;
}

/**
 * Admin Layout with unified modern Sidebar and Topbar
 */
function renderAdminLayout({ title, activeNav, admin_username, content, scripts = '' }) {
  admin_username = admin_username || 'Admin';

  const navItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: 'layout-dashboard', href: 'admin-dashboard.php' },
    { id: 'pending', label: 'Pending Posts', icon: 'clock', href: 'pending-posts.php' },
    { id: 'lost-items', label: 'All Lost Items', icon: 'file-question', href: 'view-lost-items.php' },
    { id: 'found-items', label: 'All Found Items', icon: 'package-check', href: 'view-found-items.php' },
    { id: 'users', label: 'Manage Users', icon: 'users', href: 'manage-users.php' },
    { id: 'delete', label: 'Delete Posts', icon: 'trash-2', href: 'delete-posts.php' },
    { id: 'returned', label: 'Returned Items', icon: 'check-circle-2', href: 'returned-items.php' },
    { id: 'claims', label: 'Approved Claims', icon: 'badge-check', href: 'admin-approved-claims.php' }
  ];

  const navLinksHtml = navItems.map(item => {
    const isActive = activeNav === item.id;
    const activeClass = isActive
      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
      : 'text-slate-300 hover:text-white hover:bg-white/10 font-medium';

    return `
      <a href="${item.href}" class="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all duration-150 ${activeClass}">
        <i data-lucide="${item.icon}" class="w-4 h-4 shrink-0"></i>
        <span>${item.label}</span>
      </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} | Admin Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <script src="js/tailwind.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/lucide.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
      body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    </style>
</head>
<body class="flex h-screen overflow-hidden bg-slate-100 text-slate-800 antialiased selection:bg-amber-500 selection:text-slate-900">

<!-- MOBILE ADMIN SIDEBAR BACKDROP -->
<div id="adminSidebarBackdrop" onclick="toggleAdminSidebar(false)" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden hidden transition-opacity"></div>

<!-- ADMIN SIDEBAR -->
<aside id="adminSidebar" class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between p-5 shrink-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out select-none shadow-2xl lg:shadow-none border-r border-slate-800">
    <div>
        <div class="flex items-center justify-between mb-8 px-1">
            <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                    ⚡
                </span>
                <div>
                    <h2 class="font-extrabold text-base tracking-tight text-white">ADMIN PORTAL</h2>
                    <p class="text-[11px] text-slate-400 font-medium">Campus Lost & Found</p>
                </div>
            </div>
            <button type="button" onclick="toggleAdminSidebar(false)" class="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <nav class="space-y-1.5">
            ${navLinksHtml}
        </nav>
    </div>

    <div class="pt-4 border-t border-slate-800 text-center">
        <div class="flex items-center justify-center gap-2 mb-3 px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-xs text-slate-300 font-semibold truncate">${escapeHtml(admin_username)} (Admin)</span>
        </div>
        <a href="admin-logout.php" class="text-xs text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 font-semibold">
            <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
            <span>Admin Logout</span>
        </a>
    </div>
</aside>

<!-- MAIN CONTENT WRAPPER -->
<div class="flex-1 flex flex-col h-screen overflow-y-auto">

    <!-- ADMIN TOPBAR -->
    <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 px-5 sm:px-8 py-3.5 flex justify-between items-center sticky top-0 z-30 shadow-xs">
        <div class="flex items-center gap-4">
            <button type="button" onclick="toggleAdminSidebar(true)" class="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition">
                <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
            <div class="flex items-center gap-2.5">
                <span class="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-md uppercase tracking-wider">Admin</span>
                <h1 class="font-bold text-slate-900 text-base md:text-lg">
                    ${escapeHtml(title)}
                </h1>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <a href="dashboard.php" target="_blank" class="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl transition">
                <span>View User Site</span>
                <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
            <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                ${escapeHtml(admin_username.substring(0, 2).toUpperCase())}
            </div>
        </div>
    </header>

    <main class="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        ${content}
    </main>

</div>

<script>
    function toggleAdminSidebar(open) {
        const sidebar = document.getElementById('adminSidebar');
        const backdrop = document.getElementById('adminSidebarBackdrop');
        if (open) {
            sidebar.classList.remove('-translate-x-full');
            backdrop.classList.remove('hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
            backdrop.classList.add('hidden');
        }
    }

    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
</script>
${scripts}
</body>
</html>`;
}

module.exports = { renderUserLayout, renderAdminLayout };
