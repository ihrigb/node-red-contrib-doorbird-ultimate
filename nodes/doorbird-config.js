module.exports = function(RED) {

    var doorbird = require('doorbird');

    function DoorbirdConfigNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        var host = n.host;
        var scheme = n.scheme;
        var username = node.credentials.username;
        var password = node.credentials.password;
        var port = node.credentials.port;

        node.doorbird = new doorbird.default({
            scheme: scheme,
            host: host,
            username: username,
            password: password
        });
        node.doorbirdServer = node.doorbird.startUdpSocket(port);

        node.registerRingListener = (listener) => {
            node.doorbirdServer.registerRingListener(listener);
        };
        node.registerMotionListener = (listener) => {
            node.doorbirdServer.registerMotionListener(listener);
        }

        node.on("close", function() {
            if (node.doorbirdServer !== undefined) {
                node.doorbirdServer.close();
            }
        });

        RED.httpAdmin.get("/DoorbirdUltimate/:id/info", RED.auth.needsPermission("DoorbirdUltimate.info"), function(req, res) {
            var node = RED.nodes.getNode(req.params.id);
            try {
                node.doorbird.getInfo(info => {
                    res.json(info);
                });
            } catch (err) {
                res.sendStatus(500);
            }
        });
    }
    RED.nodes.registerType('doorbird-config', DoorbirdConfigNode, {
        credentials: {
            username: {type:"text"},
            password: {type:"password"}
        }
    });
}
