import { SearchQuery } from '../searchPanel/SearchPanel';
import { Value } from './searchWorker';

export function searchInObject(
  objectToSearch: Value,
  query: SearchQuery
): Promise<string[]> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./searchWorker.js', import.meta.url));

    worker.onmessage = (event: MessageEvent<string[]>) => {
      resolve(event.data);
      worker.terminate();
    };

    worker.postMessage({ objectToSearch, query });
  });
}
