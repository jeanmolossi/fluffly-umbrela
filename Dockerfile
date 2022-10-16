FROM node:16.14-alpine3.14

# INSTALL CURL AND BASH
RUN apk add --upgrade curl bash

WORKDIR /home/app

# COPY FILES
COPY . .

RUN yarn install

CMD [ "yarn", "start" ]
