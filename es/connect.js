import _Object$assign from "@babel/runtime-corejs2/core-js/object/assign";
import bindStore from './bindstore';
export default (function (mapStateToData, mapDispatchToData) {
  var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (App) {
    return App.extend(_Object$assign({
      mapStateToData: mapStateToData,
      mapDispatchToData: mapDispatchToData
    }, {
      name: App.prototype.name
    }, extra, bindStore));
  };
});