import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') || '';
  const cloneRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  if (
    (req.method === 'POST' && req.url.includes('/api/profesores/registro')) ||
    (req.method === 'POST' && req.url.includes('/api/alumnos/registro')) ||
    (req.method === 'PUT' && req.url.match(/\/api\/profesores\/\d+/)) ||
    (req.method === 'PUT' && req.url.match(/\/api\/alumnos\/\d+/))
  ) {
    return next(req);
  }
  return next(cloneRequest);
};
