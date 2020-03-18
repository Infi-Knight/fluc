// only a single dispatcher will exist in our application which may have multiple
// stores, so let's go with a Singleton
const Dispatcher = function() {
  return {
    _stores: [],
    register(store) {
      // the store should have an update method on it
      if (!store || !store.update) {
        throw new Error("The store should have an update method on it");
      } else {
        // For every store we have a corresponding subscriber which accepts our
        // consumer functions.The consumer function says what part of the store’s
        // state should be fetched and sent to the view.
        const consumers = [];

        // A common use case is to render the view with the initial state of the store.
        // In the context of our implementation, this means firing all the consumers at least once
        // when they land in the library. Of course, sometimes this is not needed so we added a flag
        // which is by default false.
        const subscribe = (consumer, noInit = false) => {
          consumers.push(consumer);
          noInit ? null : consumer(store);
        };

        // We have collected the consumer functions, now provide a way to execute them:
        const change = () => {
          consumers.forEach(consumer => {
            consumer(store);
          });
        };

        this._stores.push({ store: store, change: change });
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
};

module.exports = {
  create: function() {
    const dispathcer = Dispatcher();

    return {
      /*
        Conventionally, Actions are simple objects with two properties: type and a payload.
        E.g
        {
          type: 'CREATE_USER',
          {
            name: '..',
            age: '...;
          }
        }

        Sometimes payload is optional but almost always our actions are predefined.
        Hence we can apply partial application and avoid passing the action object.
        functions like createAction are also known as action creators
      */
      createAction(type) {
        if (!type) {
          throw new Error("Please, provide action's type.");
        } else {
          return payload => {
            dispathcer.dispatch({
              type,
              payload
            });
          };
        }
      },
      createSubscriber(store) {
        return dispathcer.register(store);
      }
    };
  }
};
