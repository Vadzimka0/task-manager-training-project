import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { ResponseData } from '../classes';

export const ApiOkObjectResponse = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(ResponseData, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseData) },
          {
            properties: {
              data: {
                type: 'object',
                $ref: getSchemaPath(dataDto),
              },
            },
          },
        ],
      },
    }),
  );
