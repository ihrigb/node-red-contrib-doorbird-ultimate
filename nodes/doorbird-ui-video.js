module.exports = function (RED) {

    var html = String.raw`
<style>
    #ui_live_view_video_{{ $id }} {
        height: 100%;
        width: 100%;
    }
</style>
<div id="ui_live_view_{{ $id }}">
    <img id="ui_live_view_video_{{ $id }}" src="%SOURCE%">
</div>
`;

    var ui = undefined;

    function DoorbirdUiVideoNode(config) {
        var node = this;
        if (ui === undefined) {
            ui = RED.require('node-red-dashboard')(RED);
        }
        RED.nodes.createNode(this, config);

        node.station = RED.nodes.getNode(config.station);

        var url = node.station.doorbird.getVideoUrl();

        var done = ui.addWidget({
            node: node,
            format: html.replace(new RegExp('%SOURCE%', 'g'), url),
            templateScope: 'local',
            width: config.width || RED.nodes.getNode(config.group).config.width,
            height: config.height || RED.nodes.getNode(config.group).config.width,
            group: config.group,
            order: config.order
        });

        node.on('close', done);

        node.on('input', function (msg) {
            node.send(msg);
        });
    }
    RED.nodes.registerType('ui_doorbird-ui-video', DoorbirdUiVideoNode);
}
