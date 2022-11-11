/*
 *   Copyright (c) 2009 - 2022 Samuil Aleksov
 */

#pragma once

#include <memory.h>

#define RFX_ART_NET_DMX_MAX_CHANNELS 512
#define RFX_ART_NET_DMX_PAYLOAD_ADDRESS 18

typedef struct RFXArtNetPacket {
    // magic number, opcode dmx, prot ver 14
    unsigned char header[12];
    unsigned char sequence;
    unsigned char physical;
    unsigned char universeLo;
    unsigned char universeHi;
    unsigned char lengthHi;
    unsigned char lengthLo;
    unsigned char channels[RFX_ART_NET_DMX_MAX_CHANNELS];
} RFXArtNetPacket;

unsigned char rfxArtNetHeader[13] = "Art-Net\x00\x00\x50\x00\x0e";

inline void rfxArtNetInit(RFXArtNetPacket* p, unsigned short length) {
    memcpy(p->header, rfxArtNetHeader, 12);
    p->sequence = 0;
    p->physical = 0;
    p->universeHi = 0;
    p->universeLo = 0;
    p->lengthLo = length & 0xff;
    p->lengthHi = (length >> 8) & 0xff;
    memset(p->channels, 0, RFX_ART_NET_DMX_MAX_CHANNELS);
}

inline void rfxArtNetSetUniverse(RFXArtNetPacket* p, unsigned short universe) {
    memcpy(p->header, rfxArtNetHeader, 12);
    p->universeHi = (universe >> 8) & 0xff;
    p->universeLo = universe & 0xff;
}

inline void rfxArtNetSetSequence(RFXArtNetPacket* p, unsigned char sequence) {
    p->sequence = sequence;
}

inline void rfxArtNetPack(RFXArtNetPacket* p, unsigned short length, unsigned char* channels) {
    memcpy(p->channels, channels, length);
}

inline unsigned short rfxArtNetChannelsLen(RFXArtNetPacket* p) {
    return p->lengthHi << 8 | p->lengthLo;
}

inline int rfxArtNetPacketSize(unsigned short length) {
    return RFX_ART_NET_DMX_PAYLOAD_ADDRESS + length;
}