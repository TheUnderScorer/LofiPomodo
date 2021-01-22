FROM --platform=linux/amd64 electronuserland/builder:wine-mono

RUN apt-get update -y --allow-insecure-repositories
RUN apt-get install -y --allow-unauthenticated fakeroot dpkg xvfb
RUN Xvfb :99 -ac & sleep 5
RUN export DISPLAY=:0

COPY ./package.json /project/package.json
COPY ./package-lock.json /project/package-lock.json
COPY ./forge.config.js /project/forge.config.js
COPY ./tools /project/tools

RUN npm install --verbose
RUN npm install modclean -g
RUN npm run rebuild
RUN npm run clear-node-modules

