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
&& \
  mkdir -p /run/nginx

ADD ./default.conf /etc/nginx/conf.d/default.conf
ADD ./static/ ./static/
ADD ./future-devops/ ./future-devops/

EXPOSE 80

CMD gunicorn --reload -b 127.0.0.1:5000 future-devops.app & nginx -g 'daemon off;'
