export type Mode = 'add' | 'search' | 'edit' | 'show' | 'list' | '*'
export type SearchMode = 'and' | 'or' | ''
export type ComponentGeneralProps = {
  scope: 'user' | 'admin' | 'department' | 'hr' | 'interviewer' | 'citizen' | 'user' | 'resident' | 'company'
}

export type ComponentNoticeGeneralProps = {
  scope: 'user' | 'department' | 'operation-center' | 'company'
}

export type ComponentGeneralHajProps = {
  scope: 'departure' | 'arrival'
}
export type ComponentGeneralReceptionProps = {
  scope: 'company' | 'reception-department' | 'service-department'
}
export type ComponentGeneralHandoverProps = {
  scope: 'sender' | 'receiver'
}
