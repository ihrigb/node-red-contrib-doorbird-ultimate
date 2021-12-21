module.exports = function (RED) {

    var html = String.raw`
<style>
    #ui_live_view_image_{{ $id }} {
        height: 100%;
        width: 100%;
    }
</style>
<div id="ui_live_view_{{ $id }}">
    <img id="ui_live_view_image_{{ $id }}" src="%SOURCE%" orig_src="%SOURCE%">
    <input type="hidden" value="{{ msg.payload }}" />
</div>
`;

    var ui = undefined;

    function DoorbirdUiImageNode(config) {
        var node = this;
        if (ui === undefined) {
            ui = RED.require('node-red-dashboard')(RED);
        }
        RED.nodes.createNode(this, config);

        node.station = RED.nodes.getNode(config.station);

        var url = node.station.doorbird.getImageUrl();

        var done = ui.addWidget({
            node: node,
            format: html.replace(new RegExp('%SOURCE%', 'g'), url),
            templateScope: 'local',
            width: config.width || RED.nodes.getNode(config.group).config.width,
            height: config.height || RED.nodes.getNode(config.group).config.width,
            group: config.group,
            order: config.order,
            initController: $scope => $scope.$watch( 'msg.payload', payload => {
                var url = $( `#ui_live_view_image_${ $scope.$id }` ).attr('orig_src');
                $( `#ui_live_view_image_${ $scope.$id }` ).attr( 'src', url + '&cachekiller=' + new Date().getTime() );
            })
        });

        node.on('close', done);

        node.on('input', function (msg) {
            node.send(msg);
        });
    }
    RED.nodes.registerType('ui_doorbird-ui-image', DoorbirdUiImageNode);
}
