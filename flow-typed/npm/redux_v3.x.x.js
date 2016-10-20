// flow-typed signature: b7513e0865776f62b82ae83c4ad4f0d8
// flow-typed version: c4bbd91cfc/redux_v3.x.x/flow_>=v0.23.x_<=v0.27.x

declare module 'redux' {
  declare type State = any;
  declare type Action = Object;
  declare type AsyncAction = any;
  declare type Reducer<S, A> = (state: S, action: A) => S;
  declare type BaseDispatch = (a: Action) => Action;
  declare type Dispatch = (a: Action | AsyncAction) => any;
  declare type ActionCreator = (...args: any) => Action | AsyncAction;
  declare type MiddlewareAPI = { dispatch: Dispatch, getState: () => State };
  declare type Middleware = (api: MiddlewareAPI) => (next: Dispatch) => Dispatch;
  declare type Store = {
    dispatch: Dispatch,
    getState: () => State,
    subscribe: (listener: () => void) => () => void,
    replaceReducer: (reducer: Reducer<any, any>) => void
  };
  declare type StoreCreator = (reducer: Reducer<any, any>, initialState: ?State) => Store;
  declare type StoreEnhancer = (next: StoreCreator) => StoreCreator;
  declare type ActionCreatorOrObjectOfACs = ActionCreator | { [key: string]: ActionCreator };
  declare type Reducers = { [key: string]: Reducer<any, any> };
  declare class Redux {
    bindActionCreators<actionCreators: ActionCreatorOrObjectOfACs>(actionCreators: actionCreators, dispatch: Dispatch): actionCreators;
    combineReducers(reducers: Reducers): Reducer<any, any>;
    createStore(reducer: Reducer<any, any>, initialState?: State, enhancer?: StoreEnhancer): Store;
    applyMiddleware(...middlewares: Array<Middleware>): StoreEnhancer;
    compose(...functions: Array<Function | StoreEnhancer>): Function;
  }
  declare var exports: Redux;
}
