module.exports = function(RED) {
    "use strict";

    function DoorbirdMotionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        node.station.registerMotionListener((motionEvent) => {
            node.send({
                payload: motionEvent
            });
        });
    }
    RED.nodes.registerType("doorbird-motion", DoorbirdMotionNode);
}
