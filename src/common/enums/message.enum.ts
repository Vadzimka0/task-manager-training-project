export enum MessageEnum {
  INVALID_ID_NOT_OWNER = 'Invalid ID. You are not an owner',
  INVALID_USER_ID = 'The user id is not valid',
  INVALID_COLOR = 'Color is not valid. The length has to be 7 symbols and first one has to be #.',
  ENTITY_NOT_FOUND = 'Entity %Model, id=% not found in the database',
}

export enum ProjectMessageEnum {
  PROJECT_NOT_EXIST = 'Project does not exist',
  PROJECT_DUPLICATE = 'Project with that name already exists',
  PROJECT_PROTECTED = 'This project cannot be edited or deleted',
}

export enum CommentMessageEnum {
  INVALID_ID_NOT_OWNER_OR_MEMBER = 'Invalid ID. You are not an owner or member',
}

export enum AttachmentMessageEnum {
  FILE_NOT_FOUND = 'File not found',
}

export enum NoteMessageEnum {
  INVALID_NOTE_ID = 'The note id is not valid',
}

export enum ChecklistMessageEnum {
  ITEM_NOT_BELONG_TO_CHECKLIST = 'The item id does not belong to current checklist',
}
