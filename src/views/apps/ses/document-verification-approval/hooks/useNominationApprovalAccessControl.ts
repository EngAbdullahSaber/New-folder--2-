import * as Shared from '@/shared'

export const useNominationApprovalAccessControl = (
  dataModel: any,
  scope: string,
  setError: (error: string | null) => void,
  setWarning: (warning: string | null) => void
) => {
  const [shouldBlockAccess, setShouldBlockAccess] = Shared.useState(false)
  const [isLocked, setIsLocked] = Shared.useState(false)
  const [currentMessage, setCurrentMessage] = Shared.useState<string | null>(null)
  const [messageType, setMessageType] = Shared.useState<'error' | 'warning' | null>(null)
  const { lang: locale } = Shared.useParams()

  Shared.useEffect(() => {
    // ✅ Clear previous states
    setWarning(null)
    setError(null)
    setCurrentMessage(null)
    setMessageType(null)

    if (!dataModel) {
      setShouldBlockAccess(false)
      setIsLocked(false)
      return
    }
    console.log(scope)
    // ✅ PART 1: Access Control (للمستخدمين فقط - scope === 'user')
    if (scope === 'user') {
      const nominationApprovalNumber = dataModel?.nomination_approval_number
      const nominationApprovalStatus = dataModel?.nomination_approval_status

      const hasNominationApproval =
        nominationApprovalNumber !== null && nominationApprovalNumber !== undefined && nominationApprovalNumber !== ''

      const isApproved = nominationApprovalStatus === 1 || nominationApprovalStatus === '1'
      const isRejected = nominationApprovalStatus === 2 || nominationApprovalStatus === '2'

      if (!hasNominationApproval || isRejected) {
        const message =
          locale === 'ar'
            ? 'ليس لديك طلب ترشيح معتمد. يجب الحصول على موافقة الترشيح أولاً'
            : 'You do not have an approved nomination. Please get nomination approval first'

        setWarning(message)
        setCurrentMessage(message)
        setMessageType('warning')
        setShouldBlockAccess(true)
      } else if (hasNominationApproval && isApproved) {
        setShouldBlockAccess(false)
      } else {
        const message =
          locale === 'ar' ? 'طلب الترشيح الخاص بك قيد المراجعة' : 'Your nomination request is under review'

        setWarning(message)
        setCurrentMessage(message)
        setMessageType('warning')
        setShouldBlockAccess(true)
      }
    } else {
      setShouldBlockAccess(false)
    }

    // ✅ PART 2: Lock Logic (للجميع - user & department)
    const empNominationNumber = dataModel?.emp_nomination_approval_number
    const empNominationStatus = dataModel?.emp_nomination_approval_status

    const hasEmpNomination =
      empNominationNumber !== null && empNominationNumber !== undefined && empNominationNumber !== ''

    const isEmpAccepted = hasEmpNomination && (empNominationStatus === 1 || empNominationStatus === '1')
    const isEmpRejected = hasEmpNomination && (empNominationStatus === 2 || empNominationStatus === '2')
    const isEmpPending =
      hasEmpNomination &&
      empNominationStatus !== 1 &&
      empNominationStatus !== '1' &&
      empNominationStatus !== 2 &&
      empNominationStatus !== '2'

    const shouldLock = isEmpAccepted || isEmpRejected

    setIsLocked(shouldLock)

    // ✅ Override message if employee nomination has status
    if (isEmpAccepted && scope == 'user') {
      const message =
        locale === 'ar'
          ? 'تم قبول طلب ترشيح هذا الموظف، لا يمكن التعديل'
          : 'This employee nomination request has been accepted. Cannot edit'

      setWarning(message)
      setCurrentMessage(message)
      setMessageType('warning')
    } else if (isEmpRejected && scope == 'user') {
      const message =
        locale === 'ar'
          ? 'تم رفض طلب ترشيح هذا الموظف، لا يمكن التعديل'
          : 'This employee nomination request has been rejected. Cannot edit'

      setWarning(message)
      setCurrentMessage(message)
      setMessageType('warning')
    } else if (isEmpPending && scope == 'user') {
      const message = locale === 'ar' ? 'طلب ترشيح الموظفين قيد المراجعة' : 'Employee nomination is under review'

      setWarning(message)
      setCurrentMessage(message)
      setMessageType('warning')
    }
  }, [dataModel, scope, setWarning, setError, locale])

  return {
    shouldBlockAccess,
    isLocked,
    currentMessage,
    messageType
  }
}
