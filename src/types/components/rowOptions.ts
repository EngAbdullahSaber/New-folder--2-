export interface MenuOption {
  text: string
  action: string // Unique identifier to send to the parent
  disabled?: boolean | ((row: any) => boolean)
  visible?: boolean // Control visibility (default: true)
  icon?: string
  color?: string
  isExternal?: boolean
}
