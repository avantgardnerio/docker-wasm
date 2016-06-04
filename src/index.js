const fs = require('fs');

const buffer = fs.readFileSync('/wasm/hello_world.wasm');

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

const mod = Wasm.instantiateModule(ab);

const res = mod.exports.add(2, 2);
console.log(res);

process.exit();

