import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/feature/user';

export const GetUser = createParamDecorator((data, req): User => {
  return req.user;
});
