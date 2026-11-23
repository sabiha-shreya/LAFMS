const { escapeHtml } = require('../lib/auth');

function renderMyMatches({ matches, user_id }) {
  user_id = parseInt(user_id, 10);

  const matchCardsHtml = (matches && matches.length > 0) ? matches.map(row => {
    const isOwner = parseInt(row.lost_user_id, 10) === user_id;
    const isFinder = parseInt(row.found_user_id, 10) === user_id;
    const matchId = parseInt(row.match_id, 10);
    const percentage = parseFloat(row.match_percentage).toFixed(2);
    let claimStatus = (row.claim_status || '').trim();
    if (!claimStatus) claimStatus = 'Not Claimed';

    const ownerStatus = (row.owner_status || '').trim().toLowerCase();
    const finderStatus = (row.finder_status || '').trim().toLowerCase();

    // Image for lost item
    const lostImageHtml = row.lost_item_image
      ? `<div class="lost-item-image"><img src="${escapeHtml(row.lost_item_image)}" alt="Lost Item"></div>`
      : '';

    // Action button area
    let actionHtml = '';
    if (isOwner) {
      if (claimStatus === 'Not Claimed') {
        actionHtml = `
          <form action="match-action.php" method="POST">
            <input type="hidden" name="match_id" value="${matchId}">
            <input type="hidden" name="action" value="claim">
            <button type="submit" class="action-button claim-button">📢 Claim Item</button>
          </form>`;
      } else if (claimStatus === 'Pending') {
        actionHtml = `<span class="waiting-text">⏳ Claim Request Sent</span>`;
      } else if (claimStatus === 'Rejected') {
        actionHtml = `<span class="status-badge rejected">✗ Claim Rejected</span>`;
      } else if (claimStatus === 'Approved') {
        if (ownerStatus === 'received') {
          actionHtml = `
            <span class="status-badge received">✓ Item Received</span>
            <a href="approved-claim-details.php?match_id=${matchId}" class="action-button" style="background:#003844;">View Exchange</a>`;
        } else {
          actionHtml = `
            <form action="match-action.php" method="POST" style="display:inline-block;">
              <input type="hidden" name="match_id" value="${matchId}">
              <input type="hidden" name="action" value="received">
              <button type="submit" class="action-button receive-button">📦 Receive</button>
            </form>
            <a href="approved-claim-details.php?match_id=${matchId}" class="action-button" style="background:#003844;">View Exchange</a>`;
        }
      }
    } else if (isFinder) {
      if (claimStatus === 'Not Claimed') {
        actionHtml = `<span class="status-badge not-claimed">○ Not Claimed</span>`;
      } else if (claimStatus === 'Pending') {
        actionHtml = `
          <span class="status-badge pending">⏳ Claim Pending</span>
          <a href="view-claim.php?match_id=${matchId}" class="action-button claim-button">Review Claim</a>`;
      } else if (claimStatus === 'Rejected') {
        actionHtml = `<span class="status-badge rejected">✗ Claim Rejected</span>`;
      } else if (claimStatus === 'Approved') {
        if (finderStatus === 'give back') {
          actionHtml = `
            <span class="status-badge approved">✓ Given Back</span>
            <a href="approved-claim-details.php?match_id=${matchId}" class="action-button" style="background:#003844;">View Exchange</a>`;
        } else {
          actionHtml = `
            <form action="match-action.php" method="POST" style="display:inline-block;">
              <input type="hidden" name="match_id" value="${matchId}">
              <input type="hidden" name="action" value="given_back">
              <button type="submit" class="action-button give-button">🤝 Give Back</button>
            </form>
            <a href="approved-claim-details.php?match_id=${matchId}" class="action-button" style="background:#003844;">View Exchange</a>`;
        }
      }
    }

    let claimBadge = '';
    if (claimStatus === 'Not Claimed') {
      claimBadge = `<span class="status-badge not-claimed">○ Not Claimed</span>`;
    } else if (claimStatus === 'Pending') {
      claimBadge = `<span class="status-badge pending">⏳ Claim Pending</span>`;
    } else if (claimStatus === 'Approved') {
      claimBadge = `<span class="status-badge approved">✓ Claim Approved</span>`;
    } else if (claimStatus === 'Rejected') {
      claimBadge = `<span class="status-badge rejected">✗ Claim Rejected</span>`;
    } else {
      claimBadge = `<span class="status-badge pending">${escapeHtml(claimStatus)}</span>`;
    }

    return `
      <div class="match-card">
        <div class="match-top">
          <div class="match-id">
            Match ID: <strong>${matchId}</strong>
            ${isOwner ? '<span class="role-badge owner-role">👤 Owner</span>' : ''}
            ${isFinder ? '<span class="role-badge finder-role">🔎 Finder</span>' : ''}
          </div>
          <div class="match-percentage">
            ⭐ ${percentage}% Match
          </div>
        </div>

        <div class="items-grid">
          <!-- LOST ITEM -->
          <div class="item-box lost-box">
            <div class="item-label lost-label">🔴 LOST ITEM</div>
            <h2>${escapeHtml(row.lost_item_name)}</h2>
            ${lostImageHtml}
            <div class="info-row"><span class="info-label">Category:</span> <span class="info-value">${escapeHtml(row.lost_category)}</span></div>
            <div class="info-row"><span class="info-label">Lost Date:</span> <span class="info-value">${escapeHtml(row.lost_date)}</span></div>
            <div class="info-row"><span class="info-label">Location:</span> <span class="info-value">${escapeHtml(row.lost_location)}</span></div>
            <div class="info-row"><span class="info-label">Description:</span> <span class="info-value">${escapeHtml(row.lost_description || 'N/A')}</span></div>
          </div>

          <!-- FOUND ITEM -->
          <div class="item-box found-box">
            <div class="item-label found-label">🟢 FOUND ITEM</div>
            <h2>${escapeHtml(row.found_item_name)}</h2>
            <div class="info-row"><span class="info-label">Category:</span> <span class="info-value">${escapeHtml(row.found_category)}</span></div>
            <div class="info-row"><span class="info-label">Found Date:</span> <span class="info-value">${escapeHtml(row.found_date)}</span></div>
            <div class="info-row"><span class="info-label">Location:</span> <span class="info-value">${escapeHtml(row.found_location)}</span></div>
            <div class="info-row"><span class="info-label">Description:</span> <span class="info-value">${escapeHtml(row.found_description || 'N/A')}</span></div>
          </div>
        </div>

        <div class="status-area">
          <div>
            <div class="claim-status-title">Claim Status</div>
            ${claimBadge}
          </div>
          <div class="action-area">
            <span class="action-title">Action:</span>
            ${actionHtml}
          </div>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="no-match">
      <h2>No Matches Found Yet</h2>
      <p>When our system finds matching lost and found items with >= 80% similarity, they will appear here.</p>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Matches - Campus Lost & Found</title>
<link rel="stylesheet" href="css/style.css">
<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f4f7f9; color: #334155; }
.matches-container { width: 92%; max-width: 1100px; margin: 35px auto 50px; }
.matches-header { background: white; padding: 25px 20px; border-radius: 16px; text-align: center; margin-bottom: 25px; border: 1px solid #e5e7eb; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.matches-header h1 { margin: 0; color: #003844; font-size: 30px; }
.matches-header p { margin: 8px 0 0; color: #64748b; font-size: 14px; }
.back-link { display: inline-block; margin-top: 14px; text-decoration: none; color: #0fa4af; font-weight: bold; font-size: 13px; }
.back-link:hover { text-decoration: underline; }
.match-card { background: white; border-radius: 16px; margin-bottom: 22px; padding: 22px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.06); }
.match-top { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #edf2f7; }
.match-id { color: #64748b; font-size: 13px; }
.match-id strong { color: #334155; }
.match-percentage { padding: 7px 13px; border-radius: 20px; background: #ecfdf5; color: #047857; font-weight: bold; font-size: 14px; border: 1px solid #a7f3d0; }
.role-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 11px; font-weight: bold; margin-left: 7px; }
.owner-role { background: #fff1f2; color: #be123c; }
.finder-role { background: #ecfdf5; color: #15803d; }
.items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 20px; }
.item-box { padding: 18px; border-radius: 13px; background: #f8fafc; border: 1px solid #e2e8f0; }
.lost-box { border-top: 3px solid #ef4444; }
.found-box { border-top: 3px solid #10b981; }
.item-label { font-size: 11px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 7px; }
.lost-label { color: #dc2626; }
.found-label { color: #059669; }
.item-box h2 { margin: 0 0 12px; color: #003844; font-size: 19px; }
.lost-item-image { width: 150px; height: 120px; margin: 0 auto 15px; border-radius: 10px; overflow: hidden; background: #f1f5f9; border: 1px solid #e2e8f0; }
.lost-item-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 13px; }
.info-label { color: #64748b; font-weight: 600; }
.info-value { color: #0f172a; text-align: right; max-width: 65%; word-break: break-word; }
.status-area { display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #edf2f7; flex-wrap: wrap; gap: 12px; }
.claim-status-title { font-size: 11px; color: #64748b; margin-bottom: 5px; font-weight: bold; text-transform: uppercase; }
.status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
.pending { background: #fef3c7; color: #b45309; }
.approved { background: #dcfce7; color: #15803d; }
.rejected { background: #fee2e2; color: #b91c1c; }
.received { background: #eff6ff; color: #2563eb; }
.not-claimed { background: #f1f5f9; color: #64748b; }
.action-area { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.action-title { font-size: 12px; color: #64748b; }
.action-button { border: none; padding: 9px 15px; border-radius: 8px; color: white; text-decoration: none; font-weight: bold; font-size: 12px; cursor: pointer; transition: 0.2s; }
.action-button:hover { transform: translateY(-1px); }
.claim-button { background: #0d9488; }
.claim-button:hover { background: #0f766e; }
.receive-button { background: #2563eb; }
.receive-button:hover { background: #1d4ed8; }
.give-button { background: #16a34a; }
.give-button:hover { background: #15803d; }
.waiting-text { color: #64748b; font-weight: bold; font-size: 12px; }
.no-match { background: white; padding: 50px 20px; text-align: center; border-radius: 16px; border: 1px solid #e2e8f0; }
.no-match h2 { margin: 0 0 10px; color: #003844; }
.no-match p { margin: 0; color: #64748b; font-size: 14px; }
@media (max-width: 768px) {
    .items-grid { grid-template-columns: 1fr; }
    .status-area { flex-direction: column; align-items: flex-start; }
}
</style>
</head>
<body>
<div class="matches-container">
    <div class="matches-header">
        <h1>My Matches</h1>
        <p>Possible matches found by our system (>= 80% similarity)</p>
        <a href="dashboard.php" class="back-link">← Back to Dashboard</a>
    </div>
    ${matchCardsHtml}
</div>
</body>
</html>`;
}

module.exports = { renderMyMatches };

