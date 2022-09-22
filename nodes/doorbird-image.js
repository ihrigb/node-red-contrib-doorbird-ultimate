module.exports = function (RED) {
    const statusUtils = require('./utils/status');

    function DoorbirdImageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);
        node.on('input', function (_msg) {
            var doorbird = node.station.doorbird;
            this.status({
                fill: 'blue',
                shape: 'dot',
                text: `${statusUtils.statusDateString()}: ${RED._('doorbird-image.runtime.status.requesting')}`
            });
            var url = doorbird.getImageUrl();
            node.send({payload: url });
         
        });
    }
    RED.nodes.registerType('doorbird-image', DoorbirdImageNode);
}
