import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { projects } from '../data/projects';
import { AUTHOR_SHORT, BLURB, CONTACT, TAGLINE, TOPICS } from '../data/site';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const body = `# allierays.com

> ${TAGLINE}

${BLURB}

## Author

${AUTHOR_SHORT}

## Content

Posts are about:
${TOPICS.map((t) => `- ${t}`).join('\n')}

## Pages

- / — Writing: every post, newest first
- /about — who I am and what I've built
- /projects — Work: ${projects.map((p) => p.title).join(', ')}
- /rss.xml — RSS feed of all posts

## Latest Posts

${posts
  .slice(0, 5)
  .map((p) => `- [${p.data.title}](/posts/${p.id})`)
  .join('\n')}

## Full Index

See /llms-full.txt for a complete content index with all post titles, descriptions, and URLs.

## Contact

${CONTACT.map((c) => `- ${c}`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
