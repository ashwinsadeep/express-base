# express-base
Express.js base project with cluster and enrouten for improved reliability, error handling and easy routing. Making this public just so that anyone who stumbles upon the same problem will have an easier time setting things up and can spend their time building a robust app rather than spending time wandering mindlessly through endless documentation.

Cluster support will make sure you have a fault tolerant backend which recovers automatically from any programmer errors which might crash your web server process.
Express-enrouten is used to provide a hierarchial controller structure so that you can have routes were your url's are versioned

# URL Versioning
Bootstrap is configured such that all requests to `yourhost.com/{prefix}/v[4|5|6|..]/resource` will be handled by the handler in `controllers` -> `version` -> `resource.js`. In case you are not overriding the method in version specific controller, it'll be handled by the controller in `vcommon` directory.
