import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = context.getArgByIndex(2); // GraphQL context
    return ctx.req.user;
  },
);
