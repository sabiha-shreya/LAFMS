const { escapeHtml } = require('../lib/auth');

function renderSearchResult({ status, result_lost, result_found }) {
  const showLost = status === 'All' || status === 'Lost' || status === '';
  const showFound = status === 'All' || status === 'Found' || status === '';

  let lostRows = '';
  if (result_lost && result_lost.length > 0) {
    lostRows = result_lost.map(row => `
      <tr>
        <td>${escapeHtml(row.lost_id)}</td>
        <td>${escapeHtml(row.item_name)}</td>
        <td>${escapeHtml(row.category)}</td>
        <td>${escapeHtml(row.description)}</td>
        <td>${escapeHtml(row.lost_date)}</td>
        <td>${escapeHtml(row.lost_location)}</td>
        <td>${escapeHtml(row.status)}</td>
      </tr>
    `).join('');
  } else if (status !== 'All') {
    lostRows = `<tr><td colspan='7'>No Lost Item Found</td></tr>`;
  }

  let foundRows = '';
  if (result_found && result_found.length > 0) {
    foundRows = result_found.map(row => `
      <tr>
        <td>${escapeHtml(row.found_id)}</td>
        <td>${escapeHtml(row.item_name)}</td>
        <td>${escapeHtml(row.category)}</td>
        <td>${escapeHtml(row.description)}</td>
        <td>${escapeHtml(row.found_date)}</td>
        <td>${escapeHtml(row.found_location)}</td>
        <td>${escapeHtml(row.status)}</td>
      </tr>
    `).join('');
  } else if (status !== 'All') {
    foundRows = `<tr><td colspan='7'>No Found Item Found</td></tr>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
    <title>Search Result</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
<h1>Search Result</h1>

${showLost ? `
<h2>Lost Items</h2>
<table border="1" cellpadding="10" cellspacing="0" width="100%">
<tr>
    <th>ID</th>
    <th>Item Name</th>
    <th>Category</th>
    <th>Description</th>
    <th>Lost Date</th>
    <th>Lost Location</th>
    <th>Status</th>
</tr>
${lostRows}
</table>
<br>
` : ''}

${showFound ? `
<h2>Found Items</h2>
<table border="1" cellpadding="10" cellspacing="0" width="100%">
<tr>
    <th>ID</th>
    <th>Item Name</th>
    <th>Category</th>
    <th>Description</th>
    <th>Found Date</th>
    <th>Found Location</th>
    <th>Status</th>
</tr>
${foundRows}
</table>
` : ''}

<br><br>
<a href="dashboard.php">Back to Dashboard</a>
</div>
</body>
</html>`;
}

module.exports = { renderSearchResult };

