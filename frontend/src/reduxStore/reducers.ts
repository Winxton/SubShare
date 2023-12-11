import { SET_SUBSCRIPTION_COST, setSubscriptionCost} from './actions';

interface AppState {
  subscriptionCost: number | null;
}

const initialState: AppState = {
  subscriptionCost: null,
};

type AppAction = ReturnType<typeof setSubscriptionCost>;

const rootReducer = (state = initialState, action: AppAction): AppState => {
  switch (action.type) {
    case SET_SUBSCRIPTION_COST:
      return {
        ...state,
        subscriptionCost: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;