const { escapeHtml } = require('../lib/auth');

function renderApprovedClaimDetails({ match, match_id, is_admin, is_owner, is_finder }) {
  const lostImage = match.lost_item_image ? escapeHtml(match.lost_item_image) : '';
  const backLink = is_admin ? 'admin-dashboard.php' : 'notifications.php';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Approved Claim Details</title>
    <script src="js/tailwind.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/lucide.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gray-100 min-h-screen">
<div class="max-w-6xl mx-auto p-6">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
            <div class="flex items-center gap-2">
                <i data-lucide="badge-check" class="text-green-600"></i>
                <h1 class="text-3xl font-bold text-gray-800">Approved Claim Details</h1>
            </div>
            <p class="text-gray-500 mt-1">Match #${match_id}</p>
        </div>
        <a href="${backLink}" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">← Back</a>
    </div>

    <!-- APPROVED NOTICE -->
    <div class="bg-green-50 border border-green-300 rounded-2xl p-5 mb-6">
        <div class="flex items-start gap-3">
            <i data-lucide="check-circle" class="text-green-600 mt-1"></i>
            <div>
                <h2 class="font-bold text-green-700 text-lg">Claim Approved</h2>
                <p class="text-gray-700 mt-1">This claim has been approved by the finder.</p>
            </div>
        </div>
    </div>

    <!-- MATCH SUMMARY -->
    <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 class="text-xl font-bold mb-5">Match Summary</h2>
        <div class="grid md:grid-cols-4 gap-4">
            <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-gray-500 text-sm">Match ID</p>
                <p class="font-bold text-lg">#${match_id}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-gray-500 text-sm">Match Percentage</p>
                <p class="font-bold text-lg text-blue-600">${escapeHtml(match.match_percentage)}%</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-gray-500 text-sm">Match Status</p>
                <p class="font-bold">${escapeHtml(match.status)}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-gray-500 text-sm">Claim Status</p>
                <span class="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">Approved</span>
            </div>
        </div>
    </div>

    <!-- RETURN CONFIRMATION & UNDO ACTIONS -->
    ${(is_owner || is_finder) ? `
    <div class="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-100">
        <h2 class="text-xl font-bold mb-3">Item Handover & Return Status</h2>
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <p class="text-sm text-gray-600">
                    Your Status: <strong class="text-gray-900">${is_owner ? (match.owner_status?.toLowerCase() === 'received' ? 'Returned' : 'Pending Confirmation') : (match.finder_status?.toLowerCase() === 'give back' ? 'Returned' : 'Pending Confirmation')}</strong>
                    &nbsp;|&nbsp;
                    Handover Status: <strong class="text-gray-900">${match.status === 'Returned' ? '✓ Completed (Returned)' : 'In Progress'}</strong>
                </p>
                <p class="text-xs text-gray-400 mt-1">Confirm when the item has physically been handed over. You can undo if clicked accidentally.</p>
            </div>
            <div>
                ${is_owner ? (
                    match.owner_status?.toLowerCase() === 'received' ? `
                        <div class="flex items-center gap-3">
                            <span class="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-xl text-sm border border-green-300">✓ Returned</span>
                            <form action="match-action.php" method="POST" style="display:inline-block;">
                                <input type="hidden" name="match_id" value="${match_id}">
                                <input type="hidden" name="action" value="not_returned">
                                <button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition shadow-sm" onclick="return confirm('Revert status back to Not Returned Yet?');">↩ Not Returned Yet</button>
                            </form>
                        </div>
                    ` : `
                        <form action="match-action.php" method="POST" style="display:inline-block;">
                            <input type="hidden" name="match_id" value="${match_id}">
                            <input type="hidden" name="action" value="received">
                            <button type="submit" class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition shadow-sm">📦 Confirm Return</button>
                        </form>
                    `
                ) : ''}
                ${is_finder ? (
                    match.finder_status?.toLowerCase() === 'give back' ? `
                        <div class="flex items-center gap-3">
                            <span class="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-xl text-sm border border-green-300">✓ Returned</span>
                            <form action="match-action.php" method="POST" style="display:inline-block;">
                                <input type="hidden" name="match_id" value="${match_id}">
                                <input type="hidden" name="action" value="not_returned">
                                <button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition shadow-sm" onclick="return confirm('Revert status back to Not Returned Yet?');">↩ Not Returned Yet</button>
                            </form>
                        </div>
                    ` : `
                        <form action="match-action.php" method="POST" style="display:inline-block;">
                            <input type="hidden" name="match_id" value="${match_id}">
                            <input type="hidden" name="action" value="given_back">
                            <button type="submit" class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition shadow-sm">🤝 Confirm Return</button>
                        </form>
                    `
                ) : ''}
            </div>
        </div>
    </div>
    ` : ''}

    <!-- LOST ITEM -->
    <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 class="text-xl font-bold text-red-600 mb-5">Lost Item</h2>
        ${lostImage ? `
            <div class="mb-6">
                <p class="text-gray-500 text-sm font-medium mb-2">Lost Item Image</p>
                <div class="w-52 h-40 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src="${lostImage}" alt="${escapeHtml(match.lost_item_name)}" class="max-w-full max-h-full object-contain p-2">
                </div>
            </div>
        ` : ''}

        <div class="grid md:grid-cols-2 gap-5">
            <div>
                <p class="text-gray-500 text-sm">Item Name</p>
                <p class="font-semibold">${escapeHtml(match.lost_item_name)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Category</p>
                <p class="font-semibold">${escapeHtml(match.lost_category)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Lost Date</p>
                <p class="font-semibold">${escapeHtml(match.lost_date)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Lost Location</p>
                <p class="font-semibold">${escapeHtml(match.lost_location)}</p>
            </div>
            <div class="md:col-span-2">
                <p class="text-gray-500 text-sm">Description</p>
                <p class="font-semibold">${escapeHtml(match.lost_description || '').replace(/\n/g, '<br>')}</p>
            </div>
            <div class="md:col-span-2">
                <p class="text-gray-500 text-sm">Owner Contact</p>
                <p class="font-semibold">${escapeHtml(match.lost_contact_information)}</p>
            </div>
            <div class="md:col-span-2 bg-yellow-50 border border-yellow-300 rounded-xl p-5">
                <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="lock" class="text-yellow-700"></i>
                    <h3 class="font-bold text-yellow-700">Secret Information</h3>
                </div>
                <p class="text-gray-800">${escapeHtml(match.lost_secret_information || 'None').replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    </div>

    <!-- OWNER INFORMATION -->
    <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 class="text-xl font-bold mb-5">Owner Information</h2>
        <div class="grid md:grid-cols-2 gap-5">
            <div>
                <p class="text-gray-500 text-sm">Full Name</p>
                <p class="font-semibold">${escapeHtml(match.owner_name)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Student ID</p>
                <p class="font-semibold">${escapeHtml(match.owner_student_id)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Email</p>
                <p class="font-semibold">${escapeHtml(match.owner_email)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Department</p>
                <p class="font-semibold">${escapeHtml(match.owner_department)}</p>
            </div>
        </div>
    </div>

    <!-- FOUND ITEM -->
    <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 class="text-xl font-bold text-green-600 mb-5">Found Item</h2>
        <div class="grid md:grid-cols-2 gap-5">
            <div>
                <p class="text-gray-500 text-sm">Item Name</p>
                <p class="font-semibold">${escapeHtml(match.found_item_name)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Category</p>
                <p class="font-semibold">${escapeHtml(match.found_category)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Found Date</p>
                <p class="font-semibold">${escapeHtml(match.found_date)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Found Location</p>
                <p class="font-semibold">${escapeHtml(match.found_location)}</p>
            </div>
            <div class="md:col-span-2">
                <p class="text-gray-500 text-sm">Description</p>
                <p class="font-semibold">${escapeHtml(match.found_description || '').replace(/\n/g, '<br>')}</p>
            </div>
            <div class="md:col-span-2">
                <p class="text-gray-500 text-sm">Finder Contact</p>
                <p class="font-semibold">${escapeHtml(match.finder_contact_information)}</p>
            </div>
        </div>
    </div>

    <!-- FINDER INFORMATION -->
    <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-xl font-bold mb-5">Finder Information</h2>
        <div class="grid md:grid-cols-2 gap-5">
            <div>
                <p class="text-gray-500 text-sm">Full Name</p>
                <p class="font-semibold">${escapeHtml(match.finder_name)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Student ID</p>
                <p class="font-semibold">${escapeHtml(match.finder_student_id)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Email</p>
                <p class="font-semibold">${escapeHtml(match.finder_email)}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Department</p>
                <p class="font-semibold">${escapeHtml(match.finder_department)}</p>
            </div>
        </div>
    </div>
</div>

<script>
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
</script>
</body>
</html>`;
}

module.exports = { renderApprovedClaimDetails };

