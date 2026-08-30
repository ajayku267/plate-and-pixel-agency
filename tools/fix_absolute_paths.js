const fs = require('fs');
const path = require('path');

// Recursively find all HTML files in a directory
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    // Ignore node_modules, git
    if (file === 'node_modules' || file === '.git' || file === 'scratch') return;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const rootDir = path.join(__dirname, '..');
const htmlFiles = getHtmlFiles(rootDir);

console.log(`Found ${htmlFiles.length} HTML files to convert to absolute root-relative paths.`);

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  
  // 1. STYLESHEETS
  content = content.replace(/href="style\.css"/g, 'href="/style.css"');
  content = content.replace(/href="\.\.\/style\.css"/g, 'href="/style.css"');
  content = content.replace(/href="blog\.css"/g, 'href="/blog/blog.css"');
  content = content.replace(/href="\.\.\/blog\/blog\.css"/g, 'href="/blog/blog.css"');
  content = content.replace(/href="blog\/blog\.css"/g, 'href="/blog/blog.css"');
  
  // 2. SCRIPTS
  content = content.replace(/src="config\.js"/g, 'src="/config.js"');
  content = content.replace(/src="\.\.\/config\.js"/g, 'src="/config.js"');
  content = content.replace(/src="app\.js"/g, 'src="/app.js"');
  content = content.replace(/src="\.\.\/app\.js"/g, 'src="/app.js"');
  content = content.replace(/src="blog\.js"/g, 'src="/blog/blog.js"');
  content = content.replace(/src="\.\.\/blog\/blog\.js"/g, 'src="/blog/blog.js"');
  content = content.replace(/src="blog\/blog\.js"/g, 'src="/blog/blog.js"');

  // 3. LOGO & HOMEPAGE LINKS
  content = content.replace(/href="index\.html"/g, 'href="/index.html"');
  content = content.replace(/href="\.\.\/index\.html"/g, 'href="/index.html"');

  // 4. MAIN NAV & FOOTER LINKS
  content = content.replace(/href="services\/index\.html"/g, 'href="/services/index.html"');
  content = content.replace(/href="\.\.\/services\/index\.html"/g, 'href="/services/index.html"');
  
  content = content.replace(/href="portfolio\/index\.html"/g, 'href="/portfolio/index.html"');
  content = content.replace(/href="\.\.\/portfolio\/index\.html"/g, 'href="/portfolio/index.html"');
  
  content = content.replace(/href="pricing\/index\.html"/g, 'href="/pricing/index.html"');
  content = content.replace(/href="\.\.\/pricing\/index\.html"/g, 'href="/pricing/index.html"');
  
  content = content.replace(/href="blog\/index\.html"/g, 'href="/blog/index.html"');
  content = content.replace(/href="\.\.\/blog\/index\.html"/g, 'href="/blog/index.html"');
  
  content = content.replace(/href="about\/index\.html"/g, 'href="/about/index.html"');
  content = content.replace(/href="\.\.\/about\/index\.html"/g, 'href="/about/index.html"');
  
  content = content.replace(/href="contact\/index\.html"/g, 'href="/contact/index.html"');
  content = content.replace(/href="\.\.\/contact\/index\.html"/g, 'href="/contact/index.html"');
  
  content = content.replace(/href="privacy-policy\/index\.html"/g, 'href="/privacy-policy/index.html"');
  content = content.replace(/href="\.\.\/privacy-policy\/index\.html"/g, 'href="/privacy-policy/index.html"');
  
  content = content.replace(/href="terms\/index\.html"/g, 'href="/terms/index.html"');
  content = content.replace(/href="\.\.\/terms\/index\.html"/g, 'href="/terms/index.html"');

  // 5. OTHER ASSET & FILE LINKS
  content = content.replace(/href="\.\.\/sitemap\.xml"/g, 'href="/sitemap.xml"');
  content = content.replace(/href="sitemap\.xml"/g, 'href="/sitemap.xml"');
  content = content.replace(/href="\.\.\/blog\//g, 'href="/blog/');

  // 6. ANCHOR DEEP-LINKS
  content = content.replace(/href="\.\.\/index\.html#demo"/g, 'href="/index.html#demo"');
  content = content.replace(/href="index\.html#demo"/g, 'href="/index.html#demo"');
  // If it's a subpage (not root index.html) and has href="#demo", map to /index.html#demo
  if (relativePath !== 'index.html') {
    content = content.replace(/href="#demo"/g, 'href="/index.html#demo"');
    content = content.replace(/href="#contact"/g, 'href="/contact/index.html"');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Converted ${relativePath}`);
});

console.log('All paths successfully converted to absolute root-relative.');
