const { escapeHtml } = require('../lib/auth');

function renderFoundItemDetail({ item }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Found Item Details</title>
<link rel="stylesheet" href="css/style.css">
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
.status { display: inline-block; padding: 4px 10px; border-radius: 20px; background: #dcfce7; color: #15803d; font-size: 12px; font-weight: bold; }
.back-button { display: inline-block; margin-top: 25px; background: #003844; color: white !important; padding: 11px 20px; border-radius: 8px; text-decoration: none; }
@media (max-width: 768px) { .information-grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="details-page">
    <div class="page-header">
        <h1>Found Item Details</h1>
        <p>Complete details of the approved found item</p>
    </div>

    <div class="information-grid">
        <div class="info-card">
            <h2>Finder Information</h2>
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
            <div class="info-item"><span class="info-label">Found Date</span><div class="info-value">${escapeHtml(item.found_date)}</div></div>
            <div class="info-item"><span class="info-label">Found Location</span><div class="info-value">${escapeHtml(item.found_location)}</div></div>
            <div class="info-item"><span class="info-label">Contact Information</span><div class="info-value">${escapeHtml(item.finder_contact_information)}</div></div>
            <div class="info-item"><span class="info-label">Status</span><div class="info-value"><span class="status">${escapeHtml(item.status)}</span></div></div>
            <div class="info-item"><span class="info-label">Posted Date</span><div class="info-value">${escapeHtml(item.created_at)}</div></div>
        </div>
    </div>

    <a href="view-found-items.php" class="back-button">← Back to Found Items</a>
</div>
</body>
</html>`;
}

function renderFoundItemsList({ items }) {
  const rowsHtml = (items && items.length > 0) ? items.map(row => `
    <tr>
      <td>${escapeHtml(row.found_id)}</td>
      <td>${escapeHtml(row.item_name)}</td>
      <td>${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.description)}</td>
      <td>${escapeHtml(row.found_date)}</td>
      <td>${escapeHtml(row.found_location)}</td>
      <td>${escapeHtml(row.finder_contact_information)}</td>
      <td><span style="display:inline-block;padding:4px 10px;border-radius:20px;background:#dcfce7;color:#15803d;font-size:12px;font-weight:bold;">${escapeHtml(row.status)}</span></td>
      <td><a href="view-found-items.php?id=${row.found_id}" class="btn" style="padding:6px 12px;font-size:12px;">View Details</a></td>
    </tr>
  `).join('') : `<tr><td colspan="9" style="text-align:center;padding:30px;color:#6b7280;">No found items available</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>View All Found Items</title>
<link rel="stylesheet" href="css/style.css">
<style>
body { background: #f5f7fb; color: #1f2937; }
.found-page { max-width: 1300px; margin: 40px auto; padding: 0 20px 40px; }
.page-header { text-align: center; margin-bottom: 25px; }
.page-header h1 { margin: 0; font-size: 30px; color: #111827; }
.page-header p { margin-top: 8px; color: #6b7280; }
.table-card { background: white; border-radius: 16px; padding: 18px; box-shadow: 0 5px 20px rgba(0,0,0,.07); overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 1000px; }
th { background: #003844; color: white; padding: 12px; text-align: left; font-size: 13px; }
td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: middle; }
.back-dashboard { display: inline-block; margin-top: 22px; padding: 11px 20px; border-radius: 10px; background: #111827; color: white !important; text-decoration: none; }
</style>
</head>
<body>
<div class="found-page">
    <div class="page-header">
        <h1>View All Found Items</h1>
        <p>All approved found items</p>
    </div>

    <div class="table-card">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Found Date</th>
                    <th>Location</th>
                    <th>Finder Contact</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>
    </div>

    <a href="admin-dashboard.php" class="back-dashboard">← Back to Dashboard</a>
</div>
</body>
</html>`;
}

module.exports = { renderFoundItemDetail, renderFoundItemsList };

