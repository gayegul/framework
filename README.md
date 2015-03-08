# framework
Simple RESTful persistance server

This is a RESTful persistance server that allows storing JSON data with ease. It supports all 5 HTTP methods (patch, put, delete, post, get) and usage is very simple:

```JavaScript
var framework = require('./lib/framework.js');
framework.addResource('testDir1');
framework.addResource('testDir2');
framework.start(3000);
```

```Shell
$ superagent localhost:3000/testDir2/12 put '{ "harry" : "potter" }'
$ superagent localhost:3000/testDir2/12 get 
'{ "harry" : "potter" }'
```


