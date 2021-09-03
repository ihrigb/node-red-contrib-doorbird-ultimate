module.exports = function(RED) {
    "use strict";

    var argon2 = require('argon2');
    var chacha = require('chacha-js');

    function DoorbirdRingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        node.station.registerListener(config.port, (msg, remote) => {
            if (msg.length !== 70) {
                return;
            }
            if (msg.slice(0, 3).toString("base64") !== "3q2+") {
                return;
            }

            let salt = msg.slice(12, 28);
            let options = {
                memoryCost: 8192,
                timeCost: 4,
                raw: true,
                salt: salt
            };

            console.log("before hash");

            console.log(node.station.password.substring(0, 5));

            argon2.hash(node.station.password.substring(0, 5), options).then(hash => {
                try {
                    let nonce = msg.slice(28, 36);
                    let crypt = msg.slice(36, 70);

                    let decipher = chacha.AeadLegacy(hash, nonce, true);
                    let result = decipher.update(crypt);

                    console.log(result.toString("hex"));
                } catch(e) {
                    console.log(e);
                }
            });
        });
    }
    RED.nodes.registerType("doorbird-ring", DoorbirdRingNode);
}
