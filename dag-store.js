import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose,
  Store as ReduxStore,
  Middleware as ReduxMiddleware
} from 'redux';
import uuid from 'node-uuid';

type NodeAction = {
  type: string,
  payload: {
    label: string,
    type: string,
    nodeId: string | number,
    style: string
  }
};

type NodeState = {
  id: string,
  label: string,
  type: string
};


let nodes = (state:Array<NodeState> = [], action:NodeAction = {}): Array<NodeState> => {
  switch(action.type) {
    case 'ADD-NODE':
      return [
        ...state,
        {
          id: uuid.v4(),
          label: action.payload.label,
          type: action.payload.type
        }
      ];
    case 'UPDATE_NODE':
      return state.map(node => {
        if (node.id === action.payload.nodeId) {
          node.style = action.payload.style;
          return node;
        }
        return node;
      });
    case 'RESET':
      return [];
    default:
      return state;
  }
};

type ConnectionState = {
  from: string,
  to: string
};
type ConnectionAction = {
  type: string,
  payload: {
    connetions: Array<ConnectionState>
  },
  connection: ConnectionState
};
const connections = (state:Array<ConnectionState> = [], action:ConnectionAction = {}) => {
  switch(action.type) {
    case 'ADD-CONNECTIONS':
      return [
        ...state,
        {
          from: action.connection.from,
          to: action.connection.to
        }
      ];
    case 'SET-CONNECTIONS':
      return [...action.payload.connections];
    case 'RESET':
      return [];
    default:
      return state;
  }
};
type GraphState = Object;
type GraphAction = {
  type: string,
  payload: Object
};
const graph = (state:GraphState = {}, action:GraphAction = {}) => {
  switch(action.type) {
    case 'LOADING':
      return Object.assign({}, state, {loading: action.payload.loading});
    case 'RESET':
      return {};
    default:
      return state;
  }
};

const defaultReducersMap = () => {
  return {
    nodes: [ (state = [], action = {}) => state ],
    graph: [ (state = {}, action = {}) => state ],
    connections: [ (state = [], action = {}) => state ]
  }
};
type NodeReducerFnState = (state: Array<NodeState>, action: Object) => Array<NodeState>;
type ConnectionReducerFnState = (state: Array<ConnectionState>, action: Object) => Array<ConnectionState>;
type GraphReducerFnState = (state: Array<GraphState>, action: Object) => Array<GraphState>;
type ReducersMapType = {
  nodes: Array<NodeReducerFnState>,
  connections: Array<ConnectionReducerFnState>,
  graph: Array<GraphReducerFnState>
};

let combinedReducers = function(reducersMap:ReducersMapType = defaultReducersMap()) {
  let defaultValues = defaultReducersMap();
  const getReducer = (map, key, dValues) => {
    if (Array.isArray(map[key])) {
      if (map[key].length > 0) {
        return map[key];
      }
    }
    return dValues[key];
  };
  let nodesReducers = [nodes].concat(getReducer(reducersMap, 'nodes', defaultValues));
  let graphReducers = [graph].concat(getReducer(reducersMap, 'graph', defaultValues));
  let connectionsReducers = [connections].concat(getReducer(reducersMap, 'connections', defaultValues));

  const genericReducerFn  = function(
    reducers: Array<NodeReducerFnState | ConnectionReducerFnState | GraphReducerFnState>,
    state: Array<NodeState> | Array<ConnectionState> | Array<GraphState>,
    action: Object
  ) {
    if(reducers.length > 1){
      return reducers
        .reduce((prev, curr) => curr.bind(null, prev(state, action), action))();
    } else {
      return reducers[0]();
    }
  };
  return combineReducers({
    nodes: (state: NodeState, action: NodeAction) => {
      return genericReducerFn(nodesReducers, state, action);
    },
    connections: (state: ConnectionState, action: ConnectionAction) => {
      return genericReducerFn(connectionsReducers, state, action);
    },
    graph: (state: GraphState, action: GraphAction) => {
      return genericReducerFn(graphReducers, state, action);
    }
  });
};

type StoreDataType = {
  nodes: Array<NodeState>,
  connections: Array<ConnectionState>,
  graph: GraphState
};


export function configureStore(
  data: StoreDataType,
  reducersMap: ReducersMapType,
  middlewares: Array<ReduxMiddleware> = [], 
  enhancers= []
): ReduxStore {
  let store = createStore(
    combinedReducers(reducersMap),
    data,
    compose.apply(
      null,
      [
        applyMiddleware.apply(null, middlewares)
      ].concat(enhancers.map(enhancer => enhancer()))
    )
  );
  return store;
};
