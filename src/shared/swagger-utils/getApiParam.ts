import { ApiParamOptions } from '@nestjs/swagger';

/**
 * A method that returns ApiParamOptions for swagger
 */
export function getApiParam(idName: string, entityName: string): ApiParamOptions {
  return {
    name: idName,
    required: true,
    description: `Should be an ID of a ${entityName.toUpperCase()} that exists in the database`,
    type: String,
  };
}
