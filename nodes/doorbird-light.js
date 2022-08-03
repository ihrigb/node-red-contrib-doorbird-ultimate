module.exports = function(RED) {
    "use strict";

    function DoorbirdLightNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        node.on('input', function(msg) {

            var doorbird = node.station.doorbird;
            doorbird.lightOn((response) => {
                node.send({
                    payload: response
                });
            }, (err) => {
                node.error('Problem in Doorbird communication.', err);
            });
        });
    }
    RED.nodes.registerType("doorbird-light", DoorbirdLightNode);
}
