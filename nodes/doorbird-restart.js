module.exports = function (RED) {
    const statusUtils = require('./utils/status');

    function DoorbirdRestartNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        node.on('input', function (_msg) {
            var doorbird = node.station.doorbird;

            this.status({
                fill: 'blue',
                shape: 'dot',
                text: `${statusUtils.statusDateString()}: ${RED._('doorbird-restart.runtime.status.requesting')}`
            });
            doorbird.restart().then(response => {
                this.status({
                    fill: 'green',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-restart.runtime.status.success')}`
                });
                node.send({
                    payload: response
                });
            }).catch(error => {
                this.status({
                    fill: 'red',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-restart.runtime.status.error')}`
                });
                node.error(RED._('doorbird-restart.runtime.error'), error);
            });

            RED.httpAdmin.post('/DoorbirdUltimate/:id/restart', RED.auth.needsPermission('DoorbirdUltimate.restart'), function (req, res) {
                var node = RED.nodes.getNode(req.params.id);
                try {
                    node.receive();
                    res.sendStatus(204);
                } catch (err) {
                    res.sendStatus(500);
                }
            });
        });
    }
    RED.nodes.registerType('doorbird-restart', DoorbirdRestartNode);
}
