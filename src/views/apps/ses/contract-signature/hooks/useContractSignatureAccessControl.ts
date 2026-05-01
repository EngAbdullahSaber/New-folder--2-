import * as Shared from '@/shared'

export const useContractSignatureAccessControl = (
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

    // ✅ PART 1: Access Control (Scope: user)
    if (scope === 'user') {
      const contractSignApprovalNumber = dataModel?.contract_sign_approval_number
      const contractSignApprovalStatus = dataModel?.contract_sign_approval_status
      const hrApprovalStatus = dataModel?.hr_approval_status
      const hasContractSignAuto = contractSignApprovalNumber == null && dataModel?.hr_approval_number !== 'null'

      const isApproved = hrApprovalStatus === 1 || hrApprovalStatus === '1'
      const isRejected = hrApprovalStatus === 2 || hrApprovalStatus === '2'

      if (!hasContractSignAuto || isRejected) {
        const message =
          locale === 'ar'
            ? 'ليس لديك عقد جاهز للتوقيع. يجب الحصول على موافقة توقيع العقد أولاً'
            : 'You do not have a contract ready for signing. Please get contract signature approval first'

        setWarning(message)
        setCurrentMessage(message)
        setMessageType('warning')
        setShouldBlockAccess(true)
      } else if (hasContractSignAuto && isApproved) {
        setShouldBlockAccess(false)
      } else {
        const message =
          locale === 'ar' ? 'طلب توقيع العقد الخاص بك قيد المراجعة' : 'Your contract signature request is under review'

        setWarning(message)
        setCurrentMessage(message)
        setMessageType('warning')
        setShouldBlockAccess(true)
      }
    } else {
      setShouldBlockAccess(false)
    }

    // ✅ PART 2: Lock Logic (Scope: all)
    const empContractSignStatus = dataModel?.emp_contract_sign_approval_status
    const empContractSignNumber = dataModel?.emp_contract_sign_approval_number

    const hasEmpContractSign =
      empContractSignNumber !== null && empContractSignNumber !== undefined && empContractSignNumber !== ''

    const isEmpAccepted = hasEmpContractSign && (empContractSignStatus === 1 || empContractSignStatus === '1')
    const isEmpRejected = hasEmpContractSign && (empContractSignStatus === 2 || empContractSignStatus === '2')
    const isEmpPending =
      hasEmpContractSign &&
      empContractSignStatus !== 1 &&
      empContractSignStatus !== '1' &&
      empContractSignStatus !== 2 &&
      empContractSignStatus !== '2'

    const shouldLock = isEmpAccepted || isEmpRejected
    setIsLocked(shouldLock)

    // ✅ Warnings for employee contract sign status
    if (isEmpAccepted) {
      const message =
        locale === 'ar'
          ? 'لقد قمت بتوقيع العقد بالفعل. لا يمكن التعديل'
          : 'You have already signed the contract. Cannot edit'

      setWarning(message)
      setCurrentMessage(message)
      setMessageType('warning')
    } else if (isEmpRejected) {
      const message =
        locale === 'ar'
          ? 'لقد قمت برفض توقيع العقد. لا يمكن التعديل'
          : 'You have rejected signing the contract. Cannot edit'

      setWarning(message)
      setCurrentMessage(message)
      setMessageType('warning')
    } else if (isEmpPending) {
      const message = locale === 'ar' ? 'طلب توقيع العقد قيد المراجعة' : 'Contract signature is under review'

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
