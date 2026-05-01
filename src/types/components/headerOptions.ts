export interface HeaderOption {
  text: string
  action: string // Unique identifier to send to the parent
  disabled?: boolean
  visible?: boolean // Control visibility (default: true)
}
