const fs = require('fs');
let content = fs.readFileSync('src/data/courses.ts', 'utf8');

content = content.replace(/iconName: string;/g, 'iconName: string;\n  imageUrl?: string;');

const images = {
  "ai-ml": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800",
  "fullstack-web": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
  "graphic-design": "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800",
  "cybersecurity": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=800",
  "digital-marketing": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800",
  "data-analytics": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
  "ui-ux": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800",
  "ai-productivity": "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800",
  "entrepreneurship": "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800",
  "cloud-computing": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800"
};

for (const [id, url] of Object.entries(images)) {
  const regex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?iconName:\\s*"[^"]*",)`, 'g');
  content = content.replace(regex, `$1\n    imageUrl: "${url}",`);
}

fs.writeFileSync('src/data/courses.ts', content);
console.log("Updated courses.ts");
