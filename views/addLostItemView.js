function renderAddLostItem() {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Add Lost Item</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* MOBILE RESPONSIVE DESIGN ONLY */
        @media (max-width: 600px) {
            body {
                margin: 0;
                padding: 0;
                min-height: 100vh;
            }
            .container {
                width: 100%;
                max-width: 100%;
                min-height: 100vh;
                margin: 0;
                padding: 12px 16px;
                border-radius: 0;
            }
            h1 {
                font-size: 22px;
                margin-top: 5px;
                margin-bottom: 12px;
            }
            form {
                display: flex;
                flex-direction: column;
                gap: 7px;
            }
            form br {
                display: none;
            }
            input, select, textarea {
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
                padding: 9px 10px;
                font-size: 14px;
                margin: 0;
            }
            textarea {
                resize: vertical;
            }
            textarea[name="description"] {
                height: 65px;
                min-height: 65px;
            }
            textarea[name="secret_information"] {
                height: 45px;
                min-height: 45px;
            }
            label {
                font-size: 13px;
                margin-bottom: 0;
            }
            small {
                font-size: 11px;
            }
            button {
                width: 100%;
                padding: 10px;
                font-size: 14px;
                margin-top: 3px;
            }
            form a {
                text-align: center;
                font-size: 13px;
                margin-top: 2px;
            }
        }
    </style>
</head>
<body>
<div class="container">
<h1>Add Lost Item</h1>

<form action="add-lost-item.php" method="POST" enctype="multipart/form-data">

<input type="text" name="item_name" placeholder="Item Name" required>
<br><br>

<select name="category" required>
    <option value="">Select Category</option>
    <option>Electronics</option>
    <option>Documents</option>
    <option>Accessories</option>
    <option>Books or Stationery</option>
    <option>Others</option>
</select>
<br><br>

<textarea name="description" rows="5" placeholder="Description" required></textarea>
<br><br>

<label>Lost Date</label><br>
<input type="date" name="lost_date" required>
<br><br>

<input type="text" name="lost_location" placeholder="Lost Location" required>
<br><br>

<input type="text" name="contact_information" placeholder="Contact Information" required>
<br><br>

<textarea name="secret_information" rows="5" placeholder="Secret Information"></textarea>
<br><br>

<!-- OPTIONAL IMAGE -->
<label>Item Picture (Optional)</label><br>
<input type="file" name="item_image" id="item_image_input" accept="image/jpeg,image/png,image/webp,image/gif" onchange="previewImage(event)">
<br>
<small>You can upload a picture if you want (Max 4MB).</small>
<div id="image_preview_box" style="display:none;margin-top:10px;text-align:center;">
    <img id="image_preview" src="" alt="Item Preview" style="max-width:200px;max-height:180px;border-radius:10px;border:1px solid #d1d5db;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
</div>
<br><br>

<button type="submit">Submit</button>
<br><br>

<a href="dashboard.php">Back to Dashboard</a>

</form>
</div>
<script>
function previewImage(event) {
    const file = event.target.files && event.target.files[0];
    const previewBox = document.getElementById('image_preview_box');
    const previewImg = document.getElementById('image_preview');
    if (file) {
        if (file.size > 4 * 1024 * 1024) {
            alert('File size exceeds 4MB. Please choose an image under 4MB.');
            event.target.value = '';
            previewBox.style.display = 'none';
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewBox.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewBox.style.display = 'none';
    }
}
</script>
</body>
</html>`;
}

module.exports = { renderAddLostItem };

