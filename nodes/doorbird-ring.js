module.exports = function(RED) {
    "use strict";

    var _sodium = require('libsodium-wrappers');
    var chacha = require('chacha-js');

    function DoorbirdRingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.station = RED.nodes.getNode(config.station);

        var username = node.station.username;
        var password = node.station.password;

        node.station.registerListener(config.port, (msg, remote) => {
            if (msg.length !== 70) {
                return;
            }
            if (msg.slice(0, 3).toString("base64") !== "3q2+") {
                return;
            }

            var version = msg.slice(3, 4);
            var opslimit = msg.slice(4, 8).readInt32BE();
            var memlimit = msg.slice(8, 12).readInt32BE();
            var salt = msg.slice(12, 28);
            var nonce = msg.slice(28, 36);
            var ciphertext = msg.slice(36, 70);

            var keylength = 32;

            async function strech() {
                await _sodium.ready;
                const sodium = _sodium;
                const streched = Buffer.from(sodium.crypto_pwhash(keylength, password.substring(0, 5), salt, opslimit, memlimit, sodium.crypto_pwhash_ALG_ARGON2I13));
                return streched;
            }

            strech().then(streched => {
                try {
                    var decipher = chacha.AeadLegacy(streched, nonce, true);
                    var result = decipher.update(ciphertext);

                    var intercomId = result.slice(0, 6);
                    var event = result.slice(6, 14);
                    var timestamp = result.slice(14, 18);
                    var d = new Date(0);
                    d.setUTCSeconds(timestamp.readInt32BE());

                    if (username.substring(0, 5) !== intercomId.toString('utf-8')) {
                        return;
                    }

                    node.send({
                        payload: {
                            station: intercomId.toString('utf-8'),
                            event: event.toString('utf-8'),
                            timestamp: d
                        }
                    });
                } catch(e) {
                    console.log(e);
                }
            });
        });
    }
    RED.nodes.registerType("doorbird-ring", DoorbirdRingNode);
}
