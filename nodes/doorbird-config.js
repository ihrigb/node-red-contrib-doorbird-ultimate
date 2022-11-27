module.exports = function(RED) {

    var doorbird = require('doorbird');

    function DoorbirdConfigNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        var host = n.host;
        var scheme = n.scheme;
        var port = n.port;
        var suppressBurst = n.suppressBurst;
        var username = node.credentials.username;
        var password = node.credentials.password;

        node.doorbird = new doorbird.default({
            scheme: scheme,
            host: host,
            username: username,
            password: password,
            suppressBurst: suppressBurst
        });

        var ringListeners = {};
        var motionListeners = {};

        var doorbirdServer = node.doorbird.startUdpSocket(port, suppressBurst);
        doorbirdServer.registerRingListener(ringEvent => {
            Object.values(ringListeners).forEach(listener => {
                listener(ringEvent);
            });
        });
        doorbirdServer.registerMotionListener(motionEvent => {
            Object.values(motionListeners).forEach(listener => {
                listener(motionEvent);
            });
        });

        node.log(`Started Doorbird UDP socket on port ${port} with burst suppression ${suppressBurst ? 'enabled' : 'disabled'}.`);

        node.registerRingListener = (name, listener) => {
            ringListeners[name] = listener;
            node.debug(`Registered ring listener ${name}`);
        };
        node.unregisterRingListener = name => {
            ringListeners.delete(name);
            node.debug(`Unregistered ring listener ${name}`);
        }
        node.registerMotionListener = (name, listener) => {
            motionListeners[name] = listener;
            node.debug(`Registered motion listener ${name}`);
        }
        node.unregisterMotionListener = name => {
            motionListeners.delete(name);
            node.debug(`Unegistered motion listener ${name}`);
        }

        node.on('close', function() {
            doorbirdServer.close();
            node.log('Stopped Doordbird UDP socket.');
        });

        RED.httpAdmin.get('/DoorbirdUltimate/:id/info', RED.auth.needsPermission('DoorbirdUltimate.info'), function(req, res) {
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
            username: {type: 'text'},
            password: {type: 'password'}
        }
    });
}
