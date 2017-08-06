# Future DevOps
Future DevOps is a little `falcon` service with one-page JS-client served by `nginx`

Future DevOps takes two lists as input, hashes their elements and intercompares them using Levenstein distance.
## Using
1. Run `docker` container with command
```
docker run -p 8080:80 express42/future-devops
```
2. Visit http://127.0.0.1:8080/
3. Fill `Tools` and `Emails` columns one entry by line
4. Press `Find winners` button
5. Wait for result

## Developing
1. Clone this repo with command
```
git clone git@github.com:express42/future-devops.git
```
2. Run `docker-compose` inside repo folder with command
```
cd ./future-devops/
docker-compose up --build
```
3. All your changes inside `./future-devops/future-devops/` and `./future-devops/static/` folders will be immediately applied to the service

## Contents
* `future-devops` - contains `falcon` application
* `static` - contains static one-page JS-client
* `nginx.conf` - config for nginx
* `Dockerfile` - desription of `docker` container
* `docker-compose.yml` - configuration for `docker-compose`