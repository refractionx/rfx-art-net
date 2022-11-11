/*
 *   Copyright (c) 2009 - 2022 Samuil Aleksov
 */

import http from 'http';
import crypto from 'crypto';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const rfxArtNetNative = require('./build/Release/rfxArtNet');

export default rfxArtNetNative;

export function getWebSocketFrame(rfxArtNetPacket) {
    return Buffer.concat([Buffer.from([0x82, rfxArtNetPacket.buffer.length]), new Uint8Array(rfxArtNetPacket.buffer)])
};

export function RFXArtNetPacket(size) {
    return rfxArtNetNative.init(size);
};

export function RFXArtNetWSProxyServer(portOrServer, onClient, onPacket) {
    const server = typeof portOrServer === 'number' ? http.createServer() : portOrServer;
    server.on('upgrade', function(req, socket, head) {
        const key = req.headers['sec-websocket-key']+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        const sha1 = crypto.createHash('sha1');
        sha1.update(key);
        socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${sha1.digest('base64')}\r\n\r\n`);
        
        socket.on('data', (d) => {
            const length1 = d[1] & 0x7F;
            var value = 0;
            value = (value << 8) | d[2];
            value = (value << 8) | d[3];
            // when len == 126
            const mask = Buffer.from([d[4], d[5], d[6], d[7]]);
            const unmasked = [];
            for (let i = 8; i < 8 + value; i++) {
                unmasked.push(d[i] ^ mask[i%4]);
            }
            onPacket(new Uint8Array(unmasked));
            // when len < threshold len < 126
            // console.log('MASK KEY ', Buffer.from([d[2], d[3], d[4], d[5]]));
            // console.log('PAYLOAD MASKED ', Buffer.from([d[6], d[7], d[8], d[9], d[10], d[11]]));
            // console.log('PAYLOAD UNMASKED ', Buffer.from([d[6] ^ d[2], d[7] ^ d[3], d[8] ^ d[4], d[9] ^ d[5], d[10] ^ d[2], d[11] ^ d[3]]));
            // console.log('NULL ', Buffer.from([d[12], d[13]]));
    
        });
        onClient(socket);
    });
    
    if (typeof portOrServer === 'number') {
        server.listen(8081);
    }
    return server;
};