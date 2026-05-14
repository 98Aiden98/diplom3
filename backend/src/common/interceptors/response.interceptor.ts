import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'success' in (payload as object)) {
          return payload;
        }

        if (
          payload &&
          typeof payload === 'object' &&
          'message' in (payload as object) &&
          'data' in (payload as object)
        ) {
          const response = payload as { message: string; data: unknown };
          return {
            success: true,
            message: response.message,
            data: response.data,
            path: request.url,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          message: 'Запрос выполнен успешно',
          data: payload,
          path: request.url,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
