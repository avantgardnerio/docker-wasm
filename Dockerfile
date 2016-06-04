FROM ubuntu:16.04

RUN apt-get -y update
RUN	apt-get -y install git build-essential cmake
RUN	apt-get -y install clang

RUN git clone https://github.com/WebAssembly/sexpr-wasm-prototype.git

# SHA from branch binary_0xa
RUN cd sexpr-wasm-prototype && \
	git checkout 98729df && \
	git submodule update --init

RUN cd sexpr-wasm-prototype && make -j8

ADD ./wast /wast
RUN mkdir -p /wasm
RUN /sexpr-wasm-prototype/out/sexpr-wasm /wast/hello_world.wast -o  /wasm/hello_world.wasm

RUN git clone https://github.com/nodejs/node.git

# SHA from branch vee-eight-5.1
RUN cd node && \
	git checkout 61ed0bb && \
	./configure && \
	make -j8

ADD ./src /src
WORKDIR /src
ENTRYPOINT /node/out/Release/node --expose-wasm index.js
