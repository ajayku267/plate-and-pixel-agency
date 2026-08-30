const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

console.log(`Found ${files.length} article files to process.`);

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure config.js and absolute style paths in head
  content = content.replace(/href="\.\.\/style\.css"/g, 'href="/style.css"');
  content = content.replace(/href="blog\.css"/g, 'href="/blog/blog.css"');
  content = content.replace(/src="\.\.\/config\.js"/g, 'src="/config.js"');
  content = content.replace(/src="\.\.\/app\.js"/g, 'src="/app.js"');
  content = content.replace(/src="blog\.js"/g, 'src="/blog/blog.js"');

  // 1b. Replace unstyled mobile menu with standard responsive navbar
  const oldMobileMenu = '<div class="mobile-menu" id="nav-menu"><button class="mobile-menu__close" id="mobile-close">&#10005;</button><ul><li><a href="/services/index.html">Services</a></li><li><a href="/portfolio/index.html">Portfolio</a></li><li><a href="/pricing/index.html">Pricing</a></li><li><a href="/index.html">Blog</a></li><li><a href="/contact/index.html">Contact</a></li></ul><a href="/index.html#demo" class="btn btn-primary" style="margin-top:1.5rem;">Get Free Demo</a></div>';
  const newMobileMenu = `<nav class="nav__mobile" id="mobile-menu" aria-label="Mobile navigation">
  <a href="/services/index.html">Services</a>
  <a href="/portfolio/index.html">Portfolio</a>
  <a href="/pricing/index.html">Pricing</a>
  <a href="/blog/index.html">Blog</a>
  <a href="/about/index.html">About</a>
  <a href="/contact/index.html">Contact</a>
  <div class="nav__mobile-ctas">
    <a href="#" class="btn btn-whatsapp" target="_blank" rel="noopener" data-config-link="whatsapp" data-msg-type="general">&#128177; Chat on WhatsApp</a>
    <a href="/index.html#demo" class="btn btn-primary">Get Free Demo</a>
  </div>
</nav>`;
  content = content.replace(oldMobileMenu, newMobileMenu);

  // 2. Replace floating WhatsApp
  content = content.replace(
    /href="https:\/\/wa\.me\/919999999999\?text=Hi!%20I%27d%20like%20an%20online%20menu%20for%20my%20restaurant." class="wa-float" id="wa-float"/g,
    'href="#" class="wa-float" id="wa-float" data-config-link="whatsapp" data-msg-type="general"'
  );
  content = content.replace(
    /href="https:\/\/wa\.me\/919999999999[^"]*" class="wa-float" id="wa-float"/g,
    'href="#" class="wa-float" id="wa-float" data-config-link="whatsapp" data-msg-type="general"'
  );

  // 3. Replace navbar links
  content = content.replace(/href="\.\.\/index\.html#services"/g, 'href="../services/index.html"');
  content = content.replace(/href="\.\.\/index\.html#portfolio"/g, 'href="../portfolio/index.html"');
  content = content.replace(/href="\.\.\/index\.html#pricing"/g, 'href="../pricing/index.html"');
  content = content.replace(/href="\.\.\/index\.html#about"/g, 'href="../about/index.html"');
  content = content.replace(/href="\.\.\/index\.html#contact"/g, 'href="../contact/index.html"');

  // 4. Replace WhatsApp CTAs in header
  content = content.replace(
    /href="https:\/\/wa\.me\/919999999999" class="btn btn-sm btn-whatsapp"/g,
    'href="#" class="btn btn-sm btn-whatsapp" data-config-link="whatsapp" data-msg-type="general"'
  );

  // 5. Replace other hardcoded WhatsApp links in body with data attributes
  content = content.replace(
    /href="https:\/\/wa\.me\/919999999999\?text=([^"]*)"/g,
    (match, text) => {
      const decodedText = decodeURIComponent(text).toLowerCase();
      let msgType = 'general';
      if (decodedText.includes('demo') || decodedText.includes('free')) {
        msgType = 'demo';
      } else if (decodedText.includes('pricing') || decodedText.includes('cost') || decodedText.includes('package')) {
        msgType = 'pricing';
      }
      return `href="#" data-config-link="whatsapp" data-msg-type="${msgType}"`;
    }
  );

  // 6. Update footer structure
  const oldFooter = '<footer class="footer" role="contentinfo"><div class="container"><div class="footer__inner"><div class="footer__brand"><div class="footer__logo">&#127869; Plates &amp; Pixels</div><p class="footer__tagline">Restaurant websites that work as hard as you do.</p></div><div class="footer__links"><h3 class="footer__links-title">Services</h3><ul><li><a href="../index.html#services">Restaurant Websites</a></li><li><a href="../index.html#pricing">Pricing</a></li><li><a href="../index.html#demo">Free Demo</a></li></ul></div><div class="footer__links"><h3 class="footer__links-title">Blog</h3><ul><li><a href="index.html">All Articles</a></li>';
  
  const newFooter = `<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">&#127869; Plates &amp; Pixels</div>
        <p class="footer__tagline">Restaurant websites that work as hard as you do.</p>
        <a href="#" class="btn btn-whatsapp btn-sm" style="margin-top:1rem;" target="_blank" rel="noopener" data-config-link="whatsapp" data-msg-type="general">WhatsApp Us</a>
      </div>
      <div class="footer__links">
        <h3 class="footer__links-title">Services</h3>
        <ul>
          <li><a href="../services/index.html">Restaurant Websites</a></li>
          <li><a href="../pricing/index.html">Pricing</a></li>
          <li><a href="../index.html#demo">Free Demo</a></li>
        </ul>
      </div>
      <div class="footer__links">
        <h3 class="footer__links-title">Blog</h3>
        <ul>
          <li><a href="index.html">All Articles</a></li>
        </ul>
      </div>
      <div class="footer__links">
        <h3 class="footer__links-title">Company</h3>
        <ul>
          <li><a href="../about/index.html">About</a></li>
          <li><a href="../portfolio/index.html">Portfolio</a></li>
          <li><a href="../contact/index.html">Contact</a></li>
          <li><a href="../privacy-policy/index.html">Privacy Policy</a></li>
          <li><a href="../terms/index.html">Terms</a></li>
        </ul>
      </div>`;

  if (content.includes(oldFooter)) {
    content = content.replace(oldFooter, newFooter);
  } else {
    // Fallback simple replace if layout slightly varied
    content = content.replace(/href="\.\.\/index\.html#services"/g, 'href="../services/index.html"');
    content = content.replace(/href="\.\.\/index\.html#pricing"/g, 'href="../pricing/index.html"');
    content = content.replace(/href="\.\.\/index\.html#demo"/g, 'href="../index.html#demo"');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
});
console.log('All articles updated successfully.');

// 7. Update blog/index.html links to be root-relative to support clean URLs without trailing slashes
const blogIndexPath = path.join(blogDir, 'index.html');
if (fs.existsSync(blogIndexPath)) {
  let blogIndexContent = fs.readFileSync(blogIndexPath, 'utf8');
  files.forEach(f => {
    // Replace href="filename.html" with href="/blog/filename.html"
    const searchStr = `href="${f}"`;
    const replaceStr = `href="/blog/${f}"`;
    blogIndexContent = blogIndexContent.split(searchStr).join(replaceStr);
  });
  fs.writeFileSync(blogIndexPath, blogIndexContent, 'utf8');
  console.log('Updated article links in blog/index.html to be root-relative.');
}

