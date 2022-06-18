import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const requestMade = new Subject()

/**
 * Token interceptor -> used to insert token to each request
 *
 * @export
 * @class TokenInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  /**
   * Intercept method
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @return {*}  {Observable<HttpEvent<any>>}
   * @memberof TokenInterceptor
  */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let data = {};

    data = {
      setHeaders: {
        Authorization: 'Basic YzQ2ZWVhM2QtY2MxNi00MGMwLTkwOTYtNjJiMGE3YjFlM2MzOmUxNTQ4M2FmLTk4OGQtNDc1My1iYjU5LTkyNmU4ZDAwZjQzMw=='
      }
    }

    request = request.clone(data);

    requestMade.next()

    return next
      .handle(request)
      .pipe(
        catchError(error => {
          console.error(error);
          throw error
        })
      );
  }
}
