import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthDetail } from '../auth/auth.interfaces';
import { User } from '../entities';
import { oc } from 'ts-optchain';

export const RestAuthDetail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IAuthDetail => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;
    const ip: string =
      oc(request).headers['x-forwarded-for']() ||
      oc<any>(request).connection.remoteAddress('');
    if (!user) {
      console.log(ctx)
      throw new UnauthorizedException();
    } else {
      return {
        currentUser: user,
        ip: ip,
      };
    }
  },
);
