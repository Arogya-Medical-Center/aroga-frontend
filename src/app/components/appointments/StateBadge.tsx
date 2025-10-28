'use client';

type AppointmentStatus = 'scheduled' | 'pending' | 'completed' | 'noshow' | 'cancelled';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  try {
    const statusConfig: Record<
      AppointmentStatus,
      { label: string; className: string; icon: string }
    > = {
      scheduled: { label: 'Scheduled', className: 'status-scheduled', icon: 'check-circle' },
      pending: { label: 'Pending', className: 'status-pending', icon: 'clock' },
      completed: { label: 'Completed', className: 'status-completed', icon: 'check-circle-2' },
      noshow: { label: 'No-show', className: 'status-noshow', icon: 'x-circle' },
      cancelled: { label: 'Cancelled', className: 'status-cancelled', icon: 'ban' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`status-badge ${config.className}`} data-name="status-badge" data-file="components/StatusBadge.js">
        <div className={`icon-${config.icon} text-xs mr-1`}></div>
        {config.label}
      </span>
    );
  } catch (error) {
    console.error('StatusBadge component error:', error);
    return null;
  }
}

export default StatusBadge;