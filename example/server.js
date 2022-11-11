import udp from 'dgram';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { RFXArtNetPacket, RFXArtNetWSProxyServer, getWebSocketFrame } from 'rfx-art-net-node';
import config from './webpack.config.js';
const client = udp.createSocket('udp4');
const app = express();
const port = 8080;

process.on('uncaughtException', (e) => {
    console.log(e);
});


const compiler = webpack(config);

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    })
);

app.use(express.static('node_modules/rfx-art-net-js/build'));



const server = app.listen(port, () => {
    console.log(`RFX Art-Net example app listening on port ${port}`)
});

// http server or port
RFXArtNetWSProxyServer(server, (socket) => {
    const packetWS = new RFXArtNetPacket(3);
    let R = 0;
    setInterval(() => {
        packetWS.channels[0] = R;
        socket.write(getWebSocketFrame(packetWS));
        R++; R%=256;
    }, 10);

}, (packet) => {
    client.send(packet, 6454, 'localhost');
});