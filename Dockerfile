FROM python:alpine

WORKDIR /usr/src/app

COPY ./future-devops/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ADD ./future-devops/ ./
#CMD celery -A tasks worker --loglevel=info
CMD gunicorn --reload -b 0.0.0.0:5000 app
