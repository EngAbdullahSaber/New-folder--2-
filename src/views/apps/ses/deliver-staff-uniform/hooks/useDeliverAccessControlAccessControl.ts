import * as Shared from '@/shared'

export const useDeliverAccessControl = (
  dataModel: any,
  scope: string,
  setError: (error: string | null) => void,
  setWarning: (warning: string | null) => void
) => {
  console.log(dataModel)
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

    // ✅ PART 1: Access Control (Scope: user)
    if (scope === 'user') {
      const uniformApprovalNumber = dataModel?.contract_sign_approval_number
      const uniformApprovalStatus = dataModel?.contract_sign_approval_status

      const hasUniformApproval =
        uniformApprovalNumber !== null && uniformApprovalNumber !== undefined && uniformApprovalNumber !== ''

      const isApproved = uniformApprovalStatus === 1 || uniformApprovalStatus === '1'
      const isRejected = uniformApprovalStatus === 2 || uniformApprovalStatus === '2'

      console.log(hasUniformApproval, isRejected, isApproved)
      if (!hasUniformApproval || isRejected) {
        const message =
          locale === 'ar'
            ? 'ليس لديك زي جاهز للاستلام. يجب الحصول على موافقة توقيع العقد أولاً'
            : 'You do not have a uniform ready for delivery. Please get contract signature approval first'

        setWarning(message)
        setCurrentMessage(message)
        setMessageType('warning')
        setShouldBlockAccess(true)
      } else if (hasUniformApproval && isApproved) {
        setShouldBlockAccess(false)
      } else {
        const message =
          locale === 'ar' ? 'طلب استلام الزي الخاص بك قيد المراجعة' : 'Your uniform delivery request is under review'

        setWarning(message)
        setCurrentMessage(message)
        setMessageType('warning')
        setShouldBlockAccess(true)
      }
    } else {
      setShouldBlockAccess(false)
    }

    // ✅ PART 2: Lock Logic (Scope: all)
    const empUniformStatus = dataModel?.emp_contract_sign_approval_status
    const empUniformNumber = dataModel?.emp_contract_sign_approval_number

    const hasEmpUniform = empUniformNumber !== null && empUniformNumber !== undefined && empUniformNumber !== ''

    const isEmpAccepted = hasEmpUniform && (empUniformStatus === 1 || empUniformStatus === '1')
    const isEmpRejected = hasEmpUniform && (empUniformStatus === 2 || empUniformStatus === '2')
    const isEmpPending =
      hasEmpUniform &&
      empUniformStatus !== 1 &&
      empUniformStatus !== '1' &&
      empUniformStatus !== 2 &&
      empUniformStatus !== '2'

    const shouldLock = isEmpAccepted || isEmpRejected
    setIsLocked(shouldLock)

    // ✅ Warnings for employee uniform delivery status
    if (isEmpAccepted) {
      const message =
        locale === 'ar'
          ? 'لقد قمت باستلام الزي بالفعل. لا يمكن التعديل'
          : 'You have already received the uniform. Cannot edit'

      setWarning(message)
      setCurrentMessage(message)
      setMessageType('warning')
    } else if (isEmpRejected) {
      const message =
        locale === 'ar'
          ? 'لقد قمت برفض استلام الزي. لا يمكن التعديل'
          : 'You have rejected receiving the uniform. Cannot edit'

      setWarning(message)
      setCurrentMessage(message)
      setMessageType('warning')
    } else if (isEmpPending) {
      const message = locale === 'ar' ? 'طلب استلام الزي قيد المراجعة' : 'Uniform delivery is under review'

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
