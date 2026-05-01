import { useEffect } from 'react'
import { Card, CardContent, Divider, FormHelperText, Typography } from '@mui/material'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import CustomIconButton from '@/@core/components/mui/IconButton'
import classNames from 'classnames'
import ExtensionBlockQuote from '@tiptap/extension-blockquote'

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  const buttons = [
    { action: 'bold', icon: 'ri-bold' },
    { action: 'underline', icon: 'ri-underline' },
    { action: 'italic', icon: 'ri-italic' },
    { action: 'strike', icon: 'ri-strikethrough' },
    { action: { textAlign: 'left' }, icon: 'ri-align-left', align: 'left' },
    { action: { textAlign: 'center' }, icon: 'ri-align-center', align: 'center' },
    { action: { textAlign: 'right' }, icon: 'ri-align-right', align: 'right' },
    { action: { textAlign: 'justify' }, icon: 'ri-align-justify', align: 'justify' },
    // { action: { textAlign: 'justify' }, icon: 'ri-align-justify', align: 'justify' },
    { action: 'blockquote', icon: 'ri-double-quotes-l' },
    { action: 'bulletList', icon: 'ri-list-unordered' },
    { action: 'code', icon: 'ri-code-s-line' },
    { action: 'codeBlock', icon: 'ri-code-box-line' },
    { action: 'undo', icon: 'ri-arrow-go-back-line' },
    { action: 'redo', icon: 'ri-arrow-go-forward-line' }
  ]

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
      {buttons.map((btn, idx) => {
        const isActive = typeof btn.action === 'string' ? editor.isActive(btn.action) : editor.isActive(btn.action)

        const handleClick = () => {
          if (typeof btn.action === 'string') {
            if (btn.action === 'undo') {
              editor.chain().focus().undo().run()
            } else if (btn.action === 'redo') {
              editor.chain().focus().redo().run()
            } else {
              const method =
                `toggle${btn.action.charAt(0).toUpperCase() + btn.action.slice(1)}` as keyof typeof editor.chain
              ;(editor.chain().focus() as any)[method]().run()
            }
          } else if (btn.align) {
            editor.chain().focus().setTextAlign(btn.align).run()
          }
        }

        return (
          <CustomIconButton
            key={idx}
            {...(isActive && { color: 'primary' })}
            variant='outlined'
            size='small'
            onClick={handleClick}
          >
            <i className={classNames(btn.icon, { 'text-textSecondary': !isActive })} />
          </CustomIconButton>
        )
      })}
    </div>
  )
}

export interface RichTextEditorProps {
  value?: string
  label?: string
  placeholder?: string
  height?: number
  disabled?: boolean
  showToolbar?: boolean
  error?: boolean
  helperText?: string

  onChange?: (html: string) => void
}

const RichTextEditor = ({
  value = '',
  label,
  placeholder = 'Write something here...',
  height = 135,
  disabled = false,
  showToolbar = true,
  error = false,
  helperText,
  onChange
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit,
      Underline,
      ExtensionBlockQuote, // ✅ register here
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  return (
    <>
      {label && <Typography className='mbe-1'>{label}</Typography>}

      <Card
        className='p-0 border shadow-none'
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : 'divider'
        }}
      >
        <CardContent className='p-0'>
          {showToolbar && <EditorToolbar editor={editor} />}

          {showToolbar && <Divider className='mli-5' />}

          <EditorContent
            editor={editor}
            className='overflow-y-auto flex  [&_.ProseMirror]:w-full
    [&_.ProseMirror]:border
    [&_.ProseMirror]:border-transparent
    [&_.ProseMirror]:rounded-[10px]
    [&_.ProseMirror]:p-2
    [&_.ProseMirror]:outline-none
    [&_.ProseMirror]:transition
[&_.ProseMirror]:duration-150
    [&_.ProseMirror:focus]:border-[var(--color-primary)]'
            style={{ minHeight: height }}
          />
        </CardContent>
      </Card>
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </>
  )
}

export default RichTextEditor
