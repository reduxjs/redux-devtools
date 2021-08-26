import { setupWorker } from 'msw';
import { handlers } from './db';

export const worker = setupWorker(...handlers);
