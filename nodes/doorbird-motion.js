module.exports = function(RED) {
    "use strict";

    function DoorbirdMotionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var listenerId = `motion-${node.id}`;

        node.station = RED.nodes.getNode(config.station);

        node.station.registerMotionListener(listenerId, motionEvent => {
            node.send({
                payload: motionEvent
            });
        });

        node.on('close', function() {
            node.station.unregisterMotionListener(listenerId);
        });
    }
    RED.nodes.registerType('doorbird-motion', DoorbirdMotionNode);
}
