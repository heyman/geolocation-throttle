(function(window) {
    window.GeolocationThrottle = {
        // a mapping of watchId => timeoutId that can be used to clear position watching
        _timeoutIds: {},
        
        /**
         * Works just like navigator.geolocation.watchPosition, but adds one extra argument 
         * (throttleTime) to the options object, and makes sure that only one location callback 
         * is made per throttleTime timespan.
         *
         * Assumes that the browser supports navigator.geolocation, so one should still check for 
         * that. The single purpose of this lib is to throttle the location callbacks.
         */
        watchPosition: function(callback, errorCallback, options) {
            var throttleTime = (!options ? 0 : options.throttleTime || 0);
            var bufferedArguments = null;
            var lastCall = null;
            var timeoutId = null;
            var watchId = null;
            
            watchId = navigator.geolocation.watchPosition(function() {
                // update bufferedArguments
                bufferedArguments = arguments;
                
                if (!lastCall) {
                    //console.log("calling immediately initially");
                    lastCall = new Date();
                    callback.apply(this, arguments);
                } else if (!timeoutId) {
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
                        timeoutId = setTimeout(function() {
                            //console.log("Call");
                            lastCall = new Date();
                            callback.apply(that, bufferedArguments);
                            
                            timeoutId = null;
                            window.GeolocationThrottle._timeoutIds[watchId] = null;
                        }, throttleTime - (new Date()-lastCall));
                        
                        // we store the timeout id so that we can clear the timeout if clearWatch 
                        // is called before the setTimeout fires
                        window.GeolocationThrottle._timeoutIds[watchId] = timeoutId;
                    }
                } else {
                    // we already have a scheduled call
                    //console.log("skipping call");
                }
            }, errorCallback, options);
            return watchId;
        },
        
        /**
         * Calls navigator.geolocation.clearWatch for the given watchId, but also 
         * clears any timeout that has been set up by GeolocationThrottle to make 
         * sure that no more callback for this watchId is called.
         */
        clearWatch: function(watchId) {
            navigator.geolocation.clearWatch(watchId);
            
            // if there's a scheduled watch position callback we'll clear it
            var timeoutId = window.GeolocationThrottle._timeoutIds[watchId];
            if (timeoutId) {
                clearTimeout(timeoutId);
                window.GeolocationThrottle._timeoutIds[watchId] = null;
            }
        }
    };
})(window);
