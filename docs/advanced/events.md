# Events
The `Client` class, used to query the Akismet service, is an `EventEmitter` that triggers some events during its life cycle.

## The "request" event
Emitted every time a request is made to the remote service:

```javascript
import {Blog, Client} from "@cedx/akismet";

function main() {
	const client = new Client("123YourAPIKey", new Blog(new URL("https://www.yourblog.com")));
	client.on(Client.eventRequest, request =>
		console.log(`Client request: ${request.url}`)
	);
}
```

## The "response" event
Emitted every time a response is received from the remote service:

```javascript
import {Blog, Client} from "@cedx/akismet";

function main() {
	const client = new Client("123YourAPIKey", new Blog(new URL("https://www.yourblog.com")));
	client.on(Client.eventResponse, (response, request) =>
		console.log(`Server response: ${response.status}`)
	);
}
```
