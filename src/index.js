const fs = require('fs');

const buffer = fs.readFileSync('/build/hello_world.wasm');

var ffi = {
    env: {
        abort: function() {},
        abortStackOverflow: function() {},
        nullFunc_ii: function() {},
		nullFunc_iiii: function() {},
		nullFunc_vi: function() {},
		_pthread_cleanup_pop: function() {},
		___lock: function() {},
		_abort: function() {},
		_pthread_cleanup_push: function() {},
		___syscall6: function() {},
		_sbrk: function() {},
		___syscall140: function() {},
		_emscripten_memcpy_big: function() {},
		___syscall54: function() {},
		___unlock: function() {},
		___syscall146: function() {},
        _foo: function() {return 42}
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
console.log("res=", res);

console.log(mod.exports.memory);

const bytes = new Uint8Array(mod.exports.memory, res, 14);
console.log(bytes);

process.exit();
