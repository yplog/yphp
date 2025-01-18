import fs from 'fs';
import path from 'path';

const today = new Date().toISOString().split('T')[0];

const postsDir = path.resolve('./src/data/posts');
const filename = path.join(postsDir, `_${today}.md`);

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

const content = `---
title: 'My Blog Post for ${today}'
pubDate: ${today}
description: 'This is an autogenerated blog post for ${today}.'
image:
    src: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
    createdBy: 'Astro'
    creatorLink: 'https://docs.astro.build'
tags: ["astro", "automation", "javascript"]
---

# My Blog Post for ${today}

This is the content of the blog post.
`;

fs.writeFileSync(filename, content, { encoding: 'utf8' });

console.log(`Created file: ${filename}`);
