FROM node:16.14-alpine3.14

WORKDIR /home/app

# COPY FILES
COPY src/ /home/app/src/
COPY *.json /home/app/
COPY *.lock /home/app/

RUN yarn install
RUN yarn build
RUN rm -rf src/ node_modules/
RUN yarn install --production=true

CMD [ "yarn", "start:prod" ]
