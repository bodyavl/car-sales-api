import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ShortenFieldInEveryObjectInArrayInterceptor
  implements NestInterceptor
{
  constructor(private readonly fieldName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        data.forEach((item) => {
          if (typeof item === 'object' && item[this.fieldName]) {
            item[this.fieldName] = this.shortenString(
              item[this.fieldName],
              240,
            );
          }
        });
        return data;
      }),
    );
  }

  private shortenString(str: string, maxLength: number): string {
    if (str.length > maxLength) {
      return str.substring(0, maxLength).trim() + '...';
    }
    return str;
  }
}
