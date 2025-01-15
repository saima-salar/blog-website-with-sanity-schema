import {DocumentTextIcon} from '@sanity/icons'
import { defineField, defineType} from 'sanity'

export const commentType = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description:"Comments would not show on the site without approval"
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'comment',
      type: 'text',
    }),
    defineField({
      name: 'post',
      type: 'reference',
       to: {type:'post'},
    }),
],
})
