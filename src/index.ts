import { parser } from "./parser/parser";

export const compiler = (template: string, options = {}) => {
  // TODO generate AST
  parser(template);
  // TODO transform
  // TODO generate code
};
