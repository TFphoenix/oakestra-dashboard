import { Action, createReducer, on } from '@ngrx/store';
import * as serviceActions from '../actions/service.actions';
import { IService } from '../../interfaces/service';

export const serviceFeatureKey = 'service';

export interface State {
    service: IService;
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    service: {},
    loading: false,
    error: {},
};

export const serviceReducer = createReducer(
    initialState,

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET SERVICE  //////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(serviceActions.getServicesSuccess, (state, action) => {
        const service = action.service;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.getServices, (state) => {
        const service = {} as IService;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.getServicesError, (state, action) => {
        const services = {} as IService;
        const loading = false;
        const error = action.error;
        return { ...state, services, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  POST SERVICE  //////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(serviceActions.postService, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(serviceActions.postServiceSuccess, (state, action) => {
        // const services = [...state.service, action.service];
        const services = action.service;
        const loading = false;
        return { ...state, services, loading };
    }),

    on(serviceActions.postServiceError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  UPDATE SERVICE  ////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////
    // TODO

    on(serviceActions.updateService, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(serviceActions.updateServiceSuccess, (state, action) => {
        console.log(action);
        const service = state.service;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.updateServiceError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  DELETE SERVICE  ////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(serviceActions.deleteService, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(serviceActions.deleteServiceSuccess, (state, action) => {
        // TODO
        const service = action.service;
        // const service = state.service.filter((s: IService) => s !== action.service);
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.deleteServiceError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return serviceReducer(state, action);
}
