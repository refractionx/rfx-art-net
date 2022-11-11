import rfxArtNetLoader from 'rfx-art-net-js';

let channelsIn;
let channelsOut = new Uint8Array(Array(512).fill(0));

const rfxArtNet = await rfxArtNetLoader(fetch("rfxArtNet.wasm"));

const ws = new WebSocket('ws://localhost:8080');
ws.binaryType = 'arraybuffer';
ws.addEventListener('message', async (msg) => {
    channelsIn = rfxArtNet.getChannels(msg.data);
    document.body.style.backgroundColor = `rgb(${channelsIn[0]}, ${channelsIn[1]}, ${channelsIn[2]})`;
});
ws.addEventListener('open', () => {
    setInterval(() => {
        ws.send(rfxArtNet.getPacket(channelsOut, 1));
    }, 100);
});

function onMIDIMessage(event) {
    if (event.data[1] == 19) {
        channelsOut[0] = event.data[2] * 2;
    }
    if (event.data[1] == 23) {
        channelsOut[1] = event.data[2] * 2;
    }
    if (event.data[1] == 27) {
        channelsOut[2] = event.data[2] * 2;
    }
    if (event.data[1] == 31) {
        channelsOut[3] = event.data[2] * 2;
    }
    if (event.data[1] == 49) {
        channelsOut[4] = event.data[2] * 2;
    }
    if (event.data[1] == 53) {
        channelsOut[5] = event.data[2] * 2;
    }
    if (event.data[1] == 57) {
        channelsOut[6] = event.data[2] * 2;
    }
    if (event.data[1] == 61) {
        channelsOut[7] = event.data[2] * 2;
    }
    if (event.data[1] == 62) {
        channelsOut[8] = event.data[2] * 2;
    }
}

const midiAccess = await navigator.requestMIDIAccess();
midiAccess.inputs.forEach(entry => { entry.onmidimessage = onMIDIMessage; });