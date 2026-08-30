import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { projects } from '../data/projects';
import { AUTHOR_FULL, BLURB, CONTACT, TAGLINE } from '../data/site';

const iso = (d: Date) => d.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const body = `# allierays.com — Full Content Index

> ${TAGLINE}

${BLURB}

## Author

${AUTHOR_FULL}

## Posts

${posts
  .map((p) => {
    const updated = p.data.updated ? `, updated ${iso(p.data.updated)}` : '';
    const tags = p.data.tags.length ? ` [${p.data.tags.join(', ')}]` : '';
    return `- [${p.data.title}](/posts/${p.id}) — ${iso(p.data.date)}${updated}${tags}: ${p.data.description}`;
  })
  .join('\n')}

## Work

${projects
  .map((p) => `- ${p.title} (${p.date}) — ${p.stack} — https://github.com/allierays/${p.repo}: ${p.body}`)
  .join('\n')}

## Pages

- [Writing](/): Every post, newest first
- [About](/about): Who I am and what I've built
- [Work](/projects): ${projects.map((p) => p.title).join(', ')}

## Feeds

- /rss.xml — RSS feed
- /sitemap-index.xml — Sitemap

## Contact

${CONTACT.map((c) => `- ${c}`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
