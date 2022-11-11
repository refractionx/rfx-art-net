import rfxArtNetLoader from '@refractionx/rfx-art-net-js';

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
        channelsOut[11] = event.data[2] * 2;
        channelsOut[22] = event.data[2] * 2;
        channelsOut[33] = event.data[2] * 2;
        channelsOut[44] = event.data[2] * 2;
        channelsOut[55] = event.data[2] * 2;
        channelsOut[66] = event.data[2] * 2;
        channelsOut[77] = event.data[2] * 2;
    }
    if (event.data[1] == 23) {
        channelsOut[1] = event.data[2] * 2;
        channelsOut[12] = event.data[2] * 2;
        channelsOut[23] = event.data[2] * 2;
        channelsOut[34] = event.data[2] * 2;
        channelsOut[45] = event.data[2] * 2;
        channelsOut[56] = event.data[2] * 2;
        channelsOut[67] = event.data[2] * 2;
        channelsOut[78] = event.data[2] * 2;
    }
    if (event.data[1] == 27) {
        channelsOut[2] = event.data[2] * 2;
        channelsOut[13] = event.data[2] * 2;
        channelsOut[24] = event.data[2] * 2;
        channelsOut[35] = event.data[2] * 2;
        channelsOut[46] = event.data[2] * 2;
        channelsOut[57] = event.data[2] * 2;
        channelsOut[68] = event.data[2] * 2;
        channelsOut[79] = event.data[2] * 2;
    }
    if (event.data[1] == 31) {
        channelsOut[3] = event.data[2] * 2;
        channelsOut[14] = event.data[2] * 2;
        channelsOut[25] = event.data[2] * 2;
        channelsOut[36] = event.data[2] * 2;
        channelsOut[47] = event.data[2] * 2;
        channelsOut[58] = event.data[2] * 2;
        channelsOut[69] = event.data[2] * 2;
        channelsOut[80] = event.data[2] * 2;
    }
    if (event.data[1] == 49) {
        channelsOut[4] = event.data[2] * 2;
        channelsOut[15] = event.data[2] * 2;
        channelsOut[26] = event.data[2] * 2;
        channelsOut[37] = event.data[2] * 2;
        channelsOut[48] = event.data[2] * 2;
        channelsOut[59] = event.data[2] * 2;
        channelsOut[70] = event.data[2] * 2;
        channelsOut[81] = event.data[2] * 2;
    }
    if (event.data[1] == 53) {
        channelsOut[5] = event.data[2] * 2;
        channelsOut[16] = event.data[2] * 2;
        channelsOut[27] = event.data[2] * 2;
        channelsOut[38] = event.data[2] * 2;
        channelsOut[49] = event.data[2] * 2;
        channelsOut[60] = event.data[2] * 2;
        channelsOut[71] = event.data[2] * 2;
        channelsOut[82] = event.data[2] * 2;
    }
    if (event.data[1] == 57) {
        channelsOut[6] = event.data[2] * 2;
        channelsOut[17] = event.data[2] * 2;
        channelsOut[28] = event.data[2] * 2;
        channelsOut[39] = event.data[2] * 2;
        channelsOut[50] = event.data[2] * 2;
        channelsOut[61] = event.data[2] * 2;
        channelsOut[72] = event.data[2] * 2;
        channelsOut[83] = event.data[2] * 2;
    }
    if (event.data[1] == 61) {
        channelsOut[7] = event.data[2] * 2;
        channelsOut[18] = event.data[2] * 2;
        channelsOut[29] = event.data[2] * 2;
        channelsOut[40] = event.data[2] * 2;
        channelsOut[51] = event.data[2] * 2;
        channelsOut[62] = event.data[2] * 2;
        channelsOut[73] = event.data[2] * 2;
        channelsOut[84] = event.data[2] * 2;
    }
    if (event.data[1] == 62) {
        channelsOut[8] = event.data[2] * 2;
        channelsOut[19] = event.data[2] * 2;
        channelsOut[30] = event.data[2] * 2;
        channelsOut[41] = event.data[2] * 2;
        channelsOut[52] = event.data[2] * 2;
        channelsOut[63] = event.data[2] * 2;
        channelsOut[74] = event.data[2] * 2;
        channelsOut[85] = event.data[2] * 2;
    }
}

const midiAccess = await navigator.requestMIDIAccess();
midiAccess.inputs.forEach(entry => { entry.onmidimessage = onMIDIMessage; });