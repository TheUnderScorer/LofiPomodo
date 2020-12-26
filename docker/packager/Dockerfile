FROM electronuserland/builder:wine-mono

RUN apt-get update -y --allow-insecure-repositories
RUN apt-get install -y fakeroot dpkg xvfb
RUN Xvfb :99 -ac & sleep 5
RUN export DISPLAY=:0

# Removes the original 32-bit wine prefix from the generated image
RUN rm -rf /root/.wine
# Creates a new 64-bit one
RUN winecfg

COPY ./package.json /project/package.json
COPY ./package-lock.json /project/package-lock.json
COPY ./forge.config.js /project/forge.config.js

RUN npm install --verbose
RUN npm run rebuild

