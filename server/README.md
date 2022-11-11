### Install

```
npm i --save @refractionx/rfx-art-net-node
```

### Import
```javascript
import { RFXArtNetPacket, RFXArtNetWSProxyServer, getWebSocketFrame } from '@refractionx/rfx-art-net-node';
```

### Setup optional WS/Art-Net (UDP) Proxy
```javascript
...
import udp from 'dgram';
// example client used to proxy Art-Net packets
const client = udp.createSocket('udp4');
...
RFXArtNetWSProxyServer(serverOrPort, function onClient(socket) {
    // write example
    // create an RFXArtNetPacket with 3 channels and send over the WebSocket
    const packetWS = new RFXArtNetPacket(3);
    socket.write(getWebSocketFrame(packetWS));
}, function onPacket(packet) {
    // read and proxy Art-Net packet over UDP example
    client.send(packet, 6454, 'localhost');
});
...
```

### Use
```javascript
const packet = new RFXArtNetPacket(512);

// inspect packet
console.log(packet.hex());

// inspect data channels
console.log(packet.channels);

packet.setUniverse(1);
packet.setSequence(0);

// inspect Art-Net buffer
console.log(packet.buffer);
...

// get a WebSocket frame to send directly
socket.write(getWebSocketFrame(packet));

// or send over UDP as a normal Art-Net packet
client.send(packet, 6454, '...host..or..ip');
```
