module.exports = function (RED) {
    const statusUtils = require('./utils/status');

    function DoorbirdInfoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        node.on('input', function (_msg) {
            var doorbird = node.station.doorbird;
            this.status({
                fill: 'blue',
                shape: 'dot',
                text: `${statusUtils.statusDateString()}: ${RED._('doorbird-info.runtime.status.requesting')}`
            });
            doorbird.getInfo((info) => {
                this.status({
                    fill: 'green',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-info.runtime.status.success')}`
                });
                node.send({
                    payload: info
                });
            }, (error) => {
                this.status({
                    fill: 'red',
                    shape: 'dot',
                    text: `${statusUtils.statusDateString()}: ${RED._('doorbird-info.runtime.status.error')}`
                });
                node.error(RED._('doorbird-info.runtime.error'), error);
            });
        });

        RED.httpAdmin.post('/DoorbirdUltimate/:id/info', RED.auth.needsPermission('DoorbirdUltimate.info'), function (req, res) {
            var node = RED.nodes.getNode(req.params.id);
            try {
                node.receive();
                res.sendStatus(204);
            } catch (err) {
                res.sendStatus(500);
            }
        });
    }
    RED.nodes.registerType('doorbird-info', DoorbirdInfoNode);
};
