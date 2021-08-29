module.exports = function(RED) {
    function DoorbirdConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.host = n.host;
        this.username = n.credentials.username;
        this.password = n.credentials.password;
    }
    RED.nodes.registerType('doorbird-config', DoorbirdConfigNode);
}
