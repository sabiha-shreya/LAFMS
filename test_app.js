const http = require('http');
const app = require('./api/index');

const PORT = 3456;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = { ...headers };
    let reqBody = null;

    if (body) {
      reqBody = new URLSearchParams(body).toString();
      reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
      reqHeaders['Content-Length'] = Buffer.byteLength(reqBody);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: reqHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on('error', reject);
    if (reqBody) req.write(reqBody);
    req.end();
  });
}

function extractCookie(headers) {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return '';
  return setCookie.map(c => c.split(';')[0]).join('; ');
}

async function runTests() {
  console.log('=======================================================');
  console.log(' Campus Lost & Found - Full End-to-End Test Suite');
  console.log('=======================================================');
  const server = app.listen(PORT);

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`  [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${name}${details ? ' - ' + details : ''}`);
      failed++;
    }
  }

  try {
    console.log('\n--- Static Assets & Public Routes ---');

    let res = await request('GET', '/');
    assert('GET / serves login page or redirect', res.statusCode === 200 || res.statusCode === 302);

    res = await request('GET', '/login.html');
    assert('GET /login.html returns 200', res.statusCode === 200 && res.body.includes('Login'));

    res = await request('GET', '/register.html');
    assert('GET /register.html returns 200', res.statusCode === 200 && res.body.includes('Register'));

    res = await request('GET', '/admin-login.html');
    assert('GET /admin-login.html returns 200', res.statusCode === 200 && res.body.includes('Admin Login'));

    res = await request('GET', '/dashboard.css');
    assert('GET /dashboard.css returns CSS', res.statusCode === 200 && res.headers['content-type']?.includes('text/css'));

    res = await request('GET', '/css/style.css');
    assert('GET /css/style.css returns CSS', res.statusCode === 200);

    console.log('\n--- Public Item Pages ---');

    res = await request('GET', '/view-items.php');
    assert('GET /view-items.php returns 200', res.statusCode === 200 && res.body.includes('View All Items'));

    res = await request('GET', '/search-item.php?item_name=Calculator');
    assert('GET /search-item.php returns search results page', res.statusCode === 200 && res.body.includes('Search Result'));

    // Use an ID from seed data (lost_id starts at 12)
    res = await request('GET', '/item-details.php?id=12&type=lost');
    assert('GET /item-details.php returns item details', res.statusCode === 200 && res.body.includes('Calculator'));

    res = await request('GET', '/item-details.php?id=1&type=found');
    assert('GET /item-details.php (found) returns item details', res.statusCode === 200 && res.body.includes('mobile'));

    console.log('\n--- User Authentication ---');

    res = await request('POST', '/login.php', { email: 'shreyasabiha@gmail.com', password: 'wrongpassword' });
    assert('POST /login.php wrong password → alert page', res.body.includes('Wrong password'));

    res = await request('POST', '/login.php', { email: 'shreyasabiha@gmail.com', password: '123456' });
    assert('POST /login.php valid credentials → 302 redirect', res.statusCode === 302 && res.headers.location === '/dashboard.php');
    const userCookie = extractCookie(res.headers);
    assert('POST /login.php sets session cookie', userCookie.length > 0);

    console.log('\n--- User Protected Pages ---');

    res = await request('GET', '/dashboard.php', null, { Cookie: userCookie });
    assert('GET /dashboard.php renders Tailwind dashboard', res.statusCode === 200 && res.body.includes('Campus Lost') && res.body.includes('tailwindcss'));

    res = await request('GET', '/add-lost-item.php', null, { Cookie: userCookie });
    assert('GET /add-lost-item.php renders form', res.statusCode === 200 && res.body.includes('Add Lost Item'));

    res = await request('GET', '/add-found-item.php', null, { Cookie: userCookie });
    assert('GET /add-found-item.php renders form', res.statusCode === 200 && res.body.includes('Add Found Item'));

    res = await request('GET', '/my-matches.php', null, { Cookie: userCookie });
    assert('GET /my-matches.php renders matches page', res.statusCode === 200 && res.body.includes('My Matches'));

    res = await request('GET', '/notifications.php', null, { Cookie: userCookie });
    assert('GET /notifications.php renders notifications page', res.statusCode === 200 && res.body.includes('Notifications'));

    res = await request('GET', '/view-items.php', null, { Cookie: userCookie });
    assert('GET /view-items.php renders for logged-in user', res.statusCode === 200);

    console.log('\n--- User JSON Endpoints ---');

    res = await request('POST', '/mark-notification-read.php', { notification_id: 1 }, { Cookie: userCookie });
    assert('POST /mark-notification-read.php returns JSON', res.statusCode === 200 && res.body.includes('"success"'));

    res = await request('POST', '/delete-notification.php', { notification_id: 999 }, { Cookie: userCookie });
    assert('POST /delete-notification.php returns JSON', res.statusCode === 200 && res.body.includes('"success"'));

    console.log('\n--- Admin Authentication ---');

    res = await request('POST', '/admin-login.php', { username: 'admin', password: '12345' });
    assert('POST /admin-login.php → 302 redirect to dashboard', res.statusCode === 302 && res.headers.location === '/admin-dashboard.php');
    const adminCookie = extractCookie(res.headers);
    assert('POST /admin-login.php sets admin cookie', adminCookie.length > 0);

    res = await request('POST', '/admin-login.php', { username: 'admin', password: 'wrong' });
    assert('POST /admin-login.php wrong password → error page', res.statusCode === 200 && res.body.includes('Invalid Username or Password'));

    console.log('\n--- Admin Protected Pages ---');

    res = await request('GET', '/admin-dashboard.php', null, { Cookie: adminCookie });
    assert('GET /admin-dashboard.php renders admin dashboard', res.statusCode === 200 && res.body.includes('Admin Dashboard'));

    res = await request('GET', '/pending-posts.php', null, { Cookie: adminCookie });
    assert('GET /pending-posts.php renders pending posts', res.statusCode === 200 && res.body.includes('Pending Posts'));

    res = await request('GET', '/manage-users.php', null, { Cookie: adminCookie });
    assert('GET /manage-users.php renders users table', res.statusCode === 200 && res.body.includes('Manage Users') && res.body.includes('Sabiha'));

    res = await request('GET', '/delete-posts.php', null, { Cookie: adminCookie });
    assert('GET /delete-posts.php renders delete posts view', res.statusCode === 200 && res.body.includes('Delete Posts'));

    res = await request('GET', '/returned-items.php', null, { Cookie: adminCookie });
    assert('GET /returned-items.php renders returned items', res.statusCode === 200 && res.body.includes('Returned Items'));

    res = await request('GET', '/admin-approved-claims.php', null, { Cookie: adminCookie });
    assert('GET /admin-approved-claims.php renders approved claims', res.statusCode === 200 && res.body.includes('Approved Claims'));

    res = await request('GET', '/view-lost-items.php', null, { Cookie: adminCookie });
    assert('GET /view-lost-items.php renders lost items list', res.statusCode === 200 && res.body.includes('All Lost Items'));

    res = await request('GET', '/view-found-items.php', null, { Cookie: adminCookie });
    assert('GET /view-found-items.php renders found items list', res.statusCode === 200 && res.body.includes('All Found Items'));

    res = await request('GET', '/view-lost-items.php?id=12', null, { Cookie: adminCookie });
    assert('GET /view-lost-items.php?id=12 renders single item details', res.statusCode === 200 && res.body.includes('Lost Item Details'));

    res = await request('GET', '/view-found-items.php?id=1', null, { Cookie: adminCookie });
    assert('GET /view-found-items.php?id=1 renders single item details', res.statusCode === 200 && res.body.includes('Found Item Details'));

    console.log('\n--- Auth Guards ---');

    res = await request('GET', '/dashboard.php');
    assert('GET /dashboard.php without login → redirect', res.statusCode === 302);

    res = await request('GET', '/admin-dashboard.php');
    assert('GET /admin-dashboard.php without login → redirect', res.statusCode === 302);

    res = await request('GET', '/admin-dashboard.php', null, { Cookie: userCookie });
    assert('GET /admin-dashboard.php with user cookie → redirect', res.statusCode === 302);

    console.log('\n--- Logout ---');

    res = await request('GET', '/logout.php', null, { Cookie: userCookie });
    assert('GET /logout.php clears session and redirects', res.statusCode === 302);

    res = await request('GET', '/admin-logout.php', null, { Cookie: adminCookie });
    assert('GET /admin-logout.php clears session and redirects', res.statusCode === 302);

  } catch (err) {
    console.error('\nTest execution error:', err.message);
    failed++;
  } finally {
    server.close();
    console.log('\n=======================================================');
    console.log(` RESULTS: ${passed} Passed  |  ${failed} Failed`);
    console.log('=======================================================');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
