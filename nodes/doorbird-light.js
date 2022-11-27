module.exports = function (RED) {
    const statusUtils = require('./utils/status');

    function DoorbirdLightNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        node.on('input', function (_msg) {
            var doorbird = node.station.doorbird;

            this.status({
                fill: 'blue',
                shape: 'dot',
                text: `${statusUtils.statusDateString()}: ${RED._('doorbird-light.runtime.status.requesting')}`
            });
            doorbird.lightOn().then(response => {
                this.status({
                    fill: 'green',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-light.runtime.status.success')}`
                });
                node.send({
                    payload: response
                });
            }).catch(error => {
                this.status({
                    fill: 'red',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-light.runtime.status.error')}`
                });
                node.error(RED._('doorbird-light.runtime.error'), error);
            });
        });
    }
    RED.nodes.registerType('doorbird-light', DoorbirdLightNode);
}
