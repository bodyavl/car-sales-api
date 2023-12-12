// interceptors/car-response.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Car } from 'src/car/entities/car.entity';

@Injectable()
export class CarResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    return next.handle().pipe(
      map((data) => {
        if (!(data instanceof Car))
          throw new InternalServerErrorException('Data is not instance of Car');

        return this.transformCar(data, userId);
      }),
    );
  }

  private transformCar(car: Car, userId: string): Car {
    const isOwner = userId === car.author.id;

    if (isOwner) {
      return car;
    }

    const vin = car.VIN;

    const visiblePart = vin.substring(0, 4);
    const maskedPart = '*'.repeat(vin.length - 8);
    const lastPart = vin.substring(vin.length - 4);

    return { ...car, VIN: `${visiblePart}${maskedPart}${lastPart}` };
  }
}
