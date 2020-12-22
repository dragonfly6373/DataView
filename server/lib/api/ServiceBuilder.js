module.exports = (function() {
    var _services = {};
    function buildRouting(api_name, controller) {
        var params = [];
        var name = controller.name;
        var authentication = controller.authentication;
        var matching = controller.implementation.toString().match(/\(([\w]+[,\s*\w+]*)\)/);
        if (matching) {
            params = matching[1].split(",");
            params = params.slice(1, params.length - 1).map(x => x.trim());
        }
        if (!_services[api_name]) _services[api_name] = {};
        var api = _services[api_name];
        var service = api[name] = [];
        service.push(controller.method);
        for (var i in params) {
            service.push(params[i]);
        }
        // service = service.concat(params);
        console.log("### init API:", api_name, name, api[name]);
        return function(req, res, next) {
            console.log("@@@ request: ", req.body, req.query);
            var reqData = {...req.body, ...req.query};
            var values = [req];
            for (var i in params) {
                values.push(reqData[params[i]]);
            }
            values.push(function(result) {
                if (result && result.code && result.code != 200) res.status(code);
                res.json(result);
            });
            if (!authentication) {
                controller.implementation.apply(null, values);
                return;
            }
            if (typeof(authentication) === "function") {
                var result = authentication(req);
                if (!result) {
                    res.json({error: "You are un-authorize to access data. Login with other account and try again."});
                } else {
                    controller.implementation.apply(null, values);
                }
            } else if (typeof(authentication.then) === "function") {
                authentication(req, res).then(function(result) {
                        if (!result) res.json({error: "You are un-authorize to access data. Login with other account and try again."});
                        else controller.implementation.apply(null, values);
                    })
                    .catch(function(error) {
                        res.json({error: "You are un-authorize to access data. Login with other account and try again."});
                    });
            }
        };
    }
    function load(server, Router, modules) {
        if (!modules || !modules.length) return;
        modules.forEach(function(module) {
            var router = Router();
            server.use("/" + module.name, router);
            register(module.name, router, module.controllers);
        });
    }
    function register(api_name, router, controllers) {
        controllers.forEach(function(controller) {
            if (!controller || !controller.name || typeof(controller.implementation) !== "function") return;
            var routing = buildRouting(api_name, controller)
            console.log("#routing:", routing);
            if (controller.method.toUpperCase() == "POST") {
                router.post("/" + controller.name, routing);
            } else {
                router.get("/" + controller.name, routing);
            }
        });
    }
    return {
        load: load,
        register: register,
        getAPIs: function() {
            return _services;
        }
    }
})();