const fs = require('fs');
const path = require('path');
const POSTS_DIR = path.join(__dirname,'content','posts');
const OUT_FILE = path.join(__dirname,'public','sitemap.xml');
if (!fs.existsSync(POSTS_DIR)){console.error('Posts dir not found');process.exit(1);}
const files = fs.readdirSync(POSTS_DIR).filter(f=>f.endsWith('.md'));
let xml = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n';
files.forEach(f=>{ const slug = f.replace(/\.md$/,''); xml+=`  <url><loc>https://iaen30segundos.com/posts/${slug}/</loc></url>\n`; });
xml += '</urlset>\n';
fs.mkdirSync(path.dirname(OUT_FILE),{recursive:true});
fs.writeFileSync(OUT_FILE,xml,'utf8');
console.log('Sitemap generated');
