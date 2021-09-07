module.exports = function(RED) {
    "use strict";
    var request = require("request");

    function authHeader(username, password) {
        var auth = Buffer.from(username + ':' + password).toString('base64');
        return 'Basic ' + auth;
    }

    function DoorbirdOpenNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);
        node.relay = config.relay;

        node.on('input', function(msg) {

            var req = {
                url: 'http://' + node.station.host + '/bha-api/open-door.cgi?r=' + node.relay,
                method: 'GET',
                headers: {
                    Authorization: authHeader(node.station.username, node.station.password)
                }
            };

            request(req, function(error, result, data) {
                if (error) {
                    node.error(error, msg);
                    return;
                }
                if (result.statusCode === 401) {
                    node.error('Request to Doorbird Station is unauthorized.', msg);
                    return;
                }
                var jsun;
                console.log(result);
                console.log(data);
                try {
                    jsun = JSON.parse(data);
                } catch (e) {
                    node.error('Doorbird Station returned invalid JSON.', msg);
                    return;
                }
                node.send({
                    payload: jsun
                });
            });
        });
    }
    RED.nodes.registerType("doorbird-open", DoorbirdOpenNode);
}
