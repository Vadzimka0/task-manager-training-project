export enum MessageEnum {
  INVALID_ID_NOT_OWNER = 'Invalid ID. You are not an owner',
  INVALID_USER_ID = 'The user id is not valid',
  INVALID_USER_ID_STATISTICS_ONLY_TO_YOU = 'The user id is not valid. Statistics are available only to you.',
  INVALID_COLOR = 'Color is not valid. The length has to be 7 symbols and first one has to be #.',
  INVALID_REFRESH_TOKEN = 'Invalid refresh token.',
  INVALID_CREDENTIALS = 'Invalid credentials.',
  USER_ALREADY_REGISTERED = 'User is already registered.',
  ENTITY_NOT_FOUND = 'Entity %Model, id=% not found in the database',
}

export enum AvatarMessageEnum {
  AVATAR_COULD_NOT_BE_ATTACHED = 'The avatar could not be attached to user. The user is not found.',
  AVATAR_FILE_NOT_FOUND = 'The avatar could not be attached to user. The file is not found.',
}

export enum AttachmentMessageEnum {
  FILE_NOT_FOUND = 'File not found',
  FORMAT_NOT_SUPPORTED = 'The image format is not supported. Only .png, .jpeg and .jpg is allowed.',
}

export enum NoteMessageEnum {
  INVALID_NOTE_ID = 'The note id is not valid',
}

export enum ChecklistMessageEnum {
  ITEM_NOT_BELONG_TO_CHECKLIST = 'The item id does not belong to current checklist',
}

export enum ProjectMessageEnum {
  PROJECT_NOT_EXIST = 'Project does not exist',
  PROJECT_DUPLICATE = 'Title is not valid. Project with that name already exists',
  PROJECT_PROTECTED = 'The Personal project could not be edited.',
}

export enum CommentMessageEnum {
  INVALID_ID_NOT_OWNER_OR_MEMBER = 'Invalid ID. You are not an owner or member',
}
