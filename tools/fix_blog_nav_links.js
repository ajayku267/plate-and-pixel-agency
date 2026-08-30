const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} blog files for header nav correction...`);

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix desktop header Blog link
  content = content.replace(/href="\/index\.html">Blog/g, 'href="/blog/index.html">Blog');
  content = content.replace(/href="\/index\.html" aria-current="page">Blog/g, 'href="/blog/index.html" aria-current="page">Blog');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed header link in ${file}`);
});

console.log('Blog nav links successfully corrected.');
