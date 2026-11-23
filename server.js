const app = require('./api/index');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Campus Lost & Found Management System (Serverless Ready) `);
  console.log(`=======================================================`);
  console.log(` Server is running at: http://localhost:${PORT}`);
  console.log(` User Login:           http://localhost:${PORT}/login.html`);
  console.log(` Admin Login:          http://localhost:${PORT}/admin-login.html`);
  console.log(` Dashboard:            http://localhost:${PORT}/dashboard.php`);
  console.log(`=======================================================`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });
});

