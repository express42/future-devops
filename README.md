# Future DevOps
Future DevOps is a little `falcon` service with one-page JS-client served by `nginx`

Future DevOps takes two lists as input, hashes their elements and intercompares them using Levenstein distance.

## Описание (Description on russian)
Приложение Future DevOps работает по следующему алгоритму
1. На вход подаются два списка: список инструментов DevOps и список адресов электронной почты.
2. От каждого элемента обоих списков считается контрольная сумма
3. Высчитывается расстояние Левенштейна между каждой парой контрольных сумм из разных списков
4. Выбираются адреса электронной почты с наименьшим расстоянием к инструментам DevOps
5. Если адресов меньше или равно необходимому (на первом шаге это число равно двум), то все адреса переходят в статус "победителей"
6. Иначе (если адресов больше) то из потенциальных победителей случайным образом выбирается недостающее количество адресов
7. Шаги 4-6 повторяются, пока не будет набрано необходимое количество адресов

## Using
1. Clone this repo and change dir inside repo folder with commands
```
git clone git@github.com:express42/future-devops.git
cd ./future-devops/
```
2. Build `docker` image with command
```
docker build -t express42/future-devops .
```
2. Run `docker-compose` with command
```
docker-compose up
```
3. Visit http://127.0.0.1:8080/
4. Fill `Tools` column one entry by line
5. Click on `Emails` column and upload file containing email addresses one per line
6. Press `Find winners` button
7. Wait for result

You can use `example.csv`-file for testing purposes

## Contents
* `future-devops` - contains `falcon` application
* `static` - contains static one-page JS-client
* `nginx.conf` - config for nginx
* `Dockerfile` - desription of `docker` container
* `docker-compose.yml` - configuration for `docker-compose`