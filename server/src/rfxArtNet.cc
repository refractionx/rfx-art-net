/*
 *   Copyright (c) 2009 - 2022 Samuil Aleksov
 */

#include <node.h>
#include <rfxArtNet.h>
#include <iostream>

namespace rfxArtNet {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::External;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Persistent;
using v8::ObjectTemplate;
using v8::FunctionTemplate;
using v8::Function;
using v8::ArrayBuffer;
using v8::Uint8ClampedArray;
using v8::BackingStore;

class RFXArtNetData {
  public:
    explicit RFXArtNetData(Isolate* isolate) { }

    inline void Wrap(v8::Local<v8::Object> handle) {
      handle_.Reset(v8::Isolate::GetCurrent(), handle);
      handle_.SetWeak(this, weakCallback, v8::WeakCallbackType::kParameter);
    }

    static void weakCallback(const v8::WeakCallbackInfo<RFXArtNetData>& data) {
      data.GetParameter()->handle_.Reset();
      delete data.GetParameter();
    }

    v8::Persistent<Object> handle_;
    RFXArtNetPacket packet;
};

static void storeDeleteCallback(void* data, size_t length, void* deleter_data) {

}


void GetHex(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  
  RFXArtNetData* data =
      reinterpret_cast<RFXArtNetData*>(args.Data().As<External>()->Value());

  unsigned short channelsLength = rfxArtNetChannelsLen(&data->packet);
  unsigned short packetLength = rfxArtNetPacketSize(channelsLength);
  
  char* hex = new char[packetLength*2+1];

  for (size_t i = 0; i < packetLength; i++) {
    sprintf(&hex[i*2], "%02X", ((unsigned char*)&data->packet)[i]);
  }
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, hex, v8::NewStringType::kNormal, packetLength * 2).ToLocalChecked());
  delete hex;
}

void SetUniverse(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<v8::Context> context = isolate->GetCurrentContext();
  
  RFXArtNetData* data =
      reinterpret_cast<RFXArtNetData*>(args.Data().As<External>()->Value());

  unsigned short universe = (unsigned short)args[0]->ToInteger(context).ToLocalChecked()->Value();
  rfxArtNetSetUniverse(&data->packet, universe);
}

void SetSequence(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<v8::Context> context = isolate->GetCurrentContext();
  
  RFXArtNetData* data =
      reinterpret_cast<RFXArtNetData*>(args.Data().As<External>()->Value());

  unsigned short universe = (unsigned short)args[0]->ToInteger(context).ToLocalChecked()->Value();
  rfxArtNetSetUniverse(&data->packet, universe);
}

void Init(const FunctionCallbackInfo<Value>& info) {
  Isolate* isolate = info.GetIsolate();
  Local<v8::Context> context = isolate->GetCurrentContext();

  RFXArtNetData* data = new RFXArtNetData(isolate);
  unsigned short len = (unsigned short)info[0]->ToInteger(context).ToLocalChecked()->Value();
  rfxArtNetInit(&data->packet, len);
  Local<Object> obj = Object::New(isolate);
  data->Wrap(obj);

  unsigned short channelsLength = rfxArtNetChannelsLen(&data->packet);
  unsigned short packetLength = rfxArtNetPacketSize(channelsLength);

  std::unique_ptr<BackingStore> storeU = ArrayBuffer::NewBackingStore(&data->packet, packetLength, storeDeleteCallback, NULL);
  std::shared_ptr<BackingStore> store = std::move(storeU);
  Local<ArrayBuffer> buffer = ArrayBuffer::New(isolate, store);
  Local<Uint8ClampedArray> typedArray = Uint8ClampedArray::New(buffer, 0, packetLength);
  Local<Uint8ClampedArray> channels = Uint8ClampedArray::New(buffer, RFX_ART_NET_DMX_PAYLOAD_ADDRESS, channelsLength);

  Local<External> external = External::New(isolate, data);

  Local<FunctionTemplate> tplHex = FunctionTemplate::New(isolate, GetHex, external);
  Local<Function> fnHex = tplHex->GetFunction(context).ToLocalChecked();

  Local<FunctionTemplate> tplUniverse = FunctionTemplate::New(isolate, SetUniverse, external);
  Local<Function> fnUniverse = tplUniverse->GetFunction(context).ToLocalChecked();

  Local<FunctionTemplate> tplSequence = FunctionTemplate::New(isolate, SetSequence, external);
  Local<Function> fnSequence = tplSequence->GetFunction(context).ToLocalChecked();

  fnHex->SetName(String::NewFromUtf8(isolate, "hex").ToLocalChecked());
  obj->Set(context, String::NewFromUtf8(isolate, "hex").ToLocalChecked(), fnHex);
  fnUniverse->SetName(String::NewFromUtf8(isolate, "setUniverse").ToLocalChecked());
  obj->Set(context, String::NewFromUtf8(isolate, "setUniverse").ToLocalChecked(), fnUniverse);
  fnSequence->SetName(String::NewFromUtf8(isolate, "setSequence").ToLocalChecked());
  obj->Set(context, String::NewFromUtf8(isolate, "setSequence").ToLocalChecked(), fnSequence);
  obj->Set(context, String::NewFromUtf8(isolate, "buffer").ToLocalChecked(), typedArray);
  obj->Set(context, String::NewFromUtf8(isolate, "channels").ToLocalChecked(), channels);

  info.GetReturnValue().Set(obj);
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "init", Init);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}