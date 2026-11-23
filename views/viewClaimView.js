const { escapeHtml } = require('../lib/auth');

function renderViewClaim({ match, match_id }) {
  const lostImage = match.lost_item_image ? escapeHtml(match.lost_item_image) : '';
  const claimStatus = match.claim_status || 'Pending';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claim Request Review</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
<div class="max-w-5xl mx-auto px-4 py-8">
    <a href="my-matches.php" class="inline-flex items-center gap-2 mb-6 bg-white px-4 py-2 rounded-xl shadow text-gray-700 font-medium hover:bg-gray-50">
        ← Back to My Matches
    </a>

    <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Claim Request Review</h1>
        <p class="text-gray-500 mt-1">Review the lost and found item information before responding.</p>
    </div>

    <!-- MATCH INFORMATION -->
    <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <p class="text-gray-500 text-sm">Match Percentage</p>
                <p class="text-3xl font-bold text-green-600">${escapeHtml(match.match_percentage)}%</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">Claim Status</p>
                <p class="font-bold text-lg text-gray-800">${escapeHtml(claimStatus)}</p>
            </div>
        </div>
    </div>

    <!-- LOST ITEM INFORMATION -->
    <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 class="text-xl font-bold mb-5 text-red-600">Lost Item Information</h2>
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
            <div class="md:col-span-2 bg-yellow-50 border border-yellow-300 p-4 rounded-xl">
                <p class="text-yellow-700 font-bold mb-1">🔐 Secret Information</p>
                <p class="text-gray-800">${escapeHtml(match.lost_secret_information || 'None provided').replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    </div>

    <!-- FOUND ITEM INFORMATION -->
    <div class="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 class="text-xl font-bold mb-5 text-green-600">Found Item Information</h2>
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

    <!-- CLAIM ACTION -->
    ${claimStatus === 'Pending' ? `
        <div class="bg-white rounded-2xl shadow p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">Claim Request</h2>
            <p class="text-gray-500 mb-5">Do you want to accept or reject this claim request?</p>
            <div class="flex flex-wrap gap-3">
                <form action="approve-claim.php" method="POST">
                    <input type="hidden" name="match_id" value="${match_id}">
                    <button type="submit" class="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
                        ✓ Approve Claim
                    </button>
                </form>
                <form action="reject-claim.php" method="POST">
                    <input type="hidden" name="match_id" value="${match_id}">
                    <button type="submit" class="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700">
                        ✕ Reject Claim
                    </button>
                </form>
            </div>
        </div>
    ` : ''}

    ${claimStatus === 'Approved' ? `
        <div class="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h2 class="text-xl font-bold text-green-700 mb-2">✓ Claim Approved</h2>
            <p class="text-gray-700 mb-4">This claim request has been approved.</p>
            <a href="approved-claim-details.php?match_id=${match_id}" class="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
                View Approved Claim Details
            </a>
        </div>
    ` : ''}

    ${claimStatus === 'Rejected' ? `
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 class="text-xl font-bold text-red-700 mb-2">✕ Claim Rejected</h2>
            <p class="text-gray-700">This claim request has been rejected.</p>
        </div>
    ` : ''}
</div>
</body>
</html>`;
}

module.exports = { renderViewClaim };

