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
            const unmasked = [];
            const length1 = d[1] & 0x7F;
            if (length1 < 126) {
                const mask = Buffer.from([d[2], d[3], d[4], d[5]]);
                for (let i = 6; i < 6 + length1; i++) {
                    unmasked.push(d[i] ^ mask[(i-2)%4]);
                }
            }  else {
                var value = 0;
                value = (value << 8) | d[2];
                value = (value << 8) | d[3];
                const mask = Buffer.from([d[4], d[5], d[6], d[7]]);
                for (let i = 8; i < 8 + value; i++) {
                    unmasked.push(d[i] ^ mask[i%4]);
                }
            }
            onPacket(new Uint8Array(unmasked));
    
        });
        onClient(socket);
    });
    
    if (typeof portOrServer === 'number') {
        server.listen(8081);
    }
    return server;
};