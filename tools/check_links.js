const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'scratch' || file === 'tools') return;
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

const htmlFiles = getHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files to verify links.`);

let brokenLinksCount = 0;

htmlFiles.forEach(htmlFile => {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const relativePath = path.relative(rootDir, htmlFile);
  const currentDir = path.dirname(htmlFile);

  // Helper to check if file exists
  function checkPath(link, tag, attr) {
    if (!link) return;
    
    // Ignore external links, anchors, custom protocols
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#') || link.startsWith('javascript:')) {
      return;
    }

    let targetPath;
    if (link.startsWith('/')) {
      // Absolute path from root
      targetPath = path.join(rootDir, link);
    } else {
      // Relative path from current HTML file
      targetPath = path.join(currentDir, link);
    }

    // Strip search query/hash from the local link check
    targetPath = targetPath.split('#')[0].split('?')[0];

    // If it points to a directory (like /services/), append index.html
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    }

    if (!fs.existsSync(targetPath)) {
      console.log(`❌ Broken Link in [${relativePath}]: <${tag} ${attr}="${link}"> (Target path not found: ${targetPath})`);
      brokenLinksCount++;
    }
  }

  // Regex to extract various links
  // 1. Anchor tags href
  const aMatches = content.matchAll(/<a\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of aMatches) {
    checkPath(match[1], 'a', 'href');
  }

  // 2. Link tags href (stylesheets, canonicals, etc.)
  const linkMatches = content.matchAll(/<link\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of linkMatches) {
    // Only check stylesheets and ignore canonicals that point to production domain
    const isStyle = match[0].includes('rel="stylesheet"') || match[0].includes('rel=\'stylesheet\'');
    const href = match[1];
    if (isStyle) {
      checkPath(href, 'link', 'href');
    }
  }

  // 3. Script tags src
  const scriptMatches = content.matchAll(/<script\s+[^>]*src=["']([^"']*)["']/gi);
  for (const match of scriptMatches) {
    checkPath(match[1], 'script', 'src');
  }

  // 4. Image tags src
  const imgMatches = content.matchAll(/<img\s+[^>]*src=["']([^"']*)["']/gi);
  for (const match of imgMatches) {
    // Skip external image links
    checkPath(match[1], 'img', 'src');
  }
});

if (brokenLinksCount === 0) {
  console.log('✅ Success: No broken local links found!');
} else {
  console.log(`⚠️ Done. Found ${brokenLinksCount} broken local link(s).`);
}
