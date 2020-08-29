FROM python:3.8-buster as builder
WORKDIR /opt/app
COPY requirements.txt /opt/app/requirements.txt
RUN pip3 install -r requirements.txt


FROM python:3.8-slim-buster as runner
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
RUN apt update && apt install -y \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
COPY . /opt/app
WORKDIR /opt/app
EXPOSE 8000