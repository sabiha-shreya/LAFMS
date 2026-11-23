const { escapeHtml, csrfPostScript } = require('../lib/auth');

function renderPendingPostsDetail({ item, type, csrfToken }) {
  const isLost = type === 'lost';
  const pageTitle = isLost ? 'Pending Lost Item Details' : 'Pending Found Item Details';
  const id = isLost ? item.lost_id : item.found_id;
  const imageHtml = (isLost && item.item_image)
    ? `<div class="info-item">
         <span class="info-label">Picture</span>
         <div class="info-value">
           <img src="${escapeHtml(item.item_image)}" style="max-width:250px;border-radius:10px;">
         </div>
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
<style>
* { box-sizing: border-box; }
body { background: #f5f7fb; font-family: Arial, sans-serif; color: #1f2937; }
.details-page { max-width: 1100px; margin: 40px auto; padding: 0 20px 40px; }
.page-header { text-align: center; margin-bottom: 25px; }
.page-header h1 { margin: 0; font-size: 30px; color: #111827; }
.page-header p { margin-top: 8px; color: #6b7280; }
.information-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
.info-card { background: white; border-radius: 16px; padding: 25px; box-shadow: 0 5px 20px rgba(0,0,0,.07); }
.info-card h2 { margin-top: 0; margin-bottom: 22px; font-size: 20px; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; }
.info-item { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.info-item:last-child { border-bottom: none; }
.info-label { display: block; font-size: 13px; font-weight: bold; color: #6b7280; margin-bottom: 4px; }
.info-value { font-size: 15px; color: #111827; word-break: break-word; }
.status { display: inline-block; padding: 4px 10px; border-radius: 20px; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: bold; }
.action-buttons { margin-top: 30px; display: flex; gap: 12px; }
.approve-button { background: #166534; color: white !important; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; }
.reject-button { background: #b91c1c; color: white !important; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; }
.back-button { display: inline-block; margin-top: 25px; background: #003844; color: white !important; padding: 11px 20px; border-radius: 8px; text-decoration: none; }
@media (max-width: 768px) { .information-grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="details-page">
    <div class="page-header">
        <h1>${pageTitle}</h1>
        <p>Review the submitted information before approving.</p>
    </div>

    <div class="information-grid">
        <div class="info-card">
            <h2>User Information</h2>
            <div class="info-item"><span class="info-label">Full Name</span><div class="info-value">${escapeHtml(item.full_name || 'N/A')}</div></div>
            <div class="info-item"><span class="info-label">Student ID</span><div class="info-value">${escapeHtml(item.student_id || 'N/A')}</div></div>
            <div class="info-item"><span class="info-label">Email</span><div class="info-value">${escapeHtml(item.email || 'N/A')}</div></div>
            <div class="info-item"><span class="info-label">Department</span><div class="info-value">${escapeHtml(item.department || 'N/A')}</div></div>
        </div>

        <div class="info-card">
            <h2>Item Information</h2>
            <div class="info-item"><span class="info-label">Item Name</span><div class="info-value">${escapeHtml(item.item_name)}</div></div>
            <div class="info-item"><span class="info-label">Category</span><div class="info-value">${escapeHtml(item.category)}</div></div>
            <div class="info-item"><span class="info-label">Description</span><div class="info-value">${escapeHtml(item.description || '').replace(/\n/g, '<br>')}</div></div>
            <div class="info-item"><span class="info-label">${isLost ? 'Lost Date' : 'Found Date'}</span><div class="info-value">${escapeHtml(isLost ? item.lost_date : item.found_date)}</div></div>
            <div class="info-item"><span class="info-label">Location</span><div class="info-value">${escapeHtml(isLost ? item.lost_location : item.found_location)}</div></div>
            <div class="info-item"><span class="info-label">Contact</span><div class="info-value">${escapeHtml(isLost ? item.contact_information : item.finder_contact_information)}</div></div>
            ${isLost ? `<div class="info-item"><span class="info-label">Secret Information</span><div class="info-value">${escapeHtml(item.secret_information || 'None').replace(/\n/g, '<br>')}</div></div>` : ''}
            ${imageHtml}
            <div class="info-item"><span class="info-label">Status</span><div class="info-value"><span class="status">${escapeHtml(item.status)}</span></div></div>
            <div class="info-item"><span class="info-label">Posted Date</span><div class="info-value">${escapeHtml(item.created_at)}</div></div>
        </div>
    </div>

    <div class="action-buttons">
        <a href="approve-post.php?id=${id}&type=${type}" data-post="1" class="approve-button">Approve</a>
        <a href="reject-post.php?id=${id}&type=${type}" data-post="1" class="reject-button">Reject</a>
    </div>

    <a href="pending-posts.php" class="back-button">Back to Pending Posts</a>
</div>
${csrfPostScript(csrfToken)}
</body>
</html>`;
}

function renderPendingPostsList({ pending_lost, pending_found, csrfToken }) {
  const lostRows = (pending_lost && pending_lost.length > 0) ? pending_lost.map(row => `
    <tr>
      <td>${escapeHtml(row.lost_id)}</td>
      <td>${escapeHtml(row.item_name)}</td>
      <td>${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.description)}</td>
      <td>${escapeHtml(row.full_name || 'N/A')}</td>
      <td>${escapeHtml(row.lost_date)}</td>
      <td>${escapeHtml(row.secret_information || '')}</td>
      <td><span class="status-badge">${escapeHtml(row.status)}</span></td>
      <td>
        <a href="pending-posts.php?id=${row.lost_id}&type=lost" class="view-details-btn">View Details</a>
        <a href="approve-post.php?id=${row.lost_id}&type=lost" data-post="1" class="approve-btn">Approve</a>
        <a href="reject-post.php?id=${row.lost_id}&type=lost" data-post="1" class="reject-btn">Reject</a>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="9" class="empty-message">No pending lost items found.</td></tr>`;

  const foundRows = (pending_found && pending_found.length > 0) ? pending_found.map(row => `
    <tr>
      <td>${escapeHtml(row.found_id)}</td>
      <td>${escapeHtml(row.item_name)}</td>
      <td>${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.description)}</td>
      <td>${escapeHtml(row.full_name || 'N/A')}</td>
      <td>${escapeHtml(row.found_date)}</td>
      <td><span class="status-badge">${escapeHtml(row.status)}</span></td>
      <td>
        <a href="pending-posts.php?id=${row.found_id}&type=found" class="view-details-btn">View Details</a>
        <a href="approve-post.php?id=${row.found_id}&type=found" data-post="1" class="approve-btn">Approve</a>
        <a href="reject-post.php?id=${row.found_id}&type=found" data-post="1" class="reject-btn">Reject</a>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="8" class="empty-message">No pending found items found.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pending Posts</title>
<link rel="stylesheet" href="css/style.css">
<style>
body { background: #f5f7fb; color: #1f2937; }
.container { max-width: 1250px; margin: 40px auto; padding: 0 20px 40px; }
h1 { color: #111827; margin-bottom: 8px; }
.container > p { color: #6b7280; margin-bottom: 30px; }
h2 { color: #111827; margin-top: 30px; margin-bottom: 15px; }
.table-card { background: white; border-radius: 16px; padding: 18px; box-shadow: 0 5px 20px rgba(0,0,0,.07); overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 1100px; }
th { background: #f3f4f6; color: #374151 !important; font-size: 14px; font-weight: bold; padding: 14px 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
td { padding: 13px 12px; border-bottom: 1px solid #eee; color: #374151 !important; font-size: 14px; vertical-align: middle; }
.status-badge { display: inline-block; padding: 6px 11px; border-radius: 20px; background: #fef3c7; color: #92400e !important; font-size: 12px; font-weight: bold; }
.view-details-btn { display: inline-block; padding: 8px 14px; border-radius: 8px; background: #003844; color: white !important; text-decoration: none; font-size: 13px; font-weight: 600; margin-right: 5px; margin-bottom: 5px; }
.view-details-btn:hover { background: #0fa4af; }
.approve-btn { display: inline-block; padding: 8px 14px; border-radius: 8px; background: #166534; color: white !important; text-decoration: none; font-size: 13px; font-weight: 600; margin-right: 5px; margin-bottom: 5px; }
.reject-btn { display: inline-block; padding: 8px 14px; border-radius: 8px; background: #b91c1c; color: white !important; text-decoration: none; font-size: 13px; font-weight: 600; margin-bottom: 5px; }
.back-dashboard { display: inline-block; margin-top: 22px; padding: 11px 20px; border-radius: 10px; background: #111827; color: white !important; text-decoration: none; }
.empty-message { text-align: center; padding: 35px; color: #6b7280 !important; }
</style>
</head>
<body>
<div class="container">
    <h1>Pending Posts</h1>
    <p>Posts waiting for admin approval.</p>

    <h2>Pending Lost Items</h2>
    <div class="table-card">
        <table>
            <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Posted By</th>
                <th>Date</th>
                <th>Secret Information</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            ${lostRows}
        </table>
    </div>

    <h2>Pending Found Items</h2>
    <div class="table-card">
        <table>
            <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Posted By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            ${foundRows}
        </table>
    </div>

    <a href="admin-dashboard.php" class="back-dashboard">Back to Dashboard</a>
</div>
${csrfPostScript(csrfToken)}
</body>
</html>`;
}

module.exports = { renderPendingPostsDetail, renderPendingPostsList };

