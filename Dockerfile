FROM alpine:3.6

RUN \
  apk add --no-cache \
    python3 \
&& \
  pip3 install \
    falcon \
    gunicorn \
    distance \
    celery \
    redis

ADD ./future-devops/ /future-devops/

WORKDIR /future-devops/

CMD celery -A tasks worker --loglevel=info & gunicorn --reload -b 0.0.0.0:5000 app
