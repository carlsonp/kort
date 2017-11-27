Kort
===========

[![Build Status](https://travis-ci.org/carlsonp/kort.svg?branch=master)](https://travis-ci.org/carlsonp/kort)
[![Releases](https://img.shields.io/github/release/carlsonp/kort.svg)](https://github.com/carlsonp/kort/releases/latest)
[![All Downloads](https://img.shields.io/github/downloads/carlsonp/kort/total.svg)](http://www.somsubhra.com/github-release-stats/?username=carlsonp&repository=kort)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)


#### Table of Contents  
[About](#About)  
[Screenshots](#Screenshots)  
[Install](#Install)  
[Support](#Support)  
[License](#License)


<a name="About"/>

### About

A web application for
[card sorting](https://en.wikipedia.org/wiki/Card_sorting),
[tree testing](https://en.wikipedia.org/wiki/Tree_testing),
and [product reaction cards](https://en.wikipedia.org/wiki/Microsoft_Reaction_Card_Method_(Desirability_Testing)).
See the linked [website for screenshots and additional details.](https://carlsonp.github.io/kort/)

<a name="Screenshots"/>

### Screenshots

<img src="/docs/cs.png" width="400"/>
<img src="/docs/tt.png" width="400"/>
<img src="/docs/prc.png" width="400"/>
<img src="/docs/sus.png" width="400"/>

<a name="Install"/>

### Install

1. Use [Git](https://git-scm.com/) to clone the code (`git clone https://github.com/carlsonp/kort.git`) or [download a release](https://github.com/carlsonp/kort/releases).

2. Install [Node.js](https://nodejs.org)

3. Install [MongoDB](https://www.mongodb.com/) or provide a connection to an existing server
by editing the `app.js` file and setting the `mongoURL`.  To optionally [secure your MongoDB with a username
and password](https://stackoverflow.com/questions/4881208/how-to-secure-mongodb-with-username-and-password/19768877),
create a user for the `kort` database by doing the following:

    Open a Mongo commandline shell:
    ```
    mongo --port 27017
    ```

    Select the database:
    ```
    use kort
    ```

    Create the new user:
    ```
    db.createUser(
       {
         user: "kort",
         pwd: "123",
        roles: [ { role: "readWrite", db: "kort" } ]
       }
    )
    ```

    Then edit `/etc/mongodb.conf` and enable `auth=true`.  Restart the service.  Make sure to set
    the `mongoURL` with the appropriate username and password.

4. Edit the `secretHash` value in `app.js` and provide your own unique value.

5. Optionally edit the `adminUser` and set your own username.

6. Edit the `adminPassword` value in `app.js`.

7. Run `npm install` on the commandline.  This will install the dependencies into the `node_modules` folder.

8. Run `node app.js` from the main directory.  This will start the NodeJS server
on the default port 3000.  You can connect via http://localhost:3000

9. The default admin user in `app.js` will be created upon first launch.  Use this user to login.

<a name="Support"/>

### Support

Open a [Github issue](https://github.com/carlsonp/kort/issues).

<a name="License"/>

### License

Kort is licensed under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
