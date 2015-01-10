#\[★\]STRAP on Sass
##Compass responsive boilerplate + framework v2.1.0
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)


###Prerequirements:
* [Node.js with npm](http://nodejs.org/)
* [Ruby](https://www.ruby-lang.org) ([for Windows](http://rubyinstaller.org/))

####Grunt
```shell
npm install -g grunt-cli
```
####Sass+Compass
```shell
gem install compass
```
####Bower
```shell
npm install -g bower
```
####Install all required packages
In working directory:
```shell
npm install
bower install
```


So, finally, we are ready to develop with STRAP  
`grunt serve` runs development server  
`grunt serve:test` runs development server with tests  
`grunt` or `grunt build` build project: combine CSS and JS (separately of course), compress images, copy project's files and archive them (optional)


###Documentation and examples
* [On English](http://pfrankov.github.io/strap/?lang=en)  
* [По-русски](http://pfrankov.github.io/strap/)

You'll need just one row in SCSS file (compass imports is already included)
```scss
@import "strap/__init";
```

After that you can use basic functions and mixins
```scss
.oneLineFromTopAnd20pxFontSize {
	margin-bottom: line(1);
	@include font-size(20px);
}
```