module.exports = function(RED) {

    var dgram = require('dgram');

    var servers = {};

    function startServer(port, host) {
        if (servers.hasOwnProperty(port)) {
            return;
        }

        var server = dgram.createSocket({type: 'udp4', reuseAddr: true});
        server.bind(port);

        var serverObj = {
            server: server,
            listeners: []
        };

        servers[port] = serverObj;

        server.on('message', function(msg, remote) {
            if (host === remote.address) {
                serverObj.listeners.forEach(listener => {
                    var copyBuffer = Buffer.alloc(msg.length);
                    msg.copy(copyBuffer);
                    listener(copyBuffer, remote);
                });
            }
        });

        server.on('listening', function() {
            // TODO logging
        });
    }

    function DoorbirdConfigNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.host = n.host;

        // TODO function to retain base uri
        // for compatibility with other nodes
        node.username = node.credentials.username;
        node.password = node.credentials.password;

        node.startServer = startServer;
        node.registerListener = (port, listener) => {
            console.log(`New listener on port ${port}`)
            startServer(port, node.host);
            servers[port].listeners.push(listener);
        };

        node.on("clone", function() {
            if (server !== undefined) {
                server.close();
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
