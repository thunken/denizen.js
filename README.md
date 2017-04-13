Visitor.js allows you to gather user browser data client side, all in pure Vanilla JS.  
This library embeds an optional dependency on https://github.com/hgoebl/mobile-detect.js to handle mobile browsers information.

# Installation
## Get library
~~~
git clone https://github.com/thunken/visitor.js.git
~~~
## If you want to use mobile-detect.js
Just download the library and add it to your pages, Visitor.js checks if MobileDetect object exist and take care of the rest.

## Add library to your page
~~~
<script type="application/javascript" src="/path/to/libray/visitor.js"></script>
~~~

# Usage
~~~
Visitor(options);
~~~

## Without location
~~~
var visitor = new Visitor();
data = visitor.getData();
~~~

## With location and address
You can request the location either by calling the setLocation method or by setting the setLocation option with true.  
If you request the location, you will have to give a callback function to the afterLocationSet option.
~~~
var visitor = new Visitor({ afterLocationSet: function (data) {
    // Play with data
} });
visitor.setLocation();
~~~