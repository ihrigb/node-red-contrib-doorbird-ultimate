module.exports = function(RED) {
    "use strict";

    function DoorbirdOpenNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);
        node.relay = config.relay;

        node.on('input', function(_msg) {

            var doorbird = node.station.doorbird;
            doorbird.openDoor(node.relay, (response) => {
                node.send({
                    payload: response
                });
            }, (err) => {
                node.error(RED._('doorbird-open.runtime.error'), err);
            });
        });
    }
    RED.nodes.registerType('doorbird-open', DoorbirdOpenNode);
}
