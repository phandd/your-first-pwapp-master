# Service worker guide

An implementation of Google's Your First Progressive Web App guide

https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/

Service worker takes control the request to server, serves files from cache if available, bypass the request to server if not. This reduces loading files, app shells time from server by use files already stored in cache from the first time user access the page.

Service worker has [life cycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#devtools), there's only one version of service worker run at a time. Any modifies of the service worker file will create a new version of service worker, this new one will be registered and wait until the current one stop to be activated.

Service worker stops when there's no page on the browser running inside it's scope.
