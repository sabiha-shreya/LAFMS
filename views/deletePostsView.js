const { escapeHtml, csrfPostScript } = require('../lib/auth');

function renderDeletePostsView({ lostPosts = [], foundPosts = [], csrfToken = '' }) {
  const lostRows = lostPosts.length > 0
    ? lostPosts.map(post => `
      <tr>
        <td>#${parseInt(post.lost_id, 10)}</td>
        <td>
          <strong>${escapeHtml(post.item_name)}</strong>
          <br>
          <span class="lost-label">LOST</span>
        </td>
        <td>${escapeHtml(post.category)}</td>
        <td>${escapeHtml(post.full_name || 'Unknown User')}</td>
        <td class="status">${escapeHtml(post.status)}</td>
        <td>
          <a
            href="delete-posts.php?delete_lost=${parseInt(post.lost_id, 10)}"
            data-post="1"
            class="delete-btn"
            onclick="return confirm('Are you sure you want to delete this lost item post? Related matches and notifications will also be removed.');"
          >
            Delete
          </a>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="6" class="empty">No lost item posts available.</td>
      </tr>
    `;

  const foundRows = foundPosts.length > 0
    ? foundPosts.map(post => `
      <tr>
        <td>#${parseInt(post.found_id, 10)}</td>
        <td>
          <strong>${escapeHtml(post.item_name)}</strong>
          <br>
          <span class="found-label">FOUND</span>
        </td>
        <td>${escapeHtml(post.category)}</td>
        <td>${escapeHtml(post.full_name || 'Unknown User')}</td>
        <td class="status">${escapeHtml(post.status)}</td>
        <td>
          <a
            href="delete-posts.php?delete_found=${parseInt(post.found_id, 10)}"
            data-post="1"
            class="delete-btn"
            onclick="return confirm('Are you sure you want to delete this found item post? Related matches and notifications will also be removed.');"
          >
            Delete
          </a>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="6" class="empty">No found item posts available.</td>
      </tr>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete Posts</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        body {
            background: #f5f7f9;
        }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 30px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }
        h1 {
            margin-bottom: 8px;
            color: #003844;
        }
        .subtitle {
            color: #6b7280;
            margin-bottom: 30px;
        }
        .section-title {
            margin-top: 30px;
            margin-bottom: 15px;
            color: #003844;
            font-size: 20px;
        }
        .table-wrapper {
            overflow-x: auto;
            margin-bottom: 25px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        th {
            background: #003844;
            color: white;
            padding: 13px;
            text-align: left;
        }
        td {
            padding: 13px;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:hover {
            background: #f8fafc;
        }
        .lost-label {
            display: inline-block;
            padding: 5px 9px;
            border-radius: 6px;
            background: #fee2e2;
            color: #b91c1c;
            font-size: 12px;
            font-weight: bold;
        }
        .found-label {
            display: inline-block;
            padding: 5px 9px;
            border-radius: 6px;
            background: #dcfce7;
            color: #15803d;
            font-size: 12px;
            font-weight: bold;
        }
        .status {
            font-size: 13px;
            font-weight: 600;
        }
        .delete-btn {
            display: inline-block;
            padding: 8px 13px;
            background: #dc2626;
            color: white;
            text-decoration: none;
            border-radius: 7px;
            font-size: 13px;
            font-weight: bold;
        }
        .delete-btn:hover {
            background: #b91c1c;
        }
        .empty {
            text-align: center;
            color: #777;
            padding: 25px;
        }
        .back-btn {
            display: inline-block;
            margin-top: 15px;
            padding: 11px 20px;
            background: #003844;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
        }
        .back-btn:hover {
            background: #005766;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Delete Posts</h1>
    <p class="subtitle">Remove unwanted or invalid lost and found posts.</p>

    <!-- LOST POSTS -->
    <h2 class="section-title">Lost Item Posts</h2>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Post ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Posted By</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${lostRows}
            </tbody>
        </table>
    </div>

    <!-- FOUND POSTS -->
    <h2 class="section-title">Found Item Posts</h2>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Post ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Posted By</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${foundRows}
            </tbody>
        </table>
    </div>

    <a href="admin-dashboard.php" class="back-btn">← Back to Dashboard</a>
</div>

${csrfPostScript(csrfToken)}
</body>
</html>`;
}

module.exports = { renderDeletePostsView };

