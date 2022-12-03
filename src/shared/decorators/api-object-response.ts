import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ResponseData } from '../classes';

export const ApiObjectResponse = <DataDto extends Type<unknown>>(
  status: number,
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(ResponseData, dataDto),
    ApiResponse({
      status,
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
