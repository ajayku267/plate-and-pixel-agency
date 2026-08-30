const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Parse _redirects rules
const redirectsPath = path.join(rootDir, '_redirects');
const rewriteRules = []; // rules with status 200
const redirectRules = []; // rules with status 301/302

if (fs.existsSync(redirectsPath)) {
  const lines = fs.readFileSync(redirectsPath, 'utf8').split('\n');
  lines.forEach(line => {
    // Strip comments and trim
    const trimmed = line.split('#')[0].trim();
    if (!trimmed) return;
    
    // Split by whitespace
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      const fromPath = parts[0];
      const toPath = parts[1];
      const status = parts[2] || '301'; // default is 301 redirect

      if (status === '200') {
        rewriteRules.push({ from: fromPath, to: toPath });
      } else {
        redirectRules.push({ from: fromPath, to: toPath, status });
      }
    }
  });
}

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

  function checkPath(link, tag, attr) {
    if (!link) return;
    
    // Ignore external links, anchors, custom protocols
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#') || link.startsWith('javascript:')) {
      return;
    }

    // Resolve URL with Netlify rewrites (status 200)
    let resolvedLink = link;
    // Strip search/hash for mapping lookup
    const cleanLink = link.split('#')[0].split('?')[0];

    // Find if there's a 200 rewrite rule matching this path
    const matchingRewrite = rewriteRules.find(r => r.from === cleanLink || r.from === cleanLink + '/' || r.from + '/' === cleanLink);
    if (matchingRewrite) {
      resolvedLink = matchingRewrite.to;
    }

    let targetPath;
    if (resolvedLink.startsWith('/')) {
      targetPath = path.join(rootDir, resolvedLink);
    } else {
      targetPath = path.join(currentDir, resolvedLink);
    }

    targetPath = targetPath.split('#')[0].split('?')[0];

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    }

    if (!fs.existsSync(targetPath)) {
      console.log(`❌ Broken Link in [${relativePath}]: <${tag} ${attr}="${link}"> (Target path not found: ${targetPath})`);
      brokenLinksCount++;
    }
  }

  // Extract links
  const aMatches = content.matchAll(/<a\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of aMatches) {
    checkPath(match[1], 'a', 'href');
  }

  const linkMatches = content.matchAll(/<link\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of linkMatches) {
    const isStyle = match[0].includes('rel="stylesheet"') || match[0].includes('rel=\'stylesheet\'');
    if (isStyle) {
      checkPath(match[1], 'link', 'href');
    }
  }

  const scriptMatches = content.matchAll(/<script\s+[^>]*src=["']([^"']*)["']/gi);
  for (const match of scriptMatches) {
    checkPath(match[1], 'script', 'src');
  }

  const imgMatches = content.matchAll(/<img\s+[^>]*src=["']([^"']*)["']/gi);
  for (const match of imgMatches) {
    checkPath(match[1], 'img', 'src');
  }
});

if (brokenLinksCount === 0) {
  console.log('✅ Success: No broken local links found!');
} else {
  console.log(`⚠️ Done. Found ${brokenLinksCount} broken local link(s).`);
}
