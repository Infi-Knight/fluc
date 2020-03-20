// only a single dispatcher will exist in our application which may have multiple
// stores, so let's go with a Singleton

// For every store we have a corresponding subscriber which accepts our
// consumer functions.The consumer function says what part of the store’s
// state should be fetched and sent to the view.

// A common use case is to render the view with the initial state of the store.
// In the context of our implementation, this means firing all the consumers at least once
// when they land in the library. Of course, sometimes this is not needed so we added a flag
// which is by default false.
export function Dispatcher() {
  return {
    _stores: [],
    register(store) {
      if (!store || !store.update) {
        throw new Error("The store should have an update method on it");
      } else {
        let consumers = [];

        const subscribe = (consumer, noInit = false) => {
          // multiple consumers can subscibe to our store
          consumer = consumer.constructor === Array ? consumer : [consumer];
          consumers = consumers.concat(consumer);
          if (!noInit) {
            consumers.forEach(consumer => {
              consumer(store);
            });
          }
        };

        // We have collected the consumer functions, now provide a way to execute them:
        const change = () => {
          consumers.forEach(consumer => {
            consumer(store);
          });
        };

        this._stores.push({ store, change });
        return subscribe;
      }
    },
    dispatch(action) {
      if (this._stores.length > 0) {
        this._stores.forEach(entry => {
          entry.store.update(action, entry.change);
        });
      }
    }
  };
}
