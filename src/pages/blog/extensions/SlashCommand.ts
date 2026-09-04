import { Extension } from '@tiptap/react'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'

export type SlashCommandItem = {
  id: string
  title: string
  description: string
  icon: string
  category: string
  shortcut?: string
  command: (props: { editor: any; range: any }) => void
}

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
      } as Partial<SuggestionOptions>,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
