# blockly-react-node


> Proof of concept for creating data entry apps quickly using Blockly to describe the app, Node to host it and React to power the UI.



## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Background
Code generation, dynamic applications and DSLs are often problematic unless there are large economies of scale.  In other words, the effort in creating them is usually not justified by the total time they save across all consumers.
This project is intended to demonstrate how a dynamic language (JavaScript w/ReactJS), a "schema-less" database (MongoDB) and hierarchical metadata DSL could offer less friction and increase ROI.
For more background and information about how the app is composed, go here: http://theredcircuit.com/2017/05/17/reactjs-mongodb-blockly-create-data-entry-sites-fast/
## Install

The app contains an install script which will pull down all the necessary node modules.
```
npm run install-all
```


## Usage

This code uses docker to ease deployment.  If you do not want to use docker, that is not a problem.  You can still run the various pieces independently.
I'm still trying to figure out the optimal way to allow users to quickly get everything running.  So please bear with me.

If you have docker running on your local machine, the easiest thing to do is: 
```
npm run startDev
```
This will take a while.  It is going to pull down the nginx and mongodb images and build a new brn-nginx container to serve your files.
I'm trying to find a faster way.

If you'd prefer to do things the old-fashioned way I don't blame you.
* MongoDB

    A local install will be fine.  The app is looking for mongo on localhost:27017 (default port).
    
* Blockly
    
    This is a static page and you can run it by pointing any web server at ./blockly/src
    
* Node Server
    
    You can run this by going to the ./server directory and typing npm start
     
 * React Client
 
    Go to the ./client directory and type npm start

Note: you may find places where you run into CORS issues or URLs that aren't quite right because they were written with Nginx or a reverse proxy in mind.

## API

The app uses Hapi JS to serve a rest API.  It generates an API that looks like this:
```
http://0.0.0.0:10437
  GET    /api/{useCaseName}/{namespaceTitle}/{relationTitle}
  POST   /api/{useCaseName}/{namespaceTitle}/{relationTitle}
  GET    /api/{useCaseName}/{namespaceTitle}/{relationTitle}/{id}
  PUT    /api/{useCaseName}/{namespaceTitle}/{relationTitle}/{id}
  PATCH  /api/{useCaseName}/{namespaceTitle}/{relationTitle}/{id}
  POST   /api/backbone/useCase          Insert useCase.
  GET    /api/backbone/useCase/{appName}
  GET    /api/status
```

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © Dave Welling
