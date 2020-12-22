var CommonNet = (function () {
    function makeRequestFunction(method, useQueryString) {
        return function (url, params, resolve, reject, listener, mime) {
            var request = new XMLHttpRequest();
            request.addEventListener("load", function () {
                try {
                    if (request.status != 200) {
                        reject(new Error("Response = " + request.status));
                        return;
                    }

                    var json = request.responseText;
                    var object = null;
                    try {
                        if (json) object = JSON.parse(json);
                    } catch(err) {
                        console.error(err);
                    }
                    resolve(object);
                } finally {
                    if (listener) listener.done();
                }
            });
            var data = {};
            if (params) {
                if (useQueryString) {
                    var body = "";
                    for (var name in params) {
                        if (body && body.length) body += "&";
                        body += name + "=" + encodeURIComponent("" + params[name]);
                    }
                    url += url.indexOf("?") < 0 ? "?" : "&";
                    url += body;

                    data = null;
                    request.open(method, url);
                } else {
                    var data = JSON.stringify(params);
                    request.open(method, url);
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                }
            }
            if (mime) request.overrideMimeType(mime);
            // request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // console.log("## send request: ", method, url, data);
            request.send(data);
            if (listener) listener.busy();
        };
    }
    function initServices(services) {
        Object.getOwnPropertyNames(services).forEach(function(api_name) {
            Object.getOwnPropertyNames(services[api_name]).forEach(function(service) {
                if (!window["$" + api_name]) window["$" + api_name] = {};
                var api = window["$" + api_name];
                api[service] = function() {
                    var requiredParams = window._registry[api_name][service];
                    var method = requiredParams[0];
                    // method = method[0];
                    if (arguments.length != requiredParams.length + 1) {
                        console.error("service " + api_name + "." + service + " missing parameters: require "
                            + (requiredParams.length + 1)
                            + " but got " + arguments.length);
                        return;
                    }
                    var params = {};
                    for (var i = 0; i < requiredParams.length - 1; i++) {
                        params[requiredParams[i + 1]] = arguments[i];
                    }
                    // console.log("# call service:", service + method + " - ", requiredParams, params);
                    if (method.toUpperCase() == "POST") {
                        CommonNet.post("/" + api_name + "/" + service, params, arguments[requiredParams.length - 1], arguments[requiredParams.length]);
                    } else {
                        CommonNet.get("/" + api_name + "/" + service, params, arguments[requiredParams.length -1 ], arguments[requiredParams.length]);
                    }
                }
            });
        });
    }
    return {
        get: makeRequestFunction("GET", true),
        post: makeRequestFunction("POST", false),
        postWithQueryString: makeRequestFunction("POST", true),
        initServices: initServices
    }
})();
