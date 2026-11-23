const { escapeHtml, csrfPostScript } = require('../lib/auth');

function renderManageUsersView({ users = [], deleted = false, csrfToken = '' }) {
  const userRows = users.length > 0
    ? users.map(user => `
      <tr>
        <td>
          <span class="user-id">#${parseInt(user.user_id, 10)}</span>
        </td>
        <td>
          <span class="user-name">${escapeHtml(user.full_name)}</span>
        </td>
        <td>
          <span class="student-id">${escapeHtml(user.student_id)}</span>
        </td>
        <td>
          <span class="email">${escapeHtml(user.email)}</span>
        </td>
        <td>
          <span class="department">${escapeHtml(user.department)}</span>
        </td>
        <td>
          <span class="date">${escapeHtml(user.created_at)}</span>
        </td>
        <td>
          <a
            href="manage-users.php?delete_id=${parseInt(user.user_id, 10)}"
            data-post="1"
            class="delete-btn"
            onclick="return confirm('Are you sure you want to delete this user? The user notifications will also be deleted.');"
          >
            🗑 Delete
          </a>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td colspan="7" class="empty">No users available.</td>
      </tr>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Users</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #eef7f8, #f8fafc);
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
        }
        .page-container {
            max-width: 1250px;
            margin: 45px auto;
            padding: 0 20px;
        }
        .page-header {
            background: #003844;
            color: white;
            padding: 28px 30px;
            border-radius: 18px 18px 0 0;
            box-shadow: 0 8px 25px rgba(0, 56, 68, 0.15);
        }
        .page-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
        }
        .page-header p {
            margin: 7px 0 0;
            color: #cce9ec;
            font-size: 14px;
        }
        .content-card {
            background: white;
            padding: 25px;
            border-radius: 0 0 18px 18px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
        }
        .success-message {
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        .table-wrapper {
            width: 100%;
            overflow-x: auto;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
        }
        table {
            width: 100%;
            min-width: 900px;
            border-collapse: collapse;
        }
        thead {
            background: #003844;
        }
        th {
            color: white;
            padding: 15px;
            text-align: left;
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
        }
        td {
            padding: 15px;
            border-bottom: 1px solid #edf0f2;
            font-size: 14px;
            vertical-align: middle;
        }
        tbody tr {
            transition: background 0.2s ease;
        }
        tbody tr:hover {
            background: #f7fbfc;
        }
        tbody tr:last-child td {
            border-bottom: none;
        }
        .user-id {
            font-weight: 800;
            color: #003844;
        }
        .user-name {
            font-weight: 700;
            color: #111827;
        }
        .student-id {
            display: inline-block;
            background: #eef7f8;
            color: #006b7a;
            padding: 5px 9px;
            border-radius: 7px;
            font-size: 12px;
            font-weight: 700;
        }
        .email {
            color: #475569;
        }
        .department {
            display: inline-block;
            background: #f1f5f9;
            color: #475569;
            padding: 5px 9px;
            border-radius: 7px;
            font-size: 12px;
            font-weight: 600;
        }
        .date {
            color: #64748b;
            font-size: 12px;
        }
        .delete-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 9px 14px;
            background: #dc2626;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            transition: all 0.2s ease;
        }
        .delete-btn:hover {
            background: #b91c1c;
            transform: translateY(-1px);
        }
        .empty {
            text-align: center;
            padding: 45px;
            color: #64748b;
            font-size: 14px;
        }
        .bottom-actions {
            margin-top: 22px;
        }
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 11px 18px;
            background: #003844;
            color: white;
            text-decoration: none;
            border-radius: 9px;
            font-size: 13px;
            font-weight: 700;
            transition: all 0.2s ease;
        }
        .back-btn:hover {
            background: #005766;
            transform: translateY(-1px);
        }
        @media (max-width: 700px) {
            .page-container {
                margin: 20px auto;
                padding: 0 12px;
            }
            .page-header {
                padding: 22px;
            }
            .page-header h1 {
                font-size: 22px;
            }
            .content-card {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
<div class="page-container">
    <div class="page-header">
        <h1>Manage Users</h1>
        <p>View and manage registered users.</p>
    </div>

    <div class="content-card">
        ${deleted ? '<div class="success-message">✓ User deleted successfully.</div>' : ''}

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Student ID</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${userRows}
                </tbody>
            </table>
        </div>

        <div class="bottom-actions">
            <a href="admin-dashboard.php" class="back-btn">← Back to Dashboard</a>
        </div>
    </div>
</div>

${csrfPostScript(csrfToken)}
</body>
</html>`;
}

module.exports = { renderManageUsersView };

