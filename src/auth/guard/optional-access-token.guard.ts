import { AuthGuard } from '@nestjs/passport';

export class OptionalAccessTokenGuard extends AuthGuard('access-jwt') {
  handleRequest(err, user, info) {
    if (info && info.expiredAt) return { id: -1 };
    return user;
  }
}
