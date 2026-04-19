import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  author: string;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  locale: string;
};

const BLOG_ROOT = path.join(process.cwd(), 'content', 'blog');

function getPostFilePath(slug: string, locale: string): string {
  return path.join(BLOG_ROOT, locale, `${slug}.mdx`);
}

function parsePost(raw: string, slug: string, locale: string): Post {
  const { data, content } = matter(raw);

  return {
    slug,
    locale,
    content,
    title: typeof data.title === 'string' ? data.title : '',
    date: typeof data.date === 'string' ? data.date : '',
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    author: typeof data.author === 'string' ? data.author : '',
  };
}

function toTimestamp(date: string): number {
  const timestamp = new Date(date).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  const normalizedSlug = slug.replace(/\.mdx?$/i, '');
  const filePath = getPostFilePath(normalizedSlug, locale);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return parsePost(fileContent, normalizedSlug, locale);
  } catch (error) {
    console.warn(
      `[blog] Failed to parse MDX frontmatter for ${locale}/${normalizedSlug}.mdx: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return null;
  }
}

export function getAllPosts(locale: string): Post[] {
  const localeDir = path.join(BLOG_ROOT, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const posts = fs
    .readdirSync(localeDir)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/i, ''))
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));

  return posts;
}
