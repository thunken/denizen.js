var Denizen;

(function() {

    Denizen = function(options) {

        if ((typeof options) === 'undefined') {
            options = {};
        }

        var objectRef = this;
        var defaults = {
            setLocation: false,
            unknownString: 'Not Supported',
            beforeLocationSet: function(data) {},
            afterLocationSet: function(data) {},
            beforeInitialized: function() {},
            afterInitialized: function() {}
        };

        this.settings = {};

        this.data = {};


        // "Public" methods --------------------------------------------------------------------------------------------
        /**
         * Getting the browser data
         *
         * @returns {Object}
         */
        this.getData = function() {
            if ((objectRef.data.location === null) && objectRef.settings.setLocation) {
                var message = 'You requested location but location is null. ';
                message = message + 'When asking for location, you have to implement the afterLocationSet callback ';
                message = message + 'to get all data when available.';
                throw new Error(message);
            }

            return objectRef.data;
        };

        /**
         * Set location
         *
         * @returns {Denizen}
         */
        this.setLocation = function () {
            // As this function is called, we enforce the setLocation setting to true
            objectRef.settings.setLocation = true;

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(setPosition, setPositionFailure);
            }

            return this;
        };



        // "Private" methods -------------------------------------------------------------------------------------------
        /**
         * Robust browser detection, source:
         * http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
         *
         * @returns {*}
         */
        var detectBrowser = function() {
            // Return cached result if available, else get result then cache it.
            if (detectBrowser.prototype._cachedResult) {
                return detectBrowser.prototype._cachedResult;
            }

            // Opera 8.0+
            var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

            // Firefox 1.0+
            var isFirefox = typeof InstallTrigger !== 'undefined';

            // Safari 3.0+ "[object HTMLElementConstructor]"
            var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

            // Internet Explorer 6-11
            var isIE = /*@cc_on!@*/false || !!document.documentMode;

            // Edge 20+
            var isEdge = !isIE && !!window.StyleMedia;

            // Chrome 1+
            var isChrome = !!window.chrome && !!window.chrome.webstore;

            // Blink engine detection
            var isBlink = (isChrome || isOpera) && !!window.CSS;

            return detectBrowser.prototype._cachedResult =
                isOpera ? 'Opera' :
                isFirefox ? 'Firefox' :
                isSafari ? 'Safari' :
                isChrome ? 'Chrome' :
                isIE ? 'Internet Explorer' :
                isEdge ? 'Edge' :
                isBlink ? 'Blink' :
                objectRef.settings.unknownString;
        };

        /**
         * Get browser main language
         *
         * @returns {*}
         */
        var getLanguage = function() {
            if ((typeof navigator.userLanguage) === 'string') {
                return(navigator.userLanguage);
            }
            if ((typeof navigator.language) === 'string') {
                return(navigator.language);
            }

            return(objectRef.settings.unknownString);
        };

        /**
         * Get browser language array
         *
         * @returns {*}
         */
        var getLanguages = function() {
            if ((typeof navigator.languages) === 'string') {
                return (navigator.language);
            }
            if (Array.isArray(navigator.languages)) {
                return navigator.languages.join(', ');
            }

            return(objectRef.settings.unknownString);
        };

        var setAddress = function (position) {
            // http://nominatim.openstreetmap.org/reverse?format=json&lat=54.9824031826&lon=9.2833114795&zoom=18&addressdetails=1

            var url = 'https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&addressdetails=1';
            url = url + '&lat=' + position.coords.latitude;
            url = url + '&lon=' + position.coords.longitude;
            var request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    // Success!
                    var data = JSON.parse(request.responseText);
                    objectRef.data.address = data.address;

                    // Triggering the afterLocationSet callback
                    objectRef.settings.afterLocationSet(objectRef.data);
                } else {
                    // Triggering the afterLocationSet callback
                    objectRef.settings.afterLocationSet(objectRef.data);
                }
            };

            request.onerror = function() {
                // Triggering the afterLocationSet callback
                objectRef.settings.afterLocationSet(objectRef.data);
            };

            request.send();
        };

        /**
         * Set the location geolocation data in self.data.location attribute
         *
         * @param position
         * @returns {Denizen}
         */
        var setPosition = function (position) {
            // Triggering the beforeLocationSet callback
            objectRef.settings.beforeLocationSet(objectRef.data);

            objectRef.data.location = position;

            setAddress(position);
        };

        /**
         * Set the location geolocation data in self.data.location attribute
         *
         * @param error
         * @returns {Denizen}
         */
        var setPositionFailure = function (error) {
            // Triggering the beforeLocationSet callback
            objectRef.settings.beforeLocationSet(objectRef.data);

            objectRef.data.location = error.message;

            // Triggering the afterLocationSet callback
            objectRef.settings.afterLocationSet(objectRef.data);
        };

        /**
         * Set the browser data in self.data attribute
         *
         * @returns {Denizen}
         */
        var setData = function () {
            objectRef.data = {
                location: null,
                address: null,
                browser: {
                    name: detectBrowser(),
                    vendor: navigator.vendor,
                    codeName: navigator.appCodeName,
                    product: navigator.product,
                    appName: navigator.appName,
                    version: navigator.appVersion,
                    userAgent: navigator.userAgent,
                    language: getLanguage(),
                    languages: getLanguages(),
                    // Browser options
                    options: {
                        cookiesEnabled: navigator.cookieEnabled
                    },
                    plugins: navigator.plugins
                },
                platform: {
                    operatingSystem: navigator.platform,
                    cores: navigator.hardwareConcurrency,
                    device: {
                        maxTouchPoints: navigator.maxTouchPoints,
                        isMobile: null,
                        isPhone: null,
                        isTablet: null
                    },
                    screen: {
                        height: window.screen.height,
                        width: window.screen.width,
                        availableHeight: window.screen.availHeight,
                        availableWidth: window.screen.availWidth
                    }
                }
            };

            if ((typeof MobileDetect) !== 'undefined') {
                // Getting mobile detection information
                var md = new MobileDetect(window.navigator.userAgent);
                objectRef.data.platform.device.isMobile = md.mobile();
                objectRef.data.platform.device.isPhone = md.phone();
                objectRef.data.platform.device.isTablet = md.tablet();
            }
        };

        /**
         * Initializing self
         */
        var initialize = function(options) {
            // Merging defaults and options
            objectRef.settings = Object.assign(defaults, options);

            // Triggering the beforeInitialized callback
            objectRef.settings.beforeInitialized();

            setData();
            // Forcing setLocation method if
            if (objectRef.settings.setLocation) {
                objectRef.setLocation();
            }

            // Triggering the afterInitialized callback
            objectRef.settings.afterInitialized();
        };

        // Denizen auto-initialize itself, no need to call it
        initialize(options);

    };

})( jQuery );