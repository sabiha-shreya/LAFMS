const { escapeHtml } = require('../lib/auth');

function renderItemDetails({ item, type, from }) {
  const isLost = type === 'lost';
  const title = isLost ? 'Lost Item Details' : 'Found Item Details';
  const subtitle = isLost ? 'Details about the lost item' : 'Details about the found item';
  const dateLabel = isLost ? 'Lost Date' : 'Found Date';
  const dateValue = isLost ? item.lost_date : item.found_date;
  const locationValue = isLost ? item.lost_location : item.found_location;
  const contactLabel = isLost ? 'Contact Information' : 'Finder Contact';
  const contactValue = isLost ? item.contact_information : item.finder_contact_information;
  const backHref = from === 'items' ? 'view-items.php' : 'dashboard.php';
  const backText = from === 'items' ? '← Back to Items' : '← Back to Dashboard';

  const imageHtml = (isLost && item.item_image)
    ? `<img src="${escapeHtml(item.item_image)}" class="item-image" onclick="showImage(this.src)" alt="Item Picture">`
    : `<div class='no-image'>No Image Available</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Item Details</title>
<link rel="stylesheet" href="css/style.css">
<style>
.details-page { max-width: 850px; margin: 40px auto; padding: 20px; }
.details-card { background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 5px 20px rgba(0,0,0,0.10); }
.details-title { text-align: center; margin-bottom: 30px; }
.details-title h1 { margin-bottom: 8px; }
.details-title p { color: #777; }
.image-section { text-align: center; margin-bottom: 30px; }
.item-image { width: 250px; height: 250px; object-fit: cover; border-radius: 14px; cursor: pointer; border: 1px solid #ddd; transition: 0.3s; }
.item-image:hover { transform: scale(1.03); }
.no-image { display: inline-block; padding: 60px 80px; border: 1px dashed #aaa; border-radius: 12px; color: #777; }
.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.detail-box { background: #f7f7f7; border-radius: 10px; padding: 16px; }
.detail-label { font-size: 13px; color: #777; margin-bottom: 6px; }
.detail-value { font-size: 16px; font-weight: 600; word-break: break-word; }
.description-box { grid-column: 1 / -1; }
.status { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 14px; }
.back-button { display: inline-block; margin-top: 25px; text-decoration: none; }
#imageModal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.88); justify-content: center; align-items: center; }
#largeImage { max-width: 90%; max-height: 90%; border-radius: 12px; }
.close-button { position: absolute; top: 20px; right: 30px; color: white; font-size: 42px; cursor: pointer; }
@media (max-width: 650px) {
    .details-grid { grid-template-columns: 1fr; }
    .description-box { grid-column: auto; }
    .item-image { width: 200px; height: 200px; }
}
</style>
</head>
<body>
<div class="details-page">
<div class="details-card">
<div class="details-title">
    <h1>${title}</h1>
    <p>${subtitle}</p>
</div>

<div class="image-section">
    ${imageHtml}
</div>

<div class="details-grid">
    <div class="detail-box">
        <div class="detail-label">Item Name</div>
        <div class="detail-value">${escapeHtml(item.item_name)}</div>
    </div>
    <div class="detail-box">
        <div class="detail-label">Category</div>
        <div class="detail-value">${escapeHtml(item.category)}</div>
    </div>
    <div class="detail-box">
        <div class="detail-label">${dateLabel}</div>
        <div class="detail-value">${escapeHtml(dateValue)}</div>
    </div>
    <div class="detail-box">
        <div class="detail-label">Location</div>
        <div class="detail-value">${escapeHtml(locationValue)}</div>
    </div>
    <div class="detail-box">
        <div class="detail-label">${contactLabel}</div>
        <div class="detail-value">${escapeHtml(contactValue)}</div>
    </div>
    <div class="detail-box">
        <div class="detail-label">Status</div>
        <div class="detail-value"><span class="status">${escapeHtml(item.status)}</span></div>
    </div>
    <div class="detail-box description-box">
        <div class="detail-label">Description</div>
        <div class="detail-value">${escapeHtml(item.description || 'No description provided.').replace(/\n/g, '<br>')}</div>
    </div>
</div>

<a class="back-button" href="${backHref}">${backText}</a>
</div>
</div>

<div id="imageModal" onclick="closeImage()">
    <span class="close-button" onclick="closeImage()">&times;</span>
    <img id="largeImage" src="" alt="Large Item Picture">
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

module.exports = { renderItemDetails };

