#### Checkout [Example app](https://github.com/refractionx/rfx-art-net/tree/main/example)

### Install

```
npm i --save @refractionx/rfx-art-net-js
```

### Import
```javascript
import rfxArtNetLoader from '@refractionx/rfx-art-net-js';
```

### Load
```javascript
// a compiled WASM module is shipped in build directory of this package
const rfxArtNet = await rfxArtNetLoader(fetch('rfxArtNet.wasm'));
...
```

### Use
```javascript
let channelsIn;
let channelsOut = new Uint8Array(Array(512).fill(0));
...

// read channels from an Art-Net packet in a WebSocket frame 
channelsIn = rfxArtNet.getChannels(wsMessage.data);

...

// write channels to an Art-Net packet, universe 1, send in a WebSocket frame
ws.send(rfxArtNet.getPacket(channelsOut, 1));
```
