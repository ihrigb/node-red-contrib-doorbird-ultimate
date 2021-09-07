module.exports = function(RED) {
    function DoorbirdConfigNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.host = n.host;
        node.scheme = n.scheme;

        // TODO function to retain base uri
        // for compatibility with other nodes
        node.username = node.credentials.username;
        node.password = node.credentials.password;
    }
    RED.nodes.registerType('doorbird-config', DoorbirdConfigNode, {
        credentials: {
            username: {type:"text"},
            password: {type:"password"}
        }
    });
}
