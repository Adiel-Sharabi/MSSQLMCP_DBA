// Test script to verify MCP server
process.env.ALLOW_SQL_SCRIPTS = 'true';
process.env.DATABASE_NAME = 'ac8';
process.env.SERVER_NAME = 'localhost';
process.env.READONLY = 'false';

// Import the server
import('./Node/dist/index.js').then(() => {
    console.log('Server started successfully');
    
    // Test tools listing
    process.stdin.write('{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n');
}).catch(err => {
    console.error('Failed to start server:', err);
});