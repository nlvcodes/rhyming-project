import type { CollectionConfig } from 'payload'
import slugify from '@/utilities/slugify'

export const Words: CollectionConfig = {
  slug: 'word',
  admin: {
    useAsTitle: 'word',
    pagination: {
      defaultLimit: 0,
      limits: [0, 10, 50]
    }
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Word Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  type: 'text',
                  name: 'word',
                  admin: {
                    width: '50%',
                  },
                  required: true,
                  unique: true,
                },
                {
                  type: 'text',
                  name: 'slug',
                  admin: {
                    width: '50%',
                  },
                  required: true,
                  hooks: {
                    beforeValidate: [slugify('word')],
                  },
                },
              ],
            },
            {
              type: 'relationship',
              name: 'homonyms',
              relationTo: 'word',
              hasMany: true,
            },
            {
              type: 'array',
              name: 'pronunciations',
              required: true,
              labels: {
                singular: 'Pronunciation',
                plural: 'Pronunciations',
              },
              fields: [
                {
                  type: 'text',
                  name: 'lastVowel',
                  admin: {
                    readOnly: true,
                  },
                  hooks: {
                    beforeChange: [
                      async ({ siblingData, req: { payload } }) => {
                        return await payload
                          .findByID({
                            collection: 'vowel',
                            id: siblingData?.syllables.at(-1).vowelSounds,
                          })
                          .then((res) => res.value)
                      },
                    ],
                  },
                },
                {
                  type: 'array',
                  name: 'syllables',
                  required: true,
                  fields: [
                    {
                      type: 'relationship',
                      relationTo: 'vowel',
                      name: 'vowelSounds',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Rhymes',
          fields: [
            // {
            //   type: 'join',
            //   name: 'rhymes',
            //   collection: 'vowel',
            //   on: 'label',
            // }
          ],
        },
      ],
    },
  ],
}
