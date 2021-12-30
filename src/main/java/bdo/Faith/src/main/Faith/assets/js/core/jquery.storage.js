/*!
 * jquery.storage.js 0.0.3 - https://github.com/yckart/jquery.storage.js
 * The client-side storage for every browser, on any device.
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/10
 **/
;(function($, window, document) {
    'use strict';

    $.map(['localStorage', 'sessionStorage'], function( method ) {
        var methodCache = method + 'Cache';
        
        var defaults = {
            cookiePrefix : 'fallback:' + method + ':',
            cookieOptions : {
                path : '/',
                domain : document.domain,
                expires : ('localStorage' === method) ? { expires: 365 } : undefined
            }
        };

        var cacheDefaults = {
            cookiePrefix : 'fallback:' + methodCache + ':',
            cookieOptions : {
                path : '/',
                domain : document.domain,
                expires : ('localStorage' === methodCache) ? { expires: 365 } : undefined
            }
        };
        
        try {
            $.support[method] = method in window && window[method] !== null;
        } catch (e) {
            $.support[method] = false;
        }

        try {
            $.support[methodCache] = methodCache in window && window[methodCache] !== null;
        } catch (e) {
            $.support[methodCache] = false;
        }
        try {
            if (window.opener && window.opener[methodCache]) {
                window[methodCache] = window.opener[methodCache];
            }
        }catch (e) {
            
        }

        $[methodCache] = function(key, value) {
            var options = $.extend({}, cacheDefaults, $[methodCache].options);

            this.getItem = function( key ) {
                var returns = function(key){
                    if(window[methodCache]) {
                        return window[methodCache][key];
                    }
                    return null;
                };
                if(typeof key === 'string') return returns(key);

                var arr = [],
                    i = key.length;
                while(i--) arr[i] = returns(key[i]);
                return arr;
            };

            this.setItem = function( key, value ) {
                if(!window[methodCache]) {
                    window[methodCache] = new Map();
                }
                value = JSON.stringify(value);
                window[methodCache].set(key, value);
            };

            this.removeItem = function( key ) {
                if(window[methodCache]) {
                    window[methodCache].delete(key);
                }
            };

            this.clear = function() {
                if(window[methodCache]) {
                    window[methodCache].clear();
                }
            };

            if (typeof key !== "undefined") {
                return typeof value !== "undefined" ? ( value === null ? this.removeItem(key) : this.setItem(key, value) ) : this.getItem(key);
            }
            return this;
        };

        $[methodCache].options = cacheDefaults;

        $[method] = function(key, value) {
            var options = $.extend({}, defaults, $[method].options);

            this.getItem = function( key ) {
                var returns = function(key){
                    var textCache = $[methodCache]().getItem(key);
                    if(!textCache) {
                        textCache = $.support[method] ? window[method].getItem(key) : $.cookie(options.cookiePrefix + key);
                    }
                    return JSON.parse(textCache);
                };
                if(typeof key === 'string') return returns(key);

                var arr = [],
                    i = key.length;
                while(i--) arr[i] = returns(key[i]);
                return arr;
            };

            this.setItem = function( key, value ) {
                value = JSON.stringify(value);
                var res = undefined;
                try {
                    res = ($.support[method] ? window[method].setItem(key, value) : $.cookie(options.cookiePrefix + key, value, options.cookieOptions));
                    $[methodCache]().removeItem(key);
                }catch (e) {
                    res = $[methodCache]().setItem(key, value);
                }
                return res;
            };

            this.removeItem = function( key ) {
                $[methodCache]().removeItem(key);
                return $.support[method] ? window[method].removeItem(key) : $.cookie(options.cookiePrefix + key, null, $.extend(options.cookieOptions, {
                    expires: -1
                }));
            };

            this.clear = function() {
                $[methodCache]().clear();
                if($.support[method]) {
                    return window[method].clear();
                } else {
                    var reg = new RegExp('^' + options.cookiePrefix, ''),
                        opts = $.extend(options.cookieOptions, {
                            expires: -1
                        });

                    if(document.cookie && document.cookie !== ''){
                        $.map(document.cookie.split(';'), function( cookie ){
                            if(reg.test(cookie = $.trim(cookie))) {
                                 $.cookie( cookie.substr(0,cookie.indexOf('=')), null, opts);
                            }
                        });
                    }
                }
            };

            if (typeof key !== "undefined") {
                return typeof value !== "undefined" ? ( value === null ? this.removeItem(key) : this.setItem(key, value) ) : this.getItem(key);
            }

            return this;
        };

        $[method].options = defaults;
    });
}(jQuery, window, document));