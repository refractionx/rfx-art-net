/*
 *   Copyright (c) 2009 - 2022 Samuil Aleksov
 */

export default async function rfxArtNetLoader(loader) {
    const rfxArtNetNative = await WebAssembly.instantiateStreaming(loader, {
        rfx: {
            logCS: (offset) => {
                const messageArray = new Uint8Array(rfxArtNetNative.instance.exports.memory.buffer, offset);
                let messageLength = 0;
                while (messageArray[messageLength] != 0) messageLength++;
                console.log(new TextDecoder("utf-8").decode(messageArray.slice(0, messageLength)));
            }
        },
    });

    return { 
        native: rfxArtNetNative,
        getChannels: function getChannels(packet) {
            new Uint8Array(rfxArtNetNative.instance.exports.memory.buffer).set(new Uint8Array(packet));
            return new Uint8Array(packet, rfxArtNetNative.instance.exports.getChannelsStart(), rfxArtNetNative.instance.exports.getChannelsLength(0));
        },
        getPacket: function getPacket(channels, universe) {
            rfxArtNetNative.instance.exports.init(0, channels.length);
            rfxArtNetNative.instance.exports.setUniverse(0, universe);
            new Uint8Array(rfxArtNetNative.instance.exports.memory.buffer, rfxArtNetNative.instance.exports.getChannelsStart()).set(channels);
            return new Uint8Array(rfxArtNetNative.instance.exports.memory.buffer, 0, rfxArtNetNative.instance.exports.getPacketSize(channels.length));
        }
    }
}