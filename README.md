# express-scaffold
Express.js scaffold project with cluster and enrouten integrated

Cluster support will make sure you have a fault tolerant backend which recovers automatically from any programmer errors which might crash your web server process.
Express-enrouten is used to provide a hierarchial controller structure so that you can have routes were your url's are versioned

# url versioning
Bootstrap is configured such that all requests to `yourhost.com/{prefix}/v[4|5|6|..]/resource` will be handled by the handler in `controllers` -> `version` -> `resource.js`. In case you are not overriding the method in version specific controller, it'll be handled by the controller in `vcommon` directory.
