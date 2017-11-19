Kort
===========

### About

A web application for
[card sorting](https://en.wikipedia.org/wiki/Card_sorting),
[tree testing](https://en.wikipedia.org/wiki/Tree_testing),
and [product reaction cards](https://en.wikipedia.org/wiki/Microsoft_Reaction_Card_Method_(Desirability_Testing)).
See the linked [website for screenshots and additional details.](https://carlsonp.github.io/kort/)

### Install

1. Use [Git](https://git-scm.com/) to clone the code (`git clone https://github.com/carlsonp/kort.git`) or [download a release](https://github.com/carlsonp/kort/releases).

2. Install [Node.js](https://nodejs.org)

3. Install [MongoDB](https://www.mongodb.com/) or provide a connection to an existing server
by editing the `app.js` file and setting the `mongoURL`.

4. Edit the `secretHash` value in `app.js` and provide your own unique value.

5. Optionally edit the `adminUser` and set your own username.

6. Edit the `adminPassword` value in `app.js`.

7. Run `npm install` on the commandline.  This will install the dependencies into the `node_modules` folder.

8. Run `node app.js` from the main directory.  This will start the NodeJS server
on the default port 3000.  You can connect via http://localhost:3000

9. The default admin user in `app.js` will be created upon first launch.  Use this user to login.


### Support

Open a [Github issue](https://github.com/carlsonp/kort/issues).

### License

Kort is licensed under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
