const Dispatcher = function() {
  return {
    _stores: [],
    register: function(store) {
      // the store should have an update method on it
      if (!store || !store.update) {
        throw new Error("The store should have an update method on it");
      } else {
        this._stores.push({ store: store });
      }
    },
    dispatch: function(action) {
      this._stores.forEach(entry => {
        entry.store.update(action);
      });
    }
  };
};
