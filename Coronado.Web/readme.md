## To develop in Docker

This requires an old version of node so probably needs to run in Docker if you don't have Node 16 (or maybe 18).

```
docker build -t coronado-dev-image .
docker run -it --rm --name coronado_dev -p 5001:5001 -e ASPNETCORE_URLS=http://localhost:5001/ -v $(pwd):/code coronado-dev-image bash
```

Be sure the connection string uses `host.docker.internal` as the server to connect to Postgres on the host (or adjust it as necessary if it's in another Docker container).

### Why port 5001?

For whatever reason, AirPlay on Mac uses port 5000. I switched to 5001 in case I decide to re-enable that service later.

## What about a Docker Compose file?

I gave a half-hearted attempt at one but this started working so I abandoned it.