import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../../shared/modules/api/api.service';
import * as applicationActions from '../actions/application.action';
import * as serviceActions from '../actions/service.actions';

@Injectable()
export class ApplicationEffects {
    getApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(applicationActions.getApplication),
            switchMap(({ id }) =>
                this.apiService.getApplicationsOfUser(id).pipe(
                    map((applications) => applicationActions.getApplicationSuccess({ applications })),
                    catchError((error) => of(applicationActions.getApplicationError({ error: error.message }))),
                ),
            ),
        ),
    );

    deleteApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(applicationActions.deleteApplication),
            switchMap(({ application }) =>
                this.apiService.deleteApplication(application).pipe(
                    map(() => applicationActions.deleteApplicationSuccess({ application })),
                    catchError((error) => of(applicationActions.deleteApplicationError({ error: error.message }))),
                ),
            ),
        ),
    );

    postApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(applicationActions.postApplication),
            switchMap(({ application }) =>
                this.apiService.addApplication(application).pipe(
                    // TODO Get the app form the api and store it with the id
                    map(() => applicationActions.postApplicationSuccess({ application })),
                    catchError((error) => of(applicationActions.postApplicationError({ error: error.message }))),
                ),
            ),
        ),
    );

    updateApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(applicationActions.updateApplication),
            switchMap(({ application }) =>
                this.apiService.updateApplication(application).pipe(
                    map(() => applicationActions.updateApplicationSuccess({ application })),
                    catchError((error) => of(applicationActions.updateApplicationError({ error: error.message }))),
                ),
            ),
        ),
    );

    onApplicationChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(applicationActions.setCurrentApplication),
            switchMap(({ application }) =>
                this.apiService.getServicesOfApplication(application._id.$oid).pipe(
                    map((services) => serviceActions.getServicesSuccess({ services })),
                    catchError((error) => of(serviceActions.getServicesError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(private actions$: Actions, private apiService: ApiService) {}
}
