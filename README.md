# VTA Middleware

A node express application for VTA Middleware

## Getting Started

To run the middleware locally, you need to have NodeJs installed.

Copy /config/.env.example to /config/.env and fill in the IBM Watson Assistant API environment variables, 
so the middleware can consume Assistant API.

### Prerequisites

If you do not have NodeJs install, you can visit https://nodejs.org/en/ and install the LTS version.

### Installing

After you have cloned or downloaded the repository, install the dependencies:

```
npm install
```

Running the app locally:
```
node app.js
```
## Running the tests

Mocha and Chai are used for creating unit tests.

You can run tests by:
```
npm test
```

## Contributing

Please make changes in your own branch and make a pull request.

