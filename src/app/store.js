import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { policeApi } from '../services/policeAPI';

export const store = configureStore({
  reducer: {
    [policeApi.reducerPath]: policeApi.reducer,
    hasSelection: (state = false, action) => {
      switch (action.type) {
        case 'HAS_SELECTION_TRUE':
          return true;
        case 'HAS_SELECTION_FALSE':
          return false;
        default:
          return state;
      }
    },
    startDate: (state = '', action) => {
      switch (action.type) {
        case 'SET_START_DATE':
          return action.payload;
        default:
          return state;
      }
    },
    force: (state = {}, action) => {
      switch (action.type) {
        case 'SET_FORCE':
          return {
            ...state,
            forceRaw: action.payload.forceRaw,
            forceFormatted: action.payload.forceFormatted,
          };
        default:
          return state;
      }
    },
    searchBy: (state = {}, action) => {
      switch (action.type) {
        case 'SET_BY_FORCE':
          return {
            ...state,
            byForce:
              'force=' +
              action.payload.forceRaw +
              '&date=' +
              action.payload.startDate,
          };
        default:
          return state;
      }
    },
  },
  searchCount: (state = 0, action) => {
    switch (action.type) {
      case 'SET_SEARCH_COUNT':
        return action.payload;
        default:
          return state;
    }
  },
  middleware: (getDefaultMiddiware) =>
    getDefaultMiddiware().concat(policeApi.middleware),
});

setupListeners(store.dispatch);
