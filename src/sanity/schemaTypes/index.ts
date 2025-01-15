import { SchemaTypeDefinition } from 'sanity';
import { postType } from './postType';
import { authorType } from './authorType';
import { categoryType } from './categoryType';
import { commentType } from './commentType';
import { blockContentType } from './blockContentType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, authorType, categoryType, commentType, blockContentType],
};
