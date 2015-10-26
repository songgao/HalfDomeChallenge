# ElCapChallenge

ElCapChallenge is a simple website that we used at Auburn University for an (indoor) rock climbing challenge where climbers were challenged to climb 2900 feet (or 58 pitches in our rec center) in two weeks. The name of the challenge is because 2900 feet is roughly the height of the famous route [The Nose](https://en.wikipedia.org/wiki/The_Nose_(El_Capitan)) at El Capitan mountain in Yosemite, CA.

## What does it do?

The website allows climbers to login with Facebook and record their pitches using their cellphones or computers. It also features an Eagle's-eye View where most recently updated climbers' progress is shown and their pictures are overlayed on a images of El Capitan (like floating heads :D). Administrators can create, enable, and disable routes, approve/discard recorded pitches, or generate reports.

## What does it look like?

Here's a screenshot for "Eagle's-eye View" but take a look at `screenshots` directory for other views.

![Eagle's-eye View](https://raw.githubusercontent.com/songgao/ElCapChallenge/master/screenshots/eagleseye.png)

## What is it built with?

Go + MongoDB on service side, and React.js/Flux for front-end. Some components are actually handled by Bootstrap.js and are not purely reactive. I wish I know about [React Bootstrap](static/js/lib/stores/fb_login.js) before I started.

## Can I use it in our climbing gym?

Sure! The website is free to use by anybody, open sourced under [BSD 3-Clause License](http://opensource.org/licenses/BSD-3-Clause).

## What do I need to run the website?

You need a server (either physical or cloud) that runs Linux or Unix. The website is built with Go and javascript, and uses mongodb. So you need a Go compiler, node.js/npm, and mongodb. We used Ubuntu 14.04 but any recent Linux/Unix should work. All these mentioned above are free and open source except maybe the server itself.

## What do I need to configure?

You need a `config.json`. For example:

```json
{
  "fb_app_id"      : "<your facebook APP id>",
  "fb_app_secret"  : "<your facebook App secret>",
  "laddr_https"    : "0.0.0.0:443",
  "db_name"        : "elcap_prod",
  "db_addr"        : "localhost",
  "ca_cert"        : "certs/server.crt",
  "ca_key"         : "certs/server.key",
  "ui_path"        : "static",
  "require_approve": true
}
```

Also, you need to change the `appId` to your Facebook APP ID in javascript code, particularly file `static/js/lib/stores/fb_login.js`

`make` in `static/js` pulls dependencies and builds `bundle.js`, which is essentially the front-end.

You will also need a valid SSL certificate if you run the server barely. We used Cloudflare's free plan as CDN. It issues a SSL certificate for free, and we use a self-signed certificate for communication between Cloudflare and our server.

## Is it bug free?

No. Contributions welcomed :D

## What should I have for breakfast?

Waffle, hash browns, fried eggs, and coffee. Oh and bacon!
