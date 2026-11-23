function renderAddFoundItem() {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Add Found Item</title>
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
            label {
                font-size: 13px;
                margin-bottom: 0;
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
<h1>Add Found Item</h1>

<form action="add-found-item.php" method="POST">

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

<label>Found Date</label><br>
<input type="date" name="found_date" required>
<br><br>

<input type="text" name="found_location" placeholder="Found Location" required>
<br><br>

<input type="text" name="finder_contact_information" placeholder="Finder Contact Information" required>
<br><br>

<button type="submit">Submit</button>
<br><br>

<a href="dashboard.php">Back to Dashboard</a>

</form>
</div>
</body>
</html>`;
}

module.exports = { renderAddFoundItem };

