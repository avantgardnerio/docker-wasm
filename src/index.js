const fs = require('fs');

const buffer = fs.readFileSync('/build/hello_world.wasm');

var ffi = {
    env: {
        abort: function() { console.log("abort") },
        abortStackOverflow: function() { console.log("abortStackOverflow") },
        nullFunc_ii: function() { console.log("nullFunc_ii") },
		nullFunc_iiii: function() { console.log("nullFunc_iiii") },
		nullFunc_vi: function() { console.log("nullFunc_vi") },
		_pthread_cleanup_pop: function() { console.log("_pthread_cleanup_pop") },
		___lock: function() { console.log("___lock") },
		_abort: function() { console.log("_abort") },
		_pthread_cleanup_push: function() { console.log("_pthread_cleanup_push") },
		___syscall6: function() { console.log("___syscall6") },
		_sbrk: function() { console.log("_sbrk") },
		___syscall140: function() { console.log("___syscall140") },
		_emscripten_memcpy_big: function() { console.log("_emscripten_memcpy_big") },
		___syscall54: function() { console.log("___syscall54") },
		___unlock: function() { console.log("___unlock") },
		___syscall146: function() { console.log("___syscall146") },

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
