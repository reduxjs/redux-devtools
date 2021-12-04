import { factory, primaryKey } from '@mswjs/data';
import { nanoid } from '@reduxjs/toolkit';
import { rest } from 'msw';
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
  rest.post<Post, never, Post | { error: string }>(
    '/posts',
    async (req, res, ctx) => {
      const { name } = req.body;

      if (Math.random() < 0.3) {
        return res(
          ctx.json({ error: 'Oh no, there was an error, try again.' }),
          ctx.status(500),
          ctx.delay(300)
        );
      }

      const post = db.post.create({
        id: nanoid(),
        name,
      });

      return res(ctx.json(post), ctx.delay(300));
    }
  ),
  rest.put<Post, { id: string }, Post | { error: string }>(
    '/posts/:id',
    (req, res, ctx) => {
      const { name } = req.body;

      if (Math.random() < 0.3) {
        return res(
          ctx.json({ error: 'Oh no, there was an error, try again.' }),
          ctx.status(500),
          ctx.delay(300)
        );
      }

      const post = db.post.update({
        where: { id: { equals: req.params.id } },
        data: { name },
      });

      return res(ctx.json(post!), ctx.delay(300));
    }
  ),
  ...db.post.toHandlers('rest'),
] as const;
