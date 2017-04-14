Denizen.js allows you to gather user browser data client side, all in pure and lightweight JS.  
This library only has an optional dependency on https://github.com/hgoebl/mobile-detect.js to handle mobile browsers information.

# Installation
## Get library
~~~
git clone https://github.com/thunken/denizen.js.git
~~~
## If you want to use mobile-detect.js
Just download the library and add it to your pages, Denizen.js checks if MobileDetect object exist and take care of the rest.

## Add library to your page
~~~
<script type="application/javascript" src="/path/to/libray/denizen.js"></script>
~~~

# Usage
```javascript
Denizen(options);
```

## Without location
```javascript
var denizen = new Denizen();
data = denizen.getData();
```

## With location and address
You can request the location either by calling the setLocation method or by setting the setLocation option with true.  
Since browser location gathering is asynchronous, if you request the location, you will have to give a callback function to the afterLocationSet option.
```javascript
var denizen = new Denizen({ afterLocationSet: function (data) {
    // Play with data
} });
denizen.setLocation();
```

## Options
|option|description  |default|
|------|-------------|:-----:|
|setLocation|Get the browser location on initialize. When true you need to initialize afterLocationSet|false|
|unknownString|Placeholder for values the lib could not retrieve|'Not Supported'|
|beforeLocationSet|Function executed before getting browser location|``` function() {} ```|
|afterLocationSet|Function executed after getting browser location. Use this callback to get data when you want to get the location|``` function() {}```|
|beforeInitialized|Function executed before library is initialized|``` function() {}```|
|afterInitialized|Function executed right after the library is initialized|``` function() {}```|

## Functions
|function|description  |
|--------|-------------|
|getData |Use this function to get data when you don't request for the location|
|setLocation|Use this function to set the location in the data object. You need to define afterLocationSet to get the data back when location is set|

