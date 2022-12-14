import udp from 'dgram';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { RFXArtNetPacket, RFXArtNetWSProxyServer, getWebSocketFrame } from '@refractionx/rfx-art-net-node';
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

app.use(express.static('node_modules/@refractionx/rfx-art-net-js/build'));

const server = app.listen(port, () => {
    console.log(`RFX Art-Net example app listening on port ${port}`)
});

// http server or port
RFXArtNetWSProxyServer(server, (socket) => {
    const packetWS = new RFXArtNetPacket(3);
    let R = 0;
    let G = 0;
    let B = 0;
    setInterval(() => {
        packetWS.channels[0] = R;
        packetWS.channels[1] = G;
        packetWS.channels[2] = B;
        socket.write(getWebSocketFrame(packetWS));
        R += Math.floor(Math.random() * 7) - 3;
        R =  Math.abs(R);
        R %= 256;

        G += Math.floor(Math.random() * 7) - 3;
        G =  Math.abs(G);
        G %= 256;


        B += Math.floor(Math.random() * 7) - 3;
        B =  Math.abs(B);
        B %= 256;
    }, 10);

}, (packet) => {
    client.send(packet, 6454, 'localhost');
});