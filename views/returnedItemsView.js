const { escapeHtml } = require('../lib/auth');

function renderReturnedItemsView({ lostItems = [], foundItems = [] }) {
  const lostRows = lostItems.length > 0
    ? lostItems.map(row => `
      <tr>
        <td>${escapeHtml(row.lost_id)}</td>
        <td>${escapeHtml(row.item_name)}</td>
        <td>${escapeHtml(row.category)}</td>
        <td>${escapeHtml(row.owner_name || 'Unknown')}</td>
        <td>${escapeHtml(row.status)}</td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="5" align="center">No returned lost items available</td>
      </tr>
    `;

  const foundRows = foundItems.length > 0
    ? foundItems.map(row => `
      <tr>
        <td>${escapeHtml(row.found_id)}</td>
        <td>${escapeHtml(row.item_name)}</td>
        <td>${escapeHtml(row.category)}</td>
        <td>${escapeHtml(row.owner_name || 'Unknown')}</td>
        <td>${escapeHtml(row.status)}</td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="5" align="center">No returned found items available</td>
      </tr>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Returned Items</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <h1>Returned Items</h1>
    <p>Items that have been successfully returned to their owners.</p>

    <!-- RETURNED LOST ITEMS -->
    <h2>Returned Lost Items</h2>
    <table border="1" width="100%" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Owner Name</th>
            <th>Status</th>
        </tr>
        ${lostRows}
    </table>

    <br><br>

    <!-- RETURNED FOUND ITEMS -->
    <h2>Returned Found Items</h2>
    <table border="1" width="100%" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Owner Name</th>
            <th>Status</th>
        </tr>
        ${foundRows}
    </table>

    <br><br>
    <a href="admin-dashboard.php" class="btn">Back to Dashboard</a>
</div>
</body>
</html>`;
}

module.exports = { renderReturnedItemsView };

