path: blob/master
source: src/client.ts

# Events
The `Client` class, used to query the Akismet service, is an [`EventEmitter`](https://nodejs.org/api/events.html) that triggers some events during its life cycle.

## The `Client.eventRequest` event
Emitted every time a request is made to the remote service:

```js
import {Blog, Client} from '@cedx/akismet';

function main() {
  const client = new Client('123YourAPIKey', new Blog(new URL('https://www.yourblog.com')));
  client.on(Client.eventRequest, request =>
    console.log(`Client request: ${request.url}`)
  );
}
```

## The `Client.eventResponse` event
Emitted every time a response is received from the remote service:

```js
import {Blog, Client} from '@cedx/akismet';

function main() {
  const client = new Client('123YourAPIKey', new Blog(new URL('https://www.yourblog.com')));
  client.on(Client.eventResponse, (response, request) =>
    console.log(`Server response: ${response.status}`)
  );
}
```
