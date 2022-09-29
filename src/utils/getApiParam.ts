export function getApiParam(idName: string, entityName: string) {
  return {
    name: idName,
    required: true,
    description: `Should be an ID of a ${entityName.toUpperCase()} that exists in the database`,
    type: String,
  };
}
