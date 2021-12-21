module.exports = function(RED) {
    "use strict";

    function DoorbirdInfoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        node.on('input', function(msg) {
            var doorbird = node.station.doorbird;
            doorbird.getInfo((info) => {
                node.send({
                    payload: info
                });
            }, (error) => {
                node.error('Error in Doorbird communication.', error);
            });
        });
    }
    RED.nodes.registerType("doorbird-info", DoorbirdInfoNode);
};
