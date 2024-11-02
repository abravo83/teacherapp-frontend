import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') || "";
  const cloneRequest = req.clone({
    setHeaders: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  })
  return next(cloneRequest);
};
