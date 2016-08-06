asmallbatch.co
===
We’re designing and developing our website as an open project. (/^ω^)/

---

## Useful scripts
### `npm start`
This script will run the build script and start the server. Server listens on port `8080`. Note that you’ll need to run [the certs script](#npm-run-certs) before you can successfully run the server locally.

### `npm run build`
This script will run dedicated scripts for:
- build CSS
- build bundled JavaScript
- copy vendor JavaScript files
- copy images

to the `assets/` directory, using files in the `source/` directory.

### `npm run watch`
The watch script will start the server, run build scripts, watch for changes to source files, and start a `browser-sync` proxy for the server. Your default browser should load the site in a new tab. In case it doesn’t, just go to: <https://localhost:3000>.

### `npm run certs`
Generates self-signed certificates so that the server has something to serve the browser. It will ask for some information to use in the certificate, but this can be anything you want.
