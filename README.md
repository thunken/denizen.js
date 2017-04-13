Denizen.js allows you to gather user browser data client side, all in pure Vanilla JS.  
This library embeds an optional dependency on https://github.com/hgoebl/mobile-detect.js to handle mobile browsers information.

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
~~~
Denizen(options);
~~~

## Without location
~~~
var denizen = new Denizen();
data = denizen.getData();
~~~

## With location and address
You can request the location either by calling the setLocation method or by setting the setLocation option with true.  
If you request the location, you will have to give a callback function to the afterLocationSet option.
~~~
var denizen = new Denizen({ afterLocationSet: function (data) {
    // Play with data
} });
denizen.setLocation();
~~~