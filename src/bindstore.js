export default {
    config: function(data) {
        var store = this.store || this.data.store;
        var _self = this;
        if(typeof this.mapStateToData === 'function') {
            _self._mergeStoreToData();
            this.unsubscribe = store.subscribe(function() {
                _self._mergeStoreToData();
            });

            this.$on('$destroy', function () {
                _self.unsubscribe();
            });
        }

        if(typeof this.mapDispatchToData === 'function') {
            Object.assign(this.data, this.mapDispatchToData(store.dispatch));
        }

        this.supr(data);
    },

    _mergeStoreToData: function () {
        var store = this.store || this.data.store;
        var data = this.data;
        var newData = this.mapStateToData(store.getState());
        var _isChange = false;
        Object.keys(newData).forEach(function (key) {
            if(newData[key] !== data[key]) {
                data[key] = newData[key];
                _isChange = true;
            }
        });
        if(_isChange) {
            this.$update();
        }
    }
}
