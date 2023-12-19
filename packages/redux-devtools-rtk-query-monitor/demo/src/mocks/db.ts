import { factory, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';
import { http, HttpResponse, delay } from 'msw';
import { Post } from '../services/posts';

const db = factory({
  post: {
    id: primaryKey(String),
    name: String,
  },
});

[
  'A sample post',
  'A post about RTK Query',
  'How to randomly throw errors, a novella',
].forEach((name) => {
  db.post.create({ id: nanoid(), name });
});

export const handlers = [
  http.post<never, Post, Post | { error: string }>(
    '/posts',
    async ({ request }) => {
      const { name } = await request.json();

      if (Math.random() < 0.3) {
        await delay(300);
        return HttpResponse.json(
          { error: 'Oh no, there was an error, try again.' },
          { status: 500 },
        );
      }

      const post = db.post.create({
        id: nanoid(),
        name,
      });

      await delay(300);
      return HttpResponse.json(post);
    },
  ),
  http.put<{ id: string }, Post, Post | { error: string }>(
    '/posts/:id',
    async ({ params, request }) => {
      const { name } = await request.json();

      if (Math.random() < 0.3) {
        await delay(300);
        return HttpResponse.json(
          { error: 'Oh no, there was an error, try again.' },
          { status: 500 },
        );
      }

      const post = db.post.update({
        where: { id: { equals: params.id } },
        data: { name },
      });

      await delay(300);
      return HttpResponse.json(post);
    },
  ),
  ...db.post.toHandlers('rest'),
] as const;
