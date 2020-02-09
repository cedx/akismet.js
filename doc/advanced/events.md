path: blob/master
source: src/http/mixin.ts

# Events
The `Client` class, used to query the Akismet service, is an [`EventEmitter`](https://nodejs.org/api/events.html) that triggers some events during its life cycle.

### The `Client.eventRequest` event
Emitted every time a request is made to the remote service:

```js
client.on(Client.eventRequest, (request) =>
  console.log(`Client request: ${request.url}`)
);
```

### The `Client.eventResponse` event
Emitted every time a response is received from the remote service:

```js
client.on(Client.eventResponse, (request, response) =>
  console.log(`Server response: ${response.status}`)
);
```
