
import { createStore, combineReducers, Store } from 'redux';
import rootReducer from './reducers';

interface RootState {
  app: ReturnType<typeof rootReducer>;
}

const store: Store<RootState> = createStore(
  combineReducers({ app: rootReducer })
);

export default store;
