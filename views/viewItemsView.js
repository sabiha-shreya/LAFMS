const { escapeHtml } = require('../lib/auth');

function renderViewItems({ type, lost_items, found_items }) {
  const pageTitle = type === 'lost' ? 'Lost Items' : (type === 'found' ? 'Found Items' : 'View All Items');

  const lostRows = (lost_items && lost_items.length > 0)
    ? lost_items.map(row => {
        const id = encodeURIComponent(row.lost_id);
        const img = row.item_image
          ? `<img src="${escapeHtml(row.item_image)}" class="item-picture" onclick="event.stopPropagation(); showImage(this.src);" alt="Item Picture">`
          : 'No Image';

        return `
          <tr class="clickable-row" onclick="window.location='item-details.php?id=${id}&type=lost&from=items'">
            <td>${escapeHtml(row.lost_id)}</td>
            <td>${escapeHtml(row.item_name)}</td>
            <td>${escapeHtml(row.category)}</td>
            <td>${escapeHtml(row.description)}</td>
            <td>${escapeHtml(row.lost_date)}</td>
            <td>${escapeHtml(row.lost_location)}</td>
            <td>${escapeHtml(row.contact_information)}</td>
            <td>${img}</td>
            <td>${escapeHtml(row.status)}</td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="9" style="text-align:center;">No Lost Items Found</td></tr>`;

  const foundRows = (found_items && found_items.length > 0)
    ? found_items.map(row => {
        const id = encodeURIComponent(row.found_id);
        return `
          <tr class="clickable-row" onclick="window.location='item-details.php?id=${id}&type=found&from=items'">
            <td>${escapeHtml(row.found_id)}</td>
            <td>${escapeHtml(row.item_name)}</td>
            <td>${escapeHtml(row.category)}</td>
            <td>${escapeHtml(row.description)}</td>
            <td>${escapeHtml(row.found_date)}</td>
            <td>${escapeHtml(row.found_location)}</td>
            <td>${escapeHtml(row.finder_contact_information)}</td>
            <td>${escapeHtml(row.status)}</td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="8" style="text-align:center;">No Found Items Found</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
<link rel="stylesheet" href="css/style.css">
<style>
* { box-sizing: border-box; }
body { margin: 0; background: #f4f7f9; }
.container {
    width: 95%;
    max-width: 1600px;
    margin: 25px auto;
    padding: 25px;
    background: #ffffff;
    border-radius: 14px;
}
.back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    background: #003844;
    color: white;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 22px;
    transition: 0.3s;
}
.back-button:hover { background: #0fa4af; color: white; }
.page-title { color: #003844; font-size: 28px; margin: 0 0 25px; }
.items-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
    align-items: start;
}
.section-card {
    min-width: 0;
    background: #ffffff;
    border: 1px solid #e5e9ed;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.05);
}
.items-grid.single-section { grid-template-columns: minmax(0, 1fr); }
.items-grid.single-section .section-card { width: 100%; max-width: 100%; }
.section-title {
    color: #003844;
    font-size: 21px;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #0fa4af;
}
.table-wrapper { width: 100%; overflow-x: auto; }
.items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    background: white;
}
.items-table th {
    background: #003844;
    color: white;
    padding: 12px 10px;
    text-align: left;
    white-space: nowrap;
}
.items-table td {
    padding: 11px 10px;
    border-bottom: 1px solid #e8edf0;
    color: #334155;
    vertical-align: middle;
}
.clickable-row { cursor: pointer; }
.clickable-row:hover { background-color: #edf8f9; }
.item-picture {
    width: 75px;
    height: 75px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
}
#imageModal {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.85);
    justify-content: center;
    align-items: center;
}
#largeImage {
    max-width: 90%;
    max-height: 85%;
    border-radius: 10px;
}
.close-button {
    position: absolute;
    top: 15px;
    right: 25px;
    color: white;
    font-size: 40px;
    cursor: pointer;
}
@media (max-width: 768px) {
    .container { width: 100%; margin: 0; padding: 15px 12px; border-radius: 0; }
    .back-button { padding: 9px 14px; font-size: 13px; margin-bottom: 18px; }
    .page-title { font-size: 23px; margin-bottom: 20px; }
    .items-grid { grid-template-columns: 1fr; gap: 20px; }
    .section-card { padding: 13px; border-radius: 10px; }
    .section-title { font-size: 19px; margin-bottom: 12px; }
    .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .items-table { min-width: 750px; font-size: 12px; }
    .items-table th, .items-table td { padding: 9px 8px; }
    .item-picture { width: 65px; height: 65px; }
}
</style>
</head>

<body>
<div class="container">
<a href="dashboard.php" class="back-button">&#8592; Back to Dashboard</a>
<h1 class="page-title">${pageTitle}</h1>

<div class="items-grid ${type !== 'all' ? 'single-section' : ''}">
    ${(type === 'lost' || type === 'all') ? `
    <div class="section-card">
        <h2 class="section-title">Lost Items</h2>
        <div class="table-wrapper">
            <table class="items-table">
                <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Lost Date</th>
                    <th>Lost Location</th>
                    <th>Contact</th>
                    <th>Picture</th>
                    <th>Status</th>
                </tr>
                ${lostRows}
            </table>
        </div>
    </div>` : ''}

    ${(type === 'found' || type === 'all') ? `
    <div class="section-card">
        <h2 class="section-title">Found Items</h2>
        <div class="table-wrapper">
            <table class="items-table">
                <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Found Date</th>
                    <th>Found Location</th>
                    <th>Finder Contact</th>
                    <th>Status</th>
                </tr>
                ${foundRows}
            </table>
        </div>
    </div>` : ''}
</div>
</div>

<div id="imageModal" onclick="closeImage()">
    <span class="close-button" onclick="closeImage()">&times;</span>
    <img id="largeImage" src="" alt="Large Image">
</div>

<script>
function showImage(src) {
    document.getElementById("largeImage").src = src;
    document.getElementById("imageModal").style.display = "flex";
}
function closeImage() {
    document.getElementById("imageModal").style.display = "none";
}
</script>
</body>
</html>`;
}

module.exports = { renderViewItems };

