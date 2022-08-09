module.exports = function(RED) {
    "use strict";

    function DoorbirdRingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        node.station.registerRingListener((ringEvent) => {
            node.send({
                payload: ringEvent
            });
        });
    }
    RED.nodes.registerType('doorbird-ring', DoorbirdRingNode);
}
