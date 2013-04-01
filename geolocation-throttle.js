(function(window) {
    window.GeolocationThrottle = {
        /**
         * Works just like navigator.geolocation.watchPosition, but adds one extra argument 
         * (throttleTime) to the options object, and makes sure that only one location callback 
         * is made per throttleTime timespan.
         *
         * Assumes that the browser supports navigator.geolocation, so one should still check for 
         * that. The single purpose of this lib is to throttle the location callbacks.
         */
        watchPosition: function(callback, errorCallback, options) {
            var throttleTime = (!options ? 1000 : options.throttleTime || 0);
            var bufferedArguments = null;
            var lastCall = null;
            var timeoutToken = null;
            
            return navigator.geolocation.watchPosition(function() {
                // update bufferedArguments
                bufferedArguments = arguments;
                
                if (!lastCall) {
                    //console.log("calling immediately initially");
                    lastCall = new Date();
                    callback.apply(this, arguments);
                } else if (!timeoutToken) {
                    // check if we've already passed the buffer time, in which case 
                    // we'll call the callback immediately
                    if (new Date()-lastCall > throttleTime) {
                        //console.log("calling immediately since time has already passed");
                        lastCall = new Date();
                        callback.apply(this, arguments);
                    } else {
                        // if not enough time has passed since the last callback, we'll schedule
                        // a callback in the future
                        var that = this;
                        //console.log("call scheduled");
                        timeoutToken = setTimeout(function() {
                            //console.log("Call");
                            lastCall = new Date();
                            callback.apply(that, bufferedArguments);
                            timeoutToken = null;
                        }, throttleTime - (new Date()-lastCall));
                    }
                } else {
                    //console.log("skipping call");
                }
            }, errorCallback, options);
        }
    };
})(window);
