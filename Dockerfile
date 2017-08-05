FROM alpine:3.6

RUN \
  apk add --no-cache \
    python3 \
&& \
  pip3 install \
    falcon \
    gunicorn \
    distance

ADD ./future-devops/ ./future-devops/

CMD gunicorn -b 0.0.0.0 future-devops.app
