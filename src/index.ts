import fetch from 'node-fetch';

if (typeof Reflect.get(global, 'fetch') != 'function') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore: `fetch` has the wrong typings.
  const {Headers, Request, Response} = fetch;
  Object.assign(global, {fetch, Headers, Request, Response});
}

export * from './core/author';
export * from './core/blog';
export * from './core/comment';
export * from './http/error';
export * from './http/events';
export {NodeClient as Client} from './http/node_client';
