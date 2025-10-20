### STAGE 1: Build ###
FROM node:18-alpine as build
WORKDIR /main
ENV PATH /app/node_modules/.bin:$PATH

COPY . /main
ARG mode
RUN echo "Building version: $mode"
RUN yarn install

RUN yarn trans
RUN mode=$mode yarn build

### STAGE 2: NGINX ###
FROM node:18-alpine
RUN apk --no-cache add bash curl ca-certificates
ARG git_commit=default
ARG version=0.0.0
ARG env=dev
ENV GIT_COMMIT=$git_commit
ENV VERSION=$version
ENV ENV=$env
ENV TZ=Asia/Bangkok
LABEL GIT_COMMIT=$git_commit \
      VERSION=$version \
      ENV=$env
LABEL vendor="Snocko" project="account-ui"
RUN apk add --no-cache tzdata curl
RUN apk update
COPY --from=build /main/app/dist /app/build
RUN npm i -g serve

EXPOSE 80
CMD ["serve", "-s", "/app/build","-l","80"]
