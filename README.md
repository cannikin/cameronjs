## CameronJS: A Simple Framework for Awesome Apps

CameronJS is a lightweight framework for building simple (or not so simple) HTML and Javascript websites and apps. If you want to get something online that has some simple interactivity, forms and even an API, but don't want or need to use [React](https://reactjs.org/), [Vue](https://vuejs.org/), [Ember](https://emberjs.com/) or [Angular](https://angular.io/) then you've come to the right place: CameronJS keeps it simple.

You write HTML, CSS and Javascript and then deploy (see the [glossary](#glossary)) them however you like. For the simpliest deployment you've ever seen we like [Netlify](https://netlify.com). With Netlify you can also submit forms, add signup and login, and even provide an API all without worrying about any server setup or infrastructure.

If you're just starting out as a web developer then CameronJS is a great place to learn the ropes. You can focus on the fundamentals of HTML, CSS and Javascript without having  to learn a dozen other new technologies at the same time. CameronJS uses some of those technologies behind the scenes but you can safely ignore them when staring out.

And if you're an experienced dev that needs a smaller framework for creating simple apps quickly then CameronJS is definitely for you, too.

Check out the [Philosophy](#philosophy) section below for more.

## Installation

CameronJS requires that you have `node` and `npm` or `yarn` installed. If you're on a Mac then it's very simple using [Homebrew](https://brew.sh/):

    brew install node yarn

Installing node can be pretty different based on your OS. Do a quick [google search](https://www.google.com/search?q=install+node) to find the current best way for your OS. Yarn has great documentation for installing on most major OSes: https://yarnpkg.com/lang/en/docs/install

In the examples below we're going to assume you're using `yarn` but just substitute the commands for `npm` if needed. You'll want to install CameronJS globally so you create new apps from anywhere:

    yarn global add cameronjs

That's it! To see what it can do:

    cameronjs --help

## Creating an app

CameronJS gives you a command line tool called `cameronjs` to actually create and work with your app. The `new` command will create a directory with the name you give it and populate it with the basic structure of a CameronJS app:

    cameronjs new ~/Sites/my_first_app

After a minute or so you'll have your app's basic shell. You'll also see some post-install instructions to get your app up and running in your browser. Change directories into your app then run the `dev` command to start a web server and automatically open your browser:

    cd ~/Sites/my_first_app
    cameronjs dev

Your web browser should automatically open http://localhost:8080 and display the CameronJS welcome page! This server features live reloading so as soon as you make a change to your code it will show in your browser without manually refreshing. (Coming from the old days when you would manually reload hundreds of times a day, let me tell you this is *amazing*.)

There are some simple next steps on the welcome page including instructions for actually deploying your site to the internet in a couple of easy steps!

When you're done for the day just hit `ctrl-C` to stop the server.

## Production

When you're ready for production you can create an optimized build with:

    cameronjs build

Try serving that optimized build locally to make sure everything is working as expected (everything is served from the `/public` directory):

    cameronjs serve

If you deploy to Netlify using our defaults you won't need to run these commands yourself. Netlify will run the `build` command automatically and then serve the site themselves.

## Development with Netlify

Of course you can deploy anywhere you want but CameronJS is ready to go out of the box to [Netlify](https://netlify.com). Once you've created your Netlify account, and your app's code is in GitHub, GitLab or Bitbucket just create a new site on Netlify and find your repo:

![image](https://user-images.githubusercontent.com/300/64876047-283f6500-d603-11e9-8dcf-a3e4c4d24534.png)

A minute or two later your site will be live! Netlify will automatically run the `build` command to get all your files ready for production.

If and when you're ready to add try out some [serverless calls](https://www.netlify.com/products/functions/) you can test them locally by installing Netlify's CLI tools:

    yarn global add netlify-cli

Now login with your Netlify credentials:

    netlify login

To start the dev environment you would normally start it with `netlify dev` but we've got a custom build/watch process that `netlify` can't automatically identify yet so use the CameronJS wrapper instead:

    cameronjs netlify

This will actually start two web servers: one at http://localhost:8080 like usual and another one at http://localhost:8888 which will respond to Netlify function calls at URLs like http://localhost:8888/.netlify/functions/my-function

Learn more about Netlify Functions in their docs: https://www.netlify.com/docs/functions/

## Philosophy

I started a new job recently and part of that was coming up with many single-use, simple websites. Some needed to be just read-only (marketing sites) while others needed simple forms to accept names and emails, while others needed to ingest data from GitHub repos and produce nicely formatted webpages.

I could have used [Ruby on Rails](https://rubyonrails.org) or [React](https://reactjs.org) for these sites but that seemed like overkill—I just needed to save a few email addresses. If you've built any of these kinds of sites yourself you'll feel your stomach drop as soon as you think about submitting a form—you need a server to accept the submit and a database to save the data. My simple little app just got exponentially more complex.

After learning about the [JAM stack](https://jamstack.org/), and specifically [Netlify](https://netlify.com), I discovered that I could submit forms and save data without a server or a database—Netlify Forms will save it for me. And if I needed to talk to a database I could do that as well. I'd need to use a database somewhere in the world but I wouldn't need to worry about a server to talk to it, Netlify Functions do that. After creating three of these simple types of sites some patterns started to emerge. I pulled those patterns out and came up with a simple framework for creating these types of sites: CameronJS.

CameronJS assumes you want plain ol' HTML pages with just a bit of help: layouts and partials to create reusable parts of a page. CameronJS embraces a [utility-first](https://tailwindcss.com/docs/utility-first) CSS framework, [Tailwind CSS](https://tailwindcss.com/), to save you from having to write all your styles from scratch (in fact you might find yourself building entire sites without writing any new styles). CameronJS knows you'll probably need to add a little interactivity to your sites so it includes [StimulusJS](https://stimulusjs.org) for quickly adding interaction to parts of your pages.

Are you just starting to learn web development? We think CameronJS is a great place to start.

Web frameworks have become very complex. Which is what you need if you're buliding the next Facebook—you need that complexity to build complex things. But it's overkill when you just need a simple form, marketing site or personal blog. It's also extremely tough to get started in web development when you find out you much [you](https://blog.logrocket.com/the-increasing-nature-of-frontend-complexity-b73c784c09ae/[) [need](https://www.quora.com/Why-has-frontend-JavaScript-development-become-so-complex) [to](https://www.sitepoint.com/anatomy-of-a-modern-javascript-application/) [learn](https://en.arguman.org/web-programming-is-getting-unnecessarily-complicated). Here's a [fun parable](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f) of what it was like to learn Javascript in 2016, let alone today.

CameronJS aims to be both a great framework to learn the basics of web development, and a powerful tool for creating the simple kinds of apps we all find ourselves building now and then.

## Technologies

CameronJS uses a combination of several other technologies to make your life easier. You *can* structure your code any way you want, but CameronJS provides some sensible defaults and includes libraries that we think will improve your workflow.

### StimulusJS

As their [Handbook](https://stimulusjs.org) says, Stimulus is "designed to augment your HTML with just enough behavior to make it shine." Stimulus isn't worried about managing state or running your codebase as a single page app, it simply hooks into your HTML where you want and will invokes some functions when users take actions.

Stimulus is great for validating form fields, submitting them via AJAX and showing/hiding sections of the page as the user interacts with it—all common functionality in modern web apps. It can do a lot more, however.

### Tailwind CSS

[Tailwind](https://tailwindcss.com) is a "utility-first" collection of CSS rules that enable you to build beautiful, custom interfaces without having to write any CSS yourself. You can, but you may very well find find that Tailwind gives you everything you need to build the app of your dreams.

### Netlify

You don't need to deploy to [Netlify](https://netlify.com), but if you choose to then CameronJS is ready to go. We provide your app with a config file and `/functions` directory ready for you to create your server-side code. You can submit forms to Netlify directly and even provide user registration and login functionality, two features that would traditionally require creating and maintaining your own database. Oh, and for most moderate size websites, Netlify is completely free!

### Live Server

It the old days (a few years ago) you'd make a change to your code and then switch to your browser and manually reload it. Over and over again, hundreds of times a day. CameronJS includes node's `live-server` package so that as soon as you save your file your browser automatically reloads and shows you the changes.

### PurgeCSS

When you're ready for production a good goal is to make your files as small as possible—the pages load faster from the server and, if you're doing your own hosting, you pay less for the bandwidth to get those pages to the user. [PurgeCSS]() makes sure your CSS output is as small as possible by removing any CSS styles that aren't actually used in your HTML. In a simple web app we've seen the final CSS file size go from ~450KB to 3KB!

### Webpack

[Webpack]() lets you write modern ES6 style Javascript but makes sure it's something that most modern browsers can run, even if you use some fancy syntax that those browser don't know about yet. It will also minify your Javascript (remove all those extra characters that the browser doesn't need).

Webpack is also extremely extensible so that when the time comes to add more advanced functionality, your CameronJS app is ready to go.

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

* [x] Add 404 page and setup live-server to serve when page not found

### CLI

* [ ] Update `build` to force production compilation (or add new task to do so)
* [ ] Use yarn-or-npm for script running
* [x] `cameronjs netlify` in place of `netlify dev`

### README

### App Welcome Page

* [ ] Simple instructions for finding/editing the current page (maybe adding an image)
* [ ] Instructions for deploying to Netlify
* [ ] Maybe include a snippet for creating a form?
* [ ] Maybe include a snippet for creating a function? (Return something dynamic user can pick from in form)

### cameronjs.com

* [x] Get domain
* [ ] Copy of welcome page
* [ ] Intro video that runs through entire framework
* [ ] Forms with Netlify
* [ ] Functions with Netlify
* [ ] Identity with Netlify
* [ ] Explanation of "old fashioned" web development—get your own styles, scripts, images
* [ ] CSS intro
* [ ] JS intro
* [ ] Tailwind intro
* [ ] Stimulus intro
* [ ] Git intro
* [ ] First-app page that creates a signup page for a weather app
* [ ] Email intro (Sendgrid)
