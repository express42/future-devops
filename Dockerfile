FROM alpine:3.6

RUN \
  apk add --no-cache \
    python3 \
    nginx \
&& \
  pip3 install \
    falcon \
    gunicorn \
    distance \
    celery \
    redis \
&& \
  mkdir -p /run/nginx

ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./static/ /static/
ADD ./future-devops/ /future-devops/

EXPOSE 80

WORKDIR /future-devops/

CMD celery -A tasks worker --loglevel=info & gunicorn --reload -b 127.0.0.1:5000 app & nginx -g 'daemon off;'
