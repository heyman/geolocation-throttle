GeolocationThrottle
===================

GeolocationThrottle is a small JavaScript lib for the single purpose of throttling the 
number of callbacks that one gets from the HTML5's 
`navigator.geolocation.watchPosition <http://dev.w3.org/geo/api/spec-source.html#watch-position>`_ 
function. 


Why?
----

I've found myself in the need for this feature in two different projects, and therefore I thought 
someone else might benefit from the code, and I decided to make a re-usable script of it.

In both projects where I've needed watchPosition throttling, I've been doing HTTP requests to some backend 
system, in the watchPosition's callback, and I've wanted to limit the number of backend requests for 
performance and/or API limit reasons.

One of the projects where it's used is `What is my zip <https://www.whatismyzip.com>`_ which is 
a small website for retrieving the ZIP code of your current location. Another for which I use 
GeolocationThrottle is `Longitude.me <https://longitude.me>`_, a service for sharing your current 
location. The third project where I use this lib is `Hotels Near Me <https://hotels-near.me>`_, 
which is a site for finding hotels near your current location.


How to use it?
--------------

The API is exactly the same as the navigator.geolocation.watchPosition, except that I've added 
an extra option *throttleTime* to the options object. 

Here's an example of how to watch the geo position, but throttle the position callback to at 
most once every 5 seconds::

    GeolocationThrottle.watchPosition(function(position) {
        console.log("position:", position);
    }, function() {
        console.log("Error! Could not get position");
    }, {throttleTime: 5000});


See example
-----------

`Here <http://heyman.github.com/geolocation-throttle/example.html>`_ is a super simple and ugly example page.
You should probably test it with a smartphone that has GPS.


Copyright & License
-------------------

This plugin is written by `Jonatan Heyman <http://heyman.info>`_ and is licenced as 
`Beerware <http://en.wikipedia.org/wiki/Beerware>`_.


