const { escapeHtml } = require('../lib/auth');

function renderViewClaim({ match, claim, match_id, currentUserId }) {
  const m = match || claim || {};
  const id = match_id || m.match_id;
  const lostImage = m.lost_item_image ? escapeHtml(m.lost_item_image) : '';
  const foundImage = m.found_item_image || m.found_image ? escapeHtml(m.found_item_image || m.found_image) : '';
  const claimStatus = m.claim_status || 'Pending';
  const percentage = parseFloat(m.match_percentage || 0).toFixed(2);
  const secretInfo = m.lost_secret_information || m.secret_information || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claim Request Review - Campus Lost & Found</title>
    <script src="js/tailwind.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/lucide.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gray-100 min-h-screen text-slate-800">
<div class="max-w-5xl mx-auto px-4 py-8">
    <a href="my-matches.php" class="inline-flex items-center gap-2 mb-6 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to My Matches
    </a>

    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Claim Request Review</h1>
            <p class="text-gray-500 mt-1">Review the claimer's information and secret verification details before responding.</p>
        </div>
        <div class="flex items-center gap-3">
            <span class="px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold rounded-xl text-lg flex items-center gap-1.5 shadow-sm">
                ⭐ ${percentage}% Match
            </span>
            <span class="px-4 py-2 ${claimStatus === 'Approved' ? 'bg-green-100 text-green-800 border-green-300' : (claimStatus === 'Rejected' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-amber-100 text-amber-800 border-amber-300')} border font-semibold rounded-xl text-sm">
                Status: ${escapeHtml(claimStatus)}
            </span>
        </div>
    </div>

    <!-- 👤 CLAIMER (OWNER) PROFILE INFORMATION -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                👤
            </div>
            <div>
                <h2 class="text-xl font-bold text-gray-900">Claimer Profile Information</h2>
                <p class="text-gray-500 text-xs">Details of the user requesting to claim this found item</p>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p class="text-gray-500 text-xs font-semibold uppercase">Full Name</p>
                <p class="font-bold text-gray-900 text-base mt-0.5">${escapeHtml(m.requester_name || 'N/A')}</p>
            </div>
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p class="text-gray-500 text-xs font-semibold uppercase">Student ID</p>
                <p class="font-bold text-gray-900 text-base mt-0.5">${escapeHtml(m.requester_student_id || 'N/A')}</p>
            </div>
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p class="text-gray-500 text-xs font-semibold uppercase">Department</p>
                <p class="font-bold text-gray-900 text-base mt-0.5">${escapeHtml(m.requester_department || 'N/A')}</p>
            </div>
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 sm:col-span-2">
                <p class="text-gray-500 text-xs font-semibold uppercase">University Email</p>
                <p class="font-semibold text-gray-900 text-sm mt-0.5">${escapeHtml(m.requester_email || 'N/A')}</p>
            </div>
            <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p class="text-gray-500 text-xs font-semibold uppercase">Contact Phone / Info</p>
                <p class="font-semibold text-gray-900 text-sm mt-0.5">${escapeHtml(m.lost_contact_information || m.lost_contact || 'N/A')}</p>
            </div>
        </div>
    </div>

    <!-- 🔐 SECRET INFORMATION VERIFICATION BOX -->
    <div class="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-6 shadow-sm">
        <div class="flex items-start gap-3.5 mb-3">
            <span class="text-2xl mt-0.5">🔐</span>
            <div>
                <h2 class="text-lg font-bold text-amber-950">Secret Information (Owner Verification)</h2>
                <p class="text-amber-800 text-xs mt-0.5">
                    This confidential detail was entered by the owner when posting the lost item (e.g. wallpapers, unique markings, serial numbers, engravings, lock screens, internal contents). Cross-check this with the physical item you found.
                </p>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-amber-200 mt-2">
            <p class="text-gray-900 font-semibold text-base whitespace-pre-wrap">${secretInfo ? escapeHtml(secretInfo) : '<span class="text-gray-400 italic font-normal">No secret information was provided by the owner.</span>'}</p>
        </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-6">
        <!-- 🔴 LOST ITEM INFORMATION -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h2 class="text-lg font-bold text-red-600 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                        Claimed Lost Item
                    </h2>
                    <span class="text-xs bg-red-50 text-red-700 font-semibold px-2.5 py-1 rounded-full">Lost Post</span>
                </div>

                ${lostImage ? `
                    <div class="mb-4">
                        <p class="text-gray-400 text-xs font-semibold uppercase mb-1">Picture</p>
                        <div class="w-full h-44 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                            <img src="${lostImage}" alt="${escapeHtml(m.lost_item_name)}" class="max-w-full max-h-full object-contain p-2">
                        </div>
                    </div>
                ` : ''}

                <div class="space-y-3">
                    <div>
                        <p class="text-gray-500 text-xs font-medium">Item Name</p>
                        <p class="font-bold text-gray-900 text-base">${escapeHtml(m.lost_item_name || m.lost_name)}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <p class="text-gray-500 text-xs font-medium">Category</p>
                            <p class="font-semibold text-gray-800 text-sm">${escapeHtml(m.lost_category)}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 text-xs font-medium">Lost Date</p>
                            <p class="font-semibold text-gray-800 text-sm">${escapeHtml(m.lost_date)}</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-gray-500 text-xs font-medium">Lost Location</p>
                        <p class="font-semibold text-gray-800 text-sm">${escapeHtml(m.lost_location)}</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p class="text-gray-500 text-xs font-semibold uppercase mb-1">Description</p>
                        <p class="text-gray-800 text-sm whitespace-pre-wrap">${escapeHtml(m.lost_description || 'No description provided')}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🟢 FOUND ITEM INFORMATION -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h2 class="text-lg font-bold text-emerald-600 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                        Your Found Item
                    </h2>
                    <span class="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">Found Post</span>
                </div>

                ${foundImage ? `
                    <div class="mb-4">
                        <p class="text-gray-400 text-xs font-semibold uppercase mb-1">Picture</p>
                        <div class="w-full h-44 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                            <img src="${foundImage}" alt="${escapeHtml(m.found_item_name)}" class="max-w-full max-h-full object-contain p-2">
                        </div>
                    </div>
                ` : ''}

                <div class="space-y-3">
                    <div>
                        <p class="text-gray-500 text-xs font-medium">Item Name</p>
                        <p class="font-bold text-gray-900 text-base">${escapeHtml(m.found_item_name || m.found_name)}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <p class="text-gray-500 text-xs font-medium">Category</p>
                            <p class="font-semibold text-gray-800 text-sm">${escapeHtml(m.found_category)}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 text-xs font-medium">Found Date</p>
                            <p class="font-semibold text-gray-800 text-sm">${escapeHtml(m.found_date)}</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-gray-500 text-xs font-medium">Found Location</p>
                        <p class="font-semibold text-gray-800 text-sm">${escapeHtml(m.found_location)}</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p class="text-gray-500 text-xs font-semibold uppercase mb-1">Description</p>
                        <p class="text-gray-800 text-sm whitespace-pre-wrap">${escapeHtml(m.found_description || 'No description provided')}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- CLAIM ACTIONS -->
    ${claimStatus === 'Pending' ? `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Respond to Claim Request</h2>
            <p class="text-gray-600 mb-5 text-sm">After reviewing the claimer's information and secret information, accept or reject this claim request. The claimer will receive an instant notification with your decision.</p>
            <div class="flex flex-wrap gap-4">
                <form action="approve-claim.php" method="POST">
                    <input type="hidden" name="match_id" value="${id}">
                    <button type="submit" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition">
                        <i data-lucide="check" class="w-5 h-5"></i> Accept Claim Request
                    </button>
                </form>
                <form action="reject-claim.php" method="POST">
                    <input type="hidden" name="match_id" value="${id}">
                    <button type="submit" onclick="return confirm('Are you sure you want to reject this claim request?');" class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition">
                        <i data-lucide="x" class="w-5 h-5"></i> Reject Claim Request
                    </button>
                </form>
            </div>
        </div>
    ` : ''}

    ${claimStatus === 'Approved' ? `
        <div class="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
                <h2 class="text-xl font-bold text-green-800 mb-1">✓ Claim Approved</h2>
                <p class="text-green-700 text-sm">You approved this claim request. The claimer has been notified to coordinate the item return.</p>
            </div>
            <a href="approved-claim-details.php?match_id=${id}" class="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition">
                <i data-lucide="file-text" class="w-4 h-4"></i> View Exchange Details
            </a>
        </div>
    ` : ''}

    ${claimStatus === 'Rejected' ? `
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 class="text-xl font-bold text-red-800 mb-1">✕ Claim Rejected</h2>
            <p class="text-red-700 text-sm">This claim request was rejected. The claimer has been notified.</p>
        </div>
    ` : ''}
</div>
<script>
    if (window.lucide) {
        lucide.createIcons();
    }
</script>
</body>
</html>`;
}

module.exports = { renderViewClaim };


