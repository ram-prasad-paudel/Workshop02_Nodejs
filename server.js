const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Helper function to serve HTML files
function serveFile(filePath, contentType, res, statusCode = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      handleServerError(res);
    } else {
      res.writeHead(statusCode, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

// 404 Error Handler
function handle404(res) {
  const filePath = path.join(__dirname, '404.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
}

// 500 Error Handler
function handleServerError(res) {
  const filePath = path.join(__dirname, '500.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    } else {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = req.url;

  // Task 2 & 3: HTML Routing
  if (parsedUrl === '/' || parsedUrl === '/index.html') {
    serveFile(path.join(__dirname, 'index.html'), 'text/html', res);
  } else if (parsedUrl === '/about' || parsedUrl === '/about.html') {
    serveFile(path.join(__dirname, 'about.html'), 'text/html', res);
  } else if (parsedUrl === '/contact' || parsedUrl === '/contact.html') {
    serveFile(path.join(__dirname, 'contact.html'), 'text/html', res);
  } 
  // Task 6: Bonus API Endpoint
  else if (parsedUrl === '/api/time') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const timeData = { currentTime: new Date().toISOString() };
    res.end(JSON.stringify(timeData));
  } 
  // Task 4: CSS Files with Path Traversal Security
  else if (parsedUrl.startsWith('/styles/')) {
    const safePath = path.normalize(parsedUrl).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, 'public', safePath);

    // Security check against directory traversal
    if (!filePath.startsWith(path.join(__dirname, 'public'))) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    serveFile(filePath, 'text/css', res);
  } 
  // Task 5: Custom 404 for everything else
  else {
    handle404(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});