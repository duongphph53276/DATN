import { stateOrder } from '../interfaces/orderApi'

export const ORDER_STATUS_FLOW = {
  PENDING: 0,
  PREPARING: 1,
  SHIPPING: 2,
  DELIVERED: 3,
  CANCELLED: 4,
} as const

export const getStatusLevel = (status: stateOrder['status']): number => {
  const statusMap: Record<string, number> = {
    'pending': ORDER_STATUS_FLOW.PENDING,
    'preparing': ORDER_STATUS_FLOW.PREPARING,
    'shipping': ORDER_STATUS_FLOW.SHIPPING,
    'delivered': ORDER_STATUS_FLOW.DELIVERED,
    'cancelled': ORDER_STATUS_FLOW.CANCELLED,
  }
  return statusMap[status] ?? -1
}

export const canChangeStatus = (
  currentStatus: stateOrder['status'], 
  newStatus: stateOrder['status']
): boolean => {
  const currentLevel = getStatusLevel(currentStatus)
  const newLevel = getStatusLevel(newStatus)

  if (currentLevel === -1 || newLevel === -1) {
    return false
  }

  if (currentLevel === ORDER_STATUS_FLOW.DELIVERED || currentLevel === ORDER_STATUS_FLOW.CANCELLED) {
    return false
  }

  if (newLevel < currentLevel && newLevel !== ORDER_STATUS_FLOW.CANCELLED) {
    return false
  }

  if (newLevel === ORDER_STATUS_FLOW.CANCELLED) {
    return currentLevel < ORDER_STATUS_FLOW.DELIVERED
  }

  return true
}

export const getAvailableStatuses = (
  currentStatus: stateOrder['status'], 
  allStatuses: string[]
): string[] => {
  const availableStatuses = allStatuses.filter(status => 
    canChangeStatus(currentStatus, status as stateOrder['status'])
  )
    if (!availableStatuses.includes(currentStatus)) {
    availableStatuses.unshift(currentStatus)
  }
  
  return availableStatuses
}


export const getStatusChangeErrorMessage = (
  currentStatus: stateOrder['status'], 
  newStatus: stateOrder['status']
): string => {
  const currentLevel = getStatusLevel(currentStatus)
  const newLevel = getStatusLevel(newStatus)

  if (currentLevel === ORDER_STATUS_FLOW.DELIVERED) {
    return 'Đơn hàng đã giao thành công, không thể thay đổi trạng thái!'
  }

  if (currentLevel === ORDER_STATUS_FLOW.CANCELLED) {
    return 'Đơn hàng đã bị hủy, không thể thay đổi trạng thái!'
  }

  if (newLevel < currentLevel && newLevel !== ORDER_STATUS_FLOW.CANCELLED) {
    return 'Không thể quay lại trạng thái trước đó!'
  }

  if (newLevel === ORDER_STATUS_FLOW.CANCELLED && currentLevel >= ORDER_STATUS_FLOW.DELIVERED) {
    return 'Không thể hủy đơn hàng đã được giao!'
  }

  return 'Không thể thay đổi sang trạng thái này!'
}