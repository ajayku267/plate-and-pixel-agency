const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const oldDomain = 'https://plateandpixel.in';
const newDomain = 'https://genuine-kleicha-966907.netlify.app';

const blogMapping = {
  'why-cafe-needs-website.html': 'why-every-cafe-needs-a-website/',
  '7-things-restaurant-website-needs.html': 'restaurant-website-features/',
  'restaurant-website-vs-instagram.html': 'restaurant-website-vs-instagram/',
  'restaurant-website-cost.html': 'restaurant-website-cost/',
  'how-to-create-online-menu.html': 'restaurant-online-menu/',
  'restaurant-website-mistakes.html': 'restaurant-website-design-mistakes/',
  'get-more-customers-cafe.html': 'how-to-get-more-cafe-customers/',
  'restaurant-website-on-budget.html': 'restaurant-website-on-a-budget/',
  'restaurant-seo-guide.html': 'restaurant-seo-guide/',
  'why-restaurants-need-online-menu.html': 'restaurant-online-menu-benefits/',
  'what-should-restaurant-website-include.html': 'restaurant-website-features-guide/',
  'professional-website-for-restaurant.html': 'professional-restaurant-website-benefits/'
};

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
console.log(`Processing ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  
  // 1. Replace domain globally (covers canonical tags, JSON-LD, Open Graph, etc.)
  content = content.split(oldDomain).join(newDomain);

  // 2. Normalize and update blog article URLs to clean canonical URL paths
  Object.keys(blogMapping).forEach(filename => {
    const slugWithoutExtension = filename.replace('.html', '');
    const canonicalFolder = blogMapping[filename];

    // e.g. /blog/why-cafe-needs-website.html -> /blog/why-every-cafe-needs-a-website/
    content = content.split(`/blog/${filename}`).join(`/blog/${canonicalFolder}`);
    
    // e.g. /blog/why-cafe-needs-website -> /blog/why-every-cafe-needs-a-website/
    content = content.split(`/blog/${slugWithoutExtension}`).join(`/blog/${canonicalFolder}`);

    // If there's double trailing slash due to replacements, clean it up:
    content = content.split(`/blog/${canonicalFolder}/`).join(`/blog/${canonicalFolder}`);
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${relativePath}`);
});

console.log('Domain and blog URLs successfully updated in all HTML files.');
