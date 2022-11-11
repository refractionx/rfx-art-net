/*
 *   Copyright (c) 2009 - 2022 Samuil Aleksov
 */

#include <rfxArtNet.h>

__attribute__((import_module("rfx"), import_name("logCS")))
void logCString(char*);

__attribute__((export_name("getChannelsStart")))
unsigned short getChannelsStart() {
    return RFX_ART_NET_DMX_PAYLOAD_ADDRESS;
}

__attribute__((export_name("getChannelsLength")))
unsigned short getChannelsLength(RFXArtNetPacket* p) {
    return rfxArtNetChannelsLen(p);
}

__attribute__((export_name("init")))
void init(RFXArtNetPacket* p, unsigned short length) {
    return rfxArtNetInit(p,  length);
}

__attribute__((export_name("setUniverse")))
void setUniverse(RFXArtNetPacket* p, unsigned short universe) {
    return rfxArtNetSetUniverse(p,  universe);
}

__attribute__((export_name("getPacketSize")))
int getPacketSize(unsigned short length) {
    return rfxArtNetPacketSize(length);
}