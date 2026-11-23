const { escapeHtml } = require('../lib/auth');

function renderAdminApprovedClaimsView({ claims = [] }) {
  const claimRows = claims.length > 0
    ? claims.map(row => `
      <tr>
        <!-- MATCH ID -->
        <td>${parseInt(row.match_id, 10)}</td>

        <!-- LOST ITEM -->
        <td>${escapeHtml(row.lost_item_name)}</td>

        <!-- CLAIM REQUESTED BY / OWNER -->
        <td>
          <strong>${escapeHtml(row.owner_name || 'N/A')}</strong>
          <br>
          <small>Student ID: ${escapeHtml(row.owner_student_id || 'N/A')}</small>
          <br>
          <small>Email: ${escapeHtml(row.owner_email || 'N/A')}</small>
        </td>

        <!-- FOUND ITEM -->
        <td>${escapeHtml(row.found_item_name)}</td>

        <!-- APPROVED BY / FINDER -->
        <td>
          <strong>${escapeHtml(row.finder_name || 'N/A')}</strong>
          <br>
          <small>Student ID: ${escapeHtml(row.finder_student_id || 'N/A')}</small>
          <br>
          <small>Email: ${escapeHtml(row.finder_email || 'N/A')}</small>
        </td>

        <!-- MATCH PERCENTAGE -->
        <td>${escapeHtml(row.match_percentage)}%</td>

        <!-- STATUS -->
        <td><strong>Approved</strong></td>

        <!-- ACTION -->
        <td>
          <a href="approved-claim-details.php?match_id=${parseInt(row.match_id, 10)}" class="btn">View Claim</a>
        </td>
      </tr>
    `).join('')
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Approved Claims</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <!-- PAGE HEADER -->
    <h1>Approved Claims</h1>
    <p>Claims approved by the finder are shown below.</p>
    <br>

    ${claims.length > 0 ? `
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Match ID</th>
                    <th>Lost Item</th>
                    <th>Claim Requested By</th>
                    <th>Found Item</th>
                    <th>Approved By</th>
                    <th>Match %</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${claimRows}
            </tbody>
        </table>
    </div>
    ` : `
    <p>No approved claims found.</p>
    `}

    <br><br>
    <a href="admin-dashboard.php" class="btn">Back to Dashboard</a>
</div>
<script src="js/script.js"></script>
</body>
</html>`;
}

module.exports = { renderAdminApprovedClaimsView };

