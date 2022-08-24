module.exports = function (RED) {
    const statusUtils = require('./utils/status');

    function DoorbirdOpenNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);
        node.relay = config.relay;

        node.on('input', function (_msg) {
            var doorbird = node.station.doorbird;

            this.status({
                fill: 'blue',
                shape: 'dot',
                text: `${statusUtils.statusDateString()}: ${RED._('doorbird-open.runtime.status.requesting')}`
            });
            doorbird.openDoor(node.relay, (response) => {
                this.status({
                    fill: 'green',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-open.runtime.status.success')}`
                });
                node.send({
                    payload: response
                });
            }, (err) => {
                this.status({
                    fill: 'red',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-open.runtime.status.error')}`
                });
                node.error(RED._('doorbird-open.runtime.error'), err);
            });
        });
    }
    RED.nodes.registerType('doorbird-open', DoorbirdOpenNode);
}
