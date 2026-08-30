const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} blog files for footer layout correction...`);

const targetFooter = `<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__top">
      <div>
        <a href="/index.html" class="footer__brand-logo" aria-label="Plates and Pixels home">
          <div class="nav__logo-icon" aria-hidden="true">&#127869;</div>
          Plates &amp; Pixels
        </a>
        <p class="footer__brand-desc">We build modern, mobile-friendly websites for restaurants, cafes, bars, bakeries, and food businesses across India.</p>
        <p style="font-size:.78rem;color:var(--clr-gold);letter-spacing:.06em;margin-bottom:1rem;">Restaurant Websites &#183; Digital Marketing &#183; SEO</p>
        <div class="footer__social">
          <a href="#" class="footer__social-link" target="_blank" rel="noopener" aria-label="Instagram" data-config-link="instagram">&#128247;</a>
          <a href="#" class="footer__social-link" target="_blank" rel="noopener" aria-label="WhatsApp" data-config-link="whatsapp" data-msg-type="general">&#128177;</a>
          <a href="#" class="footer__social-link" aria-label="Email" data-config-link="email">&#9993;</a>
        </div>
      </div>
      <div>
        <div class="footer__nav-title">Navigation</div>
        <nav class="footer__nav-links" aria-label="Footer navigation">
          <a href="/index.html">Home</a>
          <a href="/services/index.html">Services</a>
          <a href="/portfolio/index.html">Portfolio</a>
          <a href="/pricing/index.html">Pricing</a>
          <a href="/blog/index.html">Blog</a>
          <a href="/about/index.html">About</a>
          <a href="/contact/index.html">Contact</a>
        </nav>
      </div>
      <div>
        <div class="footer__nav-title">Quick Links</div>
        <nav class="footer__nav-links" aria-label="Quick links">
          <a href="/index.html#demo">Get Free Demo</a>
          <a href="#" target="_blank" rel="noopener" data-config-link="whatsapp" data-msg-type="general">Chat on WhatsApp</a>
          <a href="/blog/index.html">All Blog Articles</a>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/privacy-policy/index.html">Privacy Policy</a>
          <a href="/terms/index.html">Terms</a>
        </nav>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="footer__copy">Copyright &copy; 2026 Plates &amp; Pixels. All rights reserved.</div>
      <div class="footer__tagline">Restaurant Websites &bull; Digital Marketing &bull; SEO</div>
    </div>
  </div>
</footer>`;

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace any existing footer from <footer class="footer"...> to </footer>
  content = content.replace(/<footer class="footer" role="contentinfo">[\s\S]*?<\/footer>/g, targetFooter);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated footer in ${file}`);
});

console.log('All footers successfully updated.');
