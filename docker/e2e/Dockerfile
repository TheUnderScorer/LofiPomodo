FROM node:14 as runner
LABEL maintainer="przemyslawzydek@gmail.com"

WORKDIR /app

RUN apt-get update && \
  apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi \
  xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev \
  libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev \
  libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib

ENV ELECTRON_ENABLE_STACK_DUMPING=true
ENV ELECTRON_ENABLE_LOGGING=true
ENV DISPLAY=:99

RUN npm install --global typescript pm2

COPY . ./
COPY ./.env ./env.dist

RUN npm ci
RUN npm run build-renderer
RUN npm run build-electron

ADD docker/e2e/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT [ "/docker-entrypoint.sh" ]

