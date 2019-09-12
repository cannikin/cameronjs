## Cameron: A Simple Framework for Awesome Apps

Cameron is a lightweight framework for building simple (or not so simple) HTML and Javascript websites and apps. If you want to get something online that has some simple interactivity, forms and even an API, but don't want or need to use [React](https://reactjs.org/), [Vue](https://vuejs.org/), [Ember](https://emberjs.com/) or [Angular](https://angular.io/) then you've come to the right place: Cameron keeps it simple.

If you're just starting out as a web developer then Cameron is a great place to learn the ropes. You can focus on the fundamentals of HTML, Javascript and CSS without learning a half dozen other new technologies at the same time. Cameron uses some of those technologies behind the scenes but you can safely ignore them when staring out.

You write HTML, CSS and Javascript and deploy (see the [glossary](#glossary)) them however you like. For the simpliest deployment you've ever seen we like Netlify. With Netlify you can also submit forms, add signup and login, and even provide an API all without worrying about any server setup or infrastructure.

## Installation

Cameron requires that you have `node` and `npm` or `yarn` installed. [Here's a guide]() for doing that. Once you've got those you'll want to install Cameron globally so you create new apps from anywhere. If you're using `npm` you can install with:

    npm install -g cameronjs

or with `yarn`:

    yarn global add cameronjs

## Creating an app

Cameron gives you a command line tool called `cameronjs` to actually create and work with your app. The `create` command will create a directory with the name you give it and populate it with the basic structure of a Cameron app:

    cameronjs create my_first_app

After a minute or so you'll have your app's basic shell. You'll also see some post-install instructions to get your app up and running in your browser. Change directories into your app then run the `develop` command to start a web server and automatically open your browser:

    cd my_first_app
    cameronjs dev

Your web browser should automatically open http://localhost:8080 and display the Cameron welcome page! There are some simple next steps on the welcome page including instructions for actually deploying your site to the internet in a couple of easy steps!

## Production

When you're ready for production you can create an optimized build with:

    cameronjs build

And try serving that optimized build locally to make sure everything is working as expected (everything is served from the `/public` directory):

    cameronjs serve

If you deploy to Netlify using our defaults you won't need to run these commands yourself. Netlify will run the `build` command automatically and then serve the site themselves.

## Development with Netlify

When you're ready to add try out some serverless calls you can test them locally with:

    cameronjs netlify

This will actually start two web servers, one at http://localhost:8080 just like `cameronjs dev` and another one at http://localhost:8888 which will respond to Netlify function calls at URLs like http://localhost:8888/.netlify/functions/my-function

## Technologies

Cameron uses a combination of several other technologies to make your life easier. You *can* structure your code any way you want, but Cameron provides some sensible defaults and includes libraries that we think will improve your workflow.

### StimulusJS

As their [Handbook](https://stimulusjs.org) says, Stimulus is "designed to augment your HTML with just enough behavior to make it shine." Stimulus isn't worried about managing state or running your codebase as a single page app, it simply hooks into your HTML where you want and will invokes some functions when users take actions.

Stimulus is great for validating form fields, submitting them via AJAX and showing/hiding sections of the page as the user interacts with it—all common functionality in modern web apps. It can do a lot more, however.

### Tailwind CSS

[Tailwind](https://tailwindcss.com) is a "utility-first" collection of CSS rules that enable you to build beautiful, custom interfaces without having to write any CSS yourself. You can, but you may very well find find that Tailwind gives you everything you need to build the app of your dreams.

### Netlify

You don't need to deploy to [Netlify](https://netlify.com), but if you choose to then Cameron is ready to go. We provide your app with a config file and `/functions` directory ready for you to create your server-side code. You can submit forms to Netlify directly and even provide user registration and login functionality, two features that would traditionally require creating and maintaining your own database. Oh, and for most moderate size websites, Netlify is completely free!

### Live Server

It the old days (a few years ago) you'd make a change to your code and then switch to your browser and manually reload it. Over and over again, hundreds of times a day. Cameron includes node's `live-server` package so that as soon as you save your file your browser automatically reloads and shows you the changes.

### PurgeCSS

When you're ready for production a good goal is to make your files as small as possible—the pages load faster from the server and, if you're doing your own hosting, you pay less for the bandwidth to get those pages to the user. [PurgeCSS]() makes sure your CSS output is as small as possible by removing any CSS styles that aren't actually used in your HTML. In a simple web app we've seen the final CSS file size go from ~450KB to 3KB!

### Webpack

[Webpack]() lets you write modern ES6 style Javascript but makes sure it's something that most modern browsers can run, even if you use some fancy syntax that those browser don't know about yet. It will also minify your Javascript (remove all those extra characters that the browser doesn't need).

Webpack is also extremely extensible so that when the time comes to add more advanced functionality, your Cameron app is ready to go.

## Glossary

**Build**
Build definition

**Deploy**
Make your site or app available to the internet for the world to see. This used to be a pretty involved process with running your own servers, keeping them secure and up-to-date with the latest software. With a provider like Netlify you don't need to worry about any of that any more—one command `git push` and your site is live.

**Git**
Code repository

**Static Site**
All the content of the site is already created and just waiting to be delivered to a browser. Any kind of interaction that takes place is via Javascript in the browser. There may be some API calls to save/retrieve data to be displayed. Contrast this with a modern webapp where the content you see may have been assembled from many parts by the server before being sent to the browser.

**Website vs Webapp**
The lines between the two are being blurred but traditionally you would consider a web*site* something more static like a marketing page meant to advertise something, whereas a web*app* contains provides interaction with the user to work with some data (like an email inbox)

## Troubleshooting

#### Some of my styles that work fine in development aren't showing in production.

Remember how PurgeCSS removes unused CSS styles? It can only find those CSS styles that are already in your HTML pages. If you add a CSS class via Stimulus, for example, Purge won't know about it and assume you didn't use it. In this case you'll need to let PurgeCSS know the names of those classes manually. In the `postcss.config.js` file, add your classes to the `whitelist` key in the `purgecss` config section:

```javascript
module.exports = {
    // ...
    process.env.NODE_ENV === "production" &&
      require("@fullhuman/postcss-purgecss")({
        content: ["./public/**/*.html"],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        whitelist: ["custom-class1", "custom-class2", "etc"]
      }),
    // ...
}
```

## TODO

### Framework


### CLI

* [ ] Update `build` to force production compilation (or add new task to do so)
* [ ] Use yarn-or-npm for script running
* [ ] Install `netlify dev` via `-g`
* [ ] `cameron netlify` in place of `netlify dev`

### README

* [ ] Explanation of all build scripts
* [ ] Explanation of "old fashioned" web development—get your own styles, scripts, images

### Cameron Welcome Page

* [ ] Simple instructions for finding/editing the current page (maybe adding an image)
* [ ] Instructions for deploying to Netlify
* [ ] Maybe include a snippet for creating a form?
* [ ] Maybe include a snippet for creating a function? (Return something dynamic user can pick from in form)

### cameronframework.com

* [ ] Get domain
* [ ] Intro video that runs through entire framework
* [ ] Forms with Netlify
* [ ] Functions with Netlify
* [ ] Identity with Netlify
