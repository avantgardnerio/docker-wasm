FROM ubuntu:16.04

# --------------------------- ubuntu ------------------------------------------
RUN apt-get -y update
RUN	apt-get -y install git build-essential cmake clang wget

# --------------------------- sexpr -------------------------------------------
RUN git clone https://github.com/WebAssembly/sexpr-wasm-prototype.git
# SHA from branch binary_0xa
RUN cd sexpr-wasm-prototype && \
	git checkout 98729df && \
	git submodule update --init
RUN cd sexpr-wasm-prototype && make -j8

# -------------------------- node ---------------------------------------------
RUN git clone https://github.com/nodejs/node.git
# SHA from branch vee-eight-5.1
RUN cd node && \
	git checkout 61ed0bb && \
	./configure && \
	make -j8

# ------------------------ emscripten -----------------------------------------
RUN wget https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz
RUN tar -xvf emsdk-portable.tar.gz
RUN cd /emsdk_portable && \
	./emsdk update && \
	./emsdk install sdk-incoming-64bit && \
	./emsdk activate sdk-incoming-64bit
ENV PATH /emsdk_portable:/emsdk_portable/clang/fastcomp/build_incoming_64/bin:\
	/emsdk_portable/node/4.1.1_64bit/bin:/emsdk_portable/emscripten/incoming:\
	/node/out/Release/:/sexpr-wasm-prototype/out/:/usr/local/sbin:/usr/local/bin:\
	/usr/sbin:/usr/bin:/sbin:/bin

# ------------------------- binaryen ------------------------------------------
RUN git clone https://github.com/WebAssembly/binaryen.git
RUN cd /binaryen && cmake . && make

RUN	apt-get -y install vim

# ---------------------------- run --------------------------------------------
WORKDIR /src
ENTRYPOINT cd /build && \
	emcc /src/hello_world.c -s BINARYEN=1 -O0 -s ONLY_MY_CODE=1 && \
	sexpr-wasm /build/a.out.wast -o /build/hello_world.wasm && \
	/node/out/Release/node --expose-wasm /src/index.js
