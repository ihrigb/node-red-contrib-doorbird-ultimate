module.exports = function(RED) {
    "use strict";

    function DoorbirdRingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var listenerId = `ring-${node.id}`;

        node.station = RED.nodes.getNode(config.station);

        node.station.registerRingListener(listenerId, ringEvent => {
            node.send({
                payload: ringEvent
            });
        });

        node.on('close', function() {
            node.station.unregisterRingListener(listenerId);
        });
    }
    RED.nodes.registerType('doorbird-ring', DoorbirdRingNode);
}
