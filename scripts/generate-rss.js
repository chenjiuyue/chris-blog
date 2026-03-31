/**
 * RSS Feed 生成脚本
 * 在构建时生成 RSS/Atom Feed
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Feed } from 'feed';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 配置信息
const SITE_CONFIG = {
  title: 'Chris Know - 个人博客',
  description: '基于 CloudBase 的个人博客系统，分享技术文章和个人见解',
  url: 'https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/',
  author: {
    name: 'Chris',
    email: 'chris@example.com',
    link: 'https://lowcode-0gwpl9v4125156ef-1258057692.tcloudbaseapp.com/chris-know/'
  },
  language: 'zh-CN',
  copyright: `Copyright © ${new Date().getFullYear()} Chris Know. All rights reserved.`
};

/**
 * 生成 RSS Feed
 * @param {Array} posts - 文章列表
 */
export function generateRSSFeed(posts = []) {
  const feed = new Feed({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    id: SITE_CONFIG.url,
    link: SITE_CONFIG.url,
    language: SITE_CONFIG.language,
    favicon: `${SITE_CONFIG.url}favicon.svg`,
    copyright: SITE_CONFIG.copyright,
    updated: new Date(),
    feedLinks: {
      rss: `${SITE_CONFIG.url}rss.xml`,
      atom: `${SITE_CONFIG.url}atom.xml`
    },
    author: SITE_CONFIG.author
  });

  // 添加文章条目
  posts.forEach((post, index) => {
    const postUrl = `${SITE_CONFIG.url}#/post/${post._id}`;
    
    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: post.excerpt || post.content.substring(0, 200),
      content: post.content,
      author: [SITE_CONFIG.author],
      date: new Date(post.createdAt),
      category: post.tags?.map(tag => ({ name: tag })) || [],
      image: post.cover || undefined
    });
  });

  // 生成 RSS 2.0
  writeFileSync(resolve(__dirname, '../dist/rss.xml'), feed.rss2());
  
  // 生成 Atom 1.0
  writeFileSync(resolve(__dirname, '../dist/atom.xml'), feed.atom1());
  
  // 生成 JSON Feed
  writeFileSync(resolve(__dirname, '../dist/feed.json'), feed.json1());

  console.log('✅ RSS Feed 生成成功:');
  console.log('  - rss.xml (RSS 2.0)');
  console.log('  - atom.xml (Atom 1.0)');
  console.log('  - feed.json (JSON Feed)');
}

// 如果直接运行此脚本，生成示例 Feed
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // 示例数据（实际使用时应从数据库或构建后的数据中获取）
  const samplePosts = [
    {
      _id: 'sample-1',
      title: '欢迎来到 Chris Know',
      content: '这是第一篇示例文章...',
      excerpt: '欢迎来到我的个人博客',
      createdAt: new Date().toISOString(),
      tags: ['博客', '技术']
    }
  ];
  
  generateRSSFeed(samplePosts);
}

export default generateRSSFeed;
