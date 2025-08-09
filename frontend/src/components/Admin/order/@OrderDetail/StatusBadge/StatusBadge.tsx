import { getVietnameseStatus } from '../../../../../utils/constant'

interface StatusBadgeProps {
    status: 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled' | 'processing'
}

function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusClasses = (status: string) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"
        
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`
            case 'preparing':
                return `${baseClasses} bg-orange-100 text-orange-800`
            case 'shipping':
                return `${baseClasses} bg-blue-100 text-blue-800`
            case 'delivered':
                return `${baseClasses} bg-green-100 text-green-800`
            case 'cancelled':
                return `${baseClasses} bg-red-100 text-red-800`
            case 'processing':
                return `${baseClasses} bg-purple-100 text-purple-800`
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`
        }
    }
    
    return (
        <span className={getStatusClasses(status)}>
            {getVietnameseStatus(status)}
        </span>
    )
}

export default StatusBadge
