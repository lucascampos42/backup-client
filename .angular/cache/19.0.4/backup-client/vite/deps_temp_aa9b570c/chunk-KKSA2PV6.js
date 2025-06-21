import {
  invoke
} from "./chunk-Q4VBDLF2.js";
import {
  __async
} from "./chunk-WDMUDEB6.js";

// node_modules/@tauri-apps/api/helpers/tauri.js
function invokeTauriCommand(command) {
  return __async(this, null, function* () {
    return invoke("tauri", command);
  });
}

export {
  invokeTauriCommand
};
//# sourceMappingURL=chunk-KKSA2PV6.js.map
