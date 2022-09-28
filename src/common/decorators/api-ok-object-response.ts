import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseD } from '../types/data';

export const ApiOkObjectResponse = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(ResponseD, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseD) },
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
