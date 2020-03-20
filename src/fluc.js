import { Dispatcher } from "./dispatcher";

// Conventionally, Actions are simple objects with two properties: type and a payload.
// {
//  type: 'CREATE_USER',
//  {
//     name: '..',
//     age: '...;
//  }
// }

// Sometimes payload is optional but almost always our actions are predefined.
// Hence we can apply partial application and avoid passing the action object.
// functions like createAction are also known as action creators
export const Fluc = {
  create: function() {
    var dispatcher = Dispatcher();

    return {
      createAction(type) {
        if (!type) {
          throw new Error("Please, provide action's type.");
        } else {
          return function(payload) {
            return dispatcher.dispatch({ type: type, payload: payload });
          };
        }
      },
      createSubscriber(store) {
        return dispatcher.register(store);
      }
    };
  }
};
