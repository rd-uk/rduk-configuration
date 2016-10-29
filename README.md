# RDUK - configuration

Manage your Node.js app configuration

[![Build Status](https://travis-ci.org/rd-uk/rduk-configuration.svg?branch=master)](https://travis-ci.org/rd-uk/rduk-configuration)
[![Coverage Status](https://coveralls.io/repos/github/rd-uk/rduk-configuration/badge.svg?branch=master)](https://coveralls.io/github/rd-uk/rduk-configuration?branch=master)

## Installation

```
npm install rduk-configuration --save --save-exact
```

## Naming

Add the configuration file at the root of your project.
You have to name it according to the argument passed to the factory.

```js
var configuration = require('rduk-configuration');

var myConfig;

/* config.yml */
myConfig = configuration();

/* config.dev.yml */
myConfig = configuration('dev');

/* config.prod.yml */
myConfig = configuration('prod');
```

__Note:__

If you set `NODE_ENV`, you can access the configuration according to it

```js
myConfig = configuration.load(); //will load config.dev.yml if NODE_ENV === dev
```
___

# Reference

* [Configuration](#configuration)
    * [.settings](#configuration.settings)
    * [.connections](#configuration.connections)
    * [.getSection(name, type)](#configuration.get_section)

<a name="configuration"></a>
## Configuration

<a name="configuration.settings"></a>
### Configuration.settings
Get the SettingsSection of the config file

yaml:

```yml
settings:
    facebook:
        appId: APP_ID
        appSecret: APP_SECRET
```

usage:

```js
var fbSettings = myConfig.settings.get('facebook');

console.log(fbSettings.appId); //will output APP_ID
console.log(fbSettings.appSecret); //will output APP_SECRET
```

<a name="configuration.connections"></a>
### Configuration.connections
Get the ConnectionsSection of the config file

yaml:

```yml
connections:
    -
        name: con1
        host: localhost
        user: db1_user
        password: 123456
        database: db1
    -
        name: con2
        host: localhost
        user: db2_user
        password: 123456
        database: db2
    -
        name: mapbox
        token: my_mapbox_token
    -
        name: gmap
        token: my_gmap_token
```

usage:

```js
var con1 = myConfig.connections.get('con1');
var con2 = myConfig.connections.get('con2');

console.log(myConfig.connections.get() === myConfig.connections.get('con1')); //will output true
```

<a name="configuration.get_section"></a>
### Configuration.getSection(name, type)
Get the specified section

yaml:

```yml
map
    default: mapbox
    providers:
        -
            name: mapbox
            type: MapBoxProvider
            connection: mapbox
        -
            name: gmap
            type: GoogleMapProvider
            connection: gmap
```

section:

```js
var MapSection = function(section) {
    /* ... */
};


```

usage:

```js
var map = myConfig.getSection('map', MapSection);
```

__Note:__

If no type passed to the method, get the raw section.
