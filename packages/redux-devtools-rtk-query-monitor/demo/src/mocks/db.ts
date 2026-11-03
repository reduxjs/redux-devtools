import { Collection } from '@msw/data';
import { nanoid } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw/http';
import { delay } from 'msw/utils/delay';
import { z } from 'zod';
import { Post } from '../services/posts';

const posts = new Collection({
  schema: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const seeded = Promise.all(
  [
    'A sample post',
    'A post about RTK Query',
    'How to randomly throw errors, a novella',
  ].map((name) => posts.create({ id: nanoid(), name })),
);

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

      const post = await posts.create({
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

      const post = await posts.update((q) => q.where({ id: params.id }), {
        data(post) {
          post.name = name;
        },
      });

      await delay(300);
      if (!post) {
        return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return HttpResponse.json(post);
    },
  ),
  http.get<never, never, Post[]>('/posts', () =>
    HttpResponse.json(posts.all()),
  ),
  http.get<{ id: string }, never, Post | { error: string }>(
    '/posts/:id',
    ({ params }) => {
      const post = posts.findFirst((q) => q.where({ id: params.id }));
      if (!post) {
        return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return HttpResponse.json(post);
    },
  ),
  http.delete<{ id: string }, never, Post | { error: string }>(
    '/posts/:id',
    ({ params }) => {
      const post = posts.delete((q) => q.where({ id: params.id }));
      if (!post) {
        return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return HttpResponse.json(post);
    },
  ),
] as const;
