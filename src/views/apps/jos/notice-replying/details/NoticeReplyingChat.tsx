'use client'

import * as Shared from '@/shared'

interface NoticeReplyingChatProps {
  depts: any[]
  selectedDeptId: any
  setSelectedDeptId: (id: any) => void
  messagesByDept: Record<number, any[]>
  statusTypes: any[]
  selectedDept: any
  statusAnchorEl: null | HTMLElement
  setStatusAnchorEl: (el: null | HTMLElement) => void
  message: string
  setMessage: (msg: string) => void
  handleSendMessage: () => void
  dictionary: any
  currentUserId: number
  chatContainerRef: any
  handleStatusSelect: (newStatus: string) => void
  refreshMessages: () => void
  mode: any
}

const deptIcons = [
  'ri-building-line',
  'ri-community-line',
  'ri-government-line',
  'ri-hospital-line',
  'ri-hotel-line',
  'ri-store-2-line',
  'ri-bank-line',
  'ri-home-4-line'
]

const NoticeReplyingChat = ({
  depts,
  selectedDeptId,
  setSelectedDeptId,
  messagesByDept,
  statusTypes,
  selectedDept,
  statusAnchorEl,
  setStatusAnchorEl,
  message,
  setMessage,
  handleSendMessage,
  dictionary,
  currentUserId,
  chatContainerRef,
  handleStatusSelect,
  refreshMessages,
  mode
}: NoticeReplyingChatProps) => {
  const [searchQuery, setSearchQuery] = Shared.useState('')

  const handleStatusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setStatusAnchorEl(event.currentTarget)
  }

  const handleStatusClose = () => {
    setStatusAnchorEl(null)
  }

  const handleStatusSelectLocal = (newStatus: string) => {
    handleStatusSelect(newStatus)
    setStatusAnchorEl(null)
  }

  const filteredDepts = depts.filter(dept =>
    dept.department?.department_name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatSeparatorDate = (dateStr: string) => {
    // dateStr is in YYYY-MM-DD format
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (dateStr === todayStr) return dictionary?.titles?.today || 'اليوم'
    if (dateStr === yesterdayStr) return dictionary?.titles?.yesterday || 'أمس'

    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const currentDeptMessages = messagesByDept[selectedDept.id] || []

  const groupedMessages = Shared.useMemo(() => {
    const groupsMap: Record<string, any[]> = {}

    currentDeptMessages.forEach(msg => {
      const dateObj = msg.created_at ? new Date(msg.created_at) : new Date()
      const dateStr = dateObj.toISOString().split('T')[0]

      if (!groupsMap[dateStr]) {
        groupsMap[dateStr] = []
      }
      groupsMap[dateStr].push(msg)
    })

    return Object.keys(groupsMap)
      .sort()
      .map(dateStr => ({
        date: dateStr,
        messages: groupsMap[dateStr].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      }))
  }, [currentDeptMessages])

  return (
    <Shared.Grid container sx={{ height: '100%' }}>
      {/* Departments Sidebar */}
      <Shared.Grid size={{ xs: 12, sm: 4, md: 3.5, lg: 3 }} sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) => Shared.alpha(theme.palette.action.hover, 0.4),
        height: '100%'
      }}>
        {/* Search */}
        <Shared.Box sx={{ p: 2, pb: 0 }}>
          <Shared.TextField
            fullWidth
            size="small"
            placeholder={dictionary?.titles?.search || 'بحث...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Shared.InputAdornment position="start">
                  <Shared.Box component="span" className="ri-search-line" sx={{ color: 'text.disabled' }} />
                </Shared.InputAdornment>
              ),
              sx: {
                borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                bgcolor: 'background.paper'
              }
            }}
          />
        </Shared.Box>

        <Shared.List sx={{ flexGrow: 1, overflowY: 'auto', px: 2, pb: 4 }}>
          {filteredDepts.map((dept) => (
            <Shared.ListItemButton
              key={dept.id}
              selected={selectedDeptId === dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              sx={{
                mb: 1,
                mx: 1,
                py: 3,
                px: 3,
                borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&.Mui-selected': {
                  bgcolor: 'background.paper',
                  '& .MuiTypography-root': { color: 'primary.main' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    height: '50%',
                    width: '4px',
                    bgcolor: 'primary.main',
                    borderRadius: 'var(--mui-shape-customBorderRadius-md)'
                  }
                },
              }}
            >
              <Shared.Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Shared.Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                    bgcolor: (theme) => Shared.alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                  }}
                >
                  <i className={`${deptIcons[depts.indexOf(dept) % deptIcons.length]} text-xl`} />
                </Shared.Avatar>
              </Shared.Badge>
              <Shared.Box sx={{ ml: 3, flexGrow: 1, minWidth: 0 }}>
                <Shared.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Shared.Typography variant="subtitle2" noWrap sx={{ transition: 'color 0.3s' }}>
                    {dept.department?.department_name_ar}
                  </Shared.Typography>
                  <Shared.Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                    {dept.time || ''}
                  </Shared.Typography>
                </Shared.Box>
                <Shared.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Shared.Typography variant="caption" noWrap sx={{ color: 'text.secondary', maxWidth: '140px' }}>
                    {dept.lastMsg || ''}
                  </Shared.Typography>
                </Shared.Box>
              </Shared.Box>
            </Shared.ListItemButton>
          ))}
        </Shared.List>
      </Shared.Grid>

      {/* Chat Window */}
      <Shared.Grid size={{ xs: 12, sm: 8, md: 8.5, lg: 9 }} sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', position: 'relative' }}>
        {/* Decorative Background Element */}
        <Shared.Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(#000 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />

        {/* Chat Header */}
        <Shared.Box sx={{
          p: 3,
          px: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 10
        }}>
          <Shared.Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shared.Avatar
              sx={{
                width: 45,
                height: 45,
                borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              <i className={`${deptIcons[depts.indexOf(selectedDept) % deptIcons.length]} text-2xl`} />
            </Shared.Avatar>
            <Shared.Box>
              <Shared.Typography variant="h6" sx={{ lineHeight: 1.2 }}>{selectedDept.department?.department_name_ar}</Shared.Typography>
            </Shared.Box>
          </Shared.Box>

          <Shared.Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {(() => {
              const currentType = statusTypes.find(t => t.id.toString() === (selectedDept.notice_type?.toString() || '1'))
              const defaultColors = ['primary', 'info', 'success', 'warning', 'error', 'secondary']
              const currentColor = currentType ? defaultColors[currentType.id % defaultColors.length] : 'primary'

              return (
                <Shared.Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Shared.Tooltip title={dictionary?.titles?.refresh || 'تحديث'}>
                    <Shared.IconButton
                      onClick={refreshMessages}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main', transform: 'rotate(180deg)' },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <Shared.Box component="span" className="ri-refresh-line" />
                    </Shared.IconButton>
                  </Shared.Tooltip>

                  <Shared.Button
                    variant="contained"
                    color={currentColor as any}
                    onClick={handleStatusClick}
                    startIcon={
                      <Shared.Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: `${currentColor}.main`
                        }}
                      />
                    }
                    endIcon={<Shared.Box component="span" className="ri-arrow-down-s-line" />}
                    sx={{
                      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                      textTransform: 'none',
                      px: 4,
                      fontWeight: 500
                    }}
                  >
                    {currentType?.name_ar || 'الحالة'}
                  </Shared.Button>
                  <Shared.Menu
                    anchorEl={statusAnchorEl}
                    open={Boolean(statusAnchorEl)}
                    onClose={handleStatusClose}
                    sx={{ mt: 2 }}
                  >
                    {statusTypes.map((type) => {
                      const typeColor = defaultColors[type.id % defaultColors.length]
                      return (
                        <Shared.MenuItem
                          key={type.id}
                          onClick={() => handleStatusSelectLocal(type.id.toString())}
                          selected={type.id.toString() === selectedDept.notice_type?.toString()}
                          sx={{ gap: 2, minWidth: 160, bgcolor: 'transparent' }}
                        >
                          <Shared.Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: `${typeColor}.main`
                            }}
                          />
                          {type.name_ar}
                        </Shared.MenuItem>
                      )
                    })}
                  </Shared.Menu>
                </Shared.Box>
              )
            })()}
          </Shared.Box>
        </Shared.Box>

        {/* Messages List */}
        <Shared.Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            p: 6,
            overflowY: 'auto',
            display: 'flex',
            height: '50vh',
            flexDirection: 'column',
            gap: 5,
            zIndex: 1,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 'var(--mui-shape-customBorderRadius-md)' }
          }}
        >
          {groupedMessages.map((group) => (
            <Shared.Box key={group.date} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {/* Date Separator */}
              <Shared.Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Shared.Divider sx={{ flexGrow: 1 }} />
                <Shared.Typography variant="caption" sx={{ mx: 4, color: 'text.disabled', letterSpacing: 1 }}>
                  {formatSeparatorDate(group.date)}
                </Shared.Typography>
                <Shared.Divider sx={{ flexGrow: 1 }} />
              </Shared.Box>

              {group.messages.map((msg, index) => {
                const isMe = msg.creator?.personal_id === currentUserId
                const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                const statusType = statusTypes.find(t => t.id === msg.notice_status_type_id)

                return (
                  <Shared.Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: !isMe ? 'flex-end' : 'flex-start',
                      alignSelf: !isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      animation: 'fadeInUp 0.4s ease forwards',
                      '@keyframes fadeInUp': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' }
                      },
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {/* Creator Name */}
                    <Shared.Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, px: 12 }}>
                      {msg.creator?.full_name_ar}
                    </Shared.Typography>
                    <Shared.Box sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 2.5,
                      flexDirection: !isMe ? 'row-reverse' : 'row'
                    }}>
                      <Shared.Avatar
                        src={!isMe ? '/images/avatars/1.png' : '/images/avatars/7.png'}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                        }}
                      />
                      <Shared.Box sx={{
                        p: 3.5,
                        px: 4.5,
                        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                        bgcolor: !isMe ? 'primary.main' : 'background.paper',
                        color: !isMe ? 'white' : 'text.primary',
                        border: !isMe ? 'none' : '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                      }}>
                        <Shared.Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {msg.reply_content}
                        </Shared.Typography>
                      </Shared.Box>
                    </Shared.Box>
                    <Shared.Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mt: 1.5,
                      px: 12,
                      flexDirection: isMe ? 'row-reverse' : 'row'
                    }}>
                      <Shared.Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '11px' }}>
                        {time}
                      </Shared.Typography>
                      {statusType && (
                        <Shared.Chip
                          label={statusType.name_ar}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 18,
                            fontSize: '10px',
                            borderColor: isMe ? 'primary.light' : 'divider',
                            color: isMe ? 'primary.main' : 'text.secondary'
                          }}
                        />
                      )}
                    </Shared.Box>
                  </Shared.Box>
                )
              })}
            </Shared.Box>
          ))}
        </Shared.Box>

        {/* Message Input Area */}
        <Shared.Box sx={{
          p: 4,
          px: 6,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          zIndex: 10
        }}>
          <Shared.Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: (theme) => Shared.alpha(theme.palette.action.hover, 0.6),
            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
            px: 3,
            py: 1.5,
            border: '1px solid transparent',
            transition: 'all 0.3s',
            '&:focus-within': {
              bgcolor: 'background.paper',
              borderColor: 'primary.main',
            }
          }}>
            <Shared.TextField
              fullWidth
              variant="standard"
              placeholder={selectedDept.notice_type === '7' ? 'هذه المحادثة مغلقة ولا يمكن الرد عليها' : (dictionary?.titles?.reply_to_notices)}
              value={message}
              disabled={selectedDept.notice_type === '7'}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}

              InputProps={{
                disableUnderline: true,
                disabled: mode === "show" ? true : false,
                sx: {
                  fontSize: '0.95rem',
                  px: 1
                }
              }}
            />
            {mode !== "show" && (
              <Shared.IconButton
                onClick={handleSendMessage}
                disabled={!message.trim() || selectedDept.notice_type === '7'}
                sx={{
                  bgcolor: message.trim() ? 'primary.main' : 'action.disabledBackground',
                  color: message.trim() ? 'white' : 'text.disabled',
                  borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                  width: 48,
                  height: 48,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <Shared.Box component="span" className="ri-send-plane-2-fill" sx={{ fontSize: '22px' }} />
              </Shared.IconButton>
            )}

          </Shared.Box>
        </Shared.Box>
      </Shared.Grid>
    </Shared.Grid >
  )
}

export default NoticeReplyingChat
