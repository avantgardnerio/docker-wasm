const fs = require('fs');

const buffer = fs.readFileSync('/wasm/hello_world.wasm');

var ffi = {
    env: {
        abort: function() {}
    }
};

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

console.log(buffer);
const ab = toArrayBuffer(buffer);

const mod = Wasm.instantiateModule(ab, ffi);

const res = mod.exports._main();
console.log(res);

process.exit();
