# Web Components - demo
This is a demonstration project on how to use web components to build a simple application.

## Requirements
- Node.js v18.0.0 or higher
- Local certificate

## Local certificate
You will need to create a local certificate for testing locally. The files needed are: `certs/server.crt` and `certs/server.key`.

To get those files you can use [`mkcert`](https://github.com/FiloSottile/mkcert) as it is the easiest way to create a local certificate.

You can run the following command:
```shell
$ mkcert -key-file certs/server.key -cert-file certs/server.crt localhost
```

## Run locally
To run the project locally for development purposes, you will need to run the following commands:
```shell
$ npm i -D
$ npm start
```

They will install all dependencies and start the project in development mode.

## Lint project
To push code to the repository you will need to pass linting on the whole project.

To lint the project run the following command:
```shell
$ npm run lint
```

## Build project
When you are ready to build the project run the following command:
```shell
$ npm run build
```

It will generate a `dist` folder with the built project ready to be deployed to a static site hosting.

## Build visual assets (icons and splash screens)
In case the visual assets (icons and splash screens) are updated, you will need to run the following command to generate the new assets:
```shell
$ npm run build:assets
```

It will output the new assets to the `public` folder, replacing the old ones.

## Test project
```shell
$ npm run test
```
