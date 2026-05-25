const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedCount = 0;

walkDir('d:/projects/reference/src', function(filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Regex to find <h1, <h2, <h3, <h4, <h5, <h6 tags with style object containing fontWeight: 400
        // We look for <h[1-6] followed by any characters until fontWeight: 400, before encountering the closing >
        const regex = /(<h[1-6][^>]*?fontWeight:\s*)400([^>]*?>)/g;
        
        if (regex.test(content)) {
            let newContent = content.replace(regex, '$1500$2');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Modified:', filePath);
            modifiedCount++;
        }
    }
});

console.log('Total files modified:', modifiedCount);
