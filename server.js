const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`Received request for: ${req.url}`);

    // Map root URL to index.html
    let reqPath = req.url === '/' ? '/index.html' : req.url;

    // Strip leading slash to prevent path.join from treating it as an absolute path
    if (reqPath.startsWith('/')) {
        reqPath = reqPath.slice(1);
    }

    // Resolve file path inside the 'public' directory
    const filePath = path.join(__dirname, 'public', reqPath);

    // Determine the MIME type based on file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.html':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
    }

    // Read and serve the file from the filesystem
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found -> Serve custom 404 page
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err404, page404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(page404 || '<h1>404 Not Found</h1>', 'utf-8');
                });
            } else {
                // Other server error -> Serve custom 500 page
                fs.readFile(path.join(__dirname, 'public', '500.html'), (err500, page500) => {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(page500 || '<h1>500 Internal Server Error</h1>', 'utf-8');
                });
            }
        } else {
            // Success -> Return file content with proper content-type header
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});