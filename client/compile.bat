wasi-sdk-16.0\bin\clang -O2 -Wl,--no-entry -mexec-model=reactor src\rfxArtNet.c -I ..\include -o build\rfxArtNet.wasm