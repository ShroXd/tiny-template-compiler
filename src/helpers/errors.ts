import { CodeLocation } from '../utils';

export const enum ErrorCodes {
  // parse errors
  COMMENT_NOT_CLOSED = "Comment is not closed",
  EOF_BEFORE_TAG_NAME = "EOF before tag name",
  MISSING_END_TAG_NAME = "Missing end tag name",
  INVALID_FIRST_CHARACTER_OF_TAG_NAME = "Invalid first character of tag name",
  UNEXPECTED_QUESTION_MARK_INSTEAD_OF_TAG_NAME = "Unexpected question mark instead of tag name"
}

export interface CompilerError extends Error {
  code: string;
  loc?: CodeLocation;
}

export class CompilerError extends Error {
  code: string;
  loc?: CodeLocation

  constructor(
    message: string,
    code: string,
    loc?: CodeLocation
  ) {
    super(message);

    this.code = code
    this.loc = loc

    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, CompilerError.prototype)
  }
}