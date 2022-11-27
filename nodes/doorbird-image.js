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
            doorbird.getImage().then(image => {
                this.status({
                    fill: 'green',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-image.runtime.status.success')}`
                });
                node.send({
                    payload: image
                });
            }).catch(error => {
                this.status({
                    fill: 'red',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-image.runtime.status.error')}`
                });
                node.error(RED._('doorbird-image.runtime.error'), error);
            });
        });

        RED.httpAdmin.post('/DoorbirdUltimate/:id/image', RED.auth.needsPermission('DoorbirdUltimate.image'), function (req, res) {
            var node = RED.nodes.getNode(req.params.id);
            try {
                node.receive();
                res.sendStatus(204);
            } catch (err) {
                res.sendStatus(500);
            }
        });
    }
    RED.nodes.registerType('doorbird-image', DoorbirdImageNode);
};
