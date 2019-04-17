import _Object$keys from "@babel/runtime-corejs2/core-js/object/keys";
import _Object$assign from "@babel/runtime-corejs2/core-js/object/assign";
var hotReloadingCache = [];
export default {
  config: function config(data) {
    var store = this.store || this.data.store;

    var _self = this; //HMR try to unsubscribe


    if (module.hot && process.env.NODE_ENV === 'development') {
      for (var i = hotReloadingCache.length - 1; i >= 0; i--) {
        var item = hotReloadingCache[i];
        var name = item.name;

        var unsubscribe = item.unsubscribe || function () {}; // HMR


        if (this.name && this.name === name) {
          hotReloadingCache.slice(i, 1);
          unsubscribe();
        }
      }
    }

    if (typeof this.mapStateToData === 'function') {
      _self._mergeStoreToData();

      this.unsubscribe = store.subscribe(function () {
        _self._mergeStoreToData();
      }); // HMR add the unsubscribe handler into the cache.
      // every container instance should has an unique 
      // name, becuase we identify the unsubscribe handler
      // from the container name.

      if (module.hot && process.env.NODE_ENV === 'development' && this.name) {
        hotReloadingCache.push({
          name: this.name,
          unsubscribe: this.unsubscribe
        });
      }

      this.$on('$destroy', function () {
        _self.unsubscribe();
      });
    }

    if (typeof this.mapDispatchToData === 'function') {
      _Object$assign(this.data, this.mapDispatchToData(store.dispatch));
    }

    this.supr(data);
  },
  _mergeStoreToData: function _mergeStoreToData() {
    var store = this.store || this.data.store;
    var data = this.data;
    var newData = this.mapStateToData(store.getState());
    var _isChange = false;

    _Object$keys(newData).forEach(function (key) {
      if (newData[key] !== data[key]) {
        data[key] = newData[key];
        _isChange = true;
      }
    });

    if (_isChange) {
      this.$update();
    }
  }
};