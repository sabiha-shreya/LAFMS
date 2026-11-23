const { escapeHtml } = require('../lib/auth');

function renderAdminDashboard({ admin_username, pending_lost, pending_found }) {
  let notifsHtml = '';

  if (pending_lost && pending_lost.length > 0) {
    notifsHtml += pending_lost.map(row => `
      <div>
        <p>🔔 <b>New Lost Item Post</b><br>A new lost item <b>${escapeHtml(row.item_name)}</b> is waiting for approval.</p>
      </div>
    `).join('');
  }

  if (pending_found && pending_found.length > 0) {
    notifsHtml += pending_found.map(row => `
      <div>
        <p>🔔 <b>New Found Item Post</b><br>A new found item <b>${escapeHtml(row.item_name)}</b> is waiting for approval.</p>
      </div>
    `).join('');
  }

  if ((!pending_lost || pending_lost.length === 0) && (!pending_found || pending_found.length === 0)) {
    notifsHtml = `<p>No New Notifications</p>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <h1>Admin Dashboard</h1>
    <p>Welcome, ${escapeHtml(admin_username)}!</p>

    <h2>Notifications</h2>
    ${notifsHtml}

    <br><br>

    <div class="dashboard-buttons">
        <a href="view-lost-items.php" class="btn">View All Lost Items</a>
        <a href="view-found-items.php" class="btn">View All Found Items</a>
        <a href="pending-posts.php" class="btn">Pending Posts</a>
        <a href="returned-items.php" class="btn">Returned Items</a>
        <a href="manage-users.php" class="btn">Manage Users</a>
        <a href="delete-posts.php" class="btn">Delete Posts</a>
        <a href="admin-approved-claims.php" class="btn">Approve Claim</a>
        <a href="admin-logout.php">Logout</a>
    </div>
</div>

<script src="js/script.js"></script>
</body>
</html>`;
}

module.exports = { renderAdminDashboard };

