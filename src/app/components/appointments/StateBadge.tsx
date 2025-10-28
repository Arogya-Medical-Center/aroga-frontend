'use client';

type AppointmentStatus = 'scheduled' | 'pending' | 'completed' |  'cancelled';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  try {
    // Map statuses to Tailwind utility classes so the badge looks like a small button
    const statusConfig: Record<AppointmentStatus, { label: string; classes: string; icon: string }> = {
      scheduled: { label: 'Scheduled', classes: 'bg-green-500 text-white border border-green-500', icon: 'check-circle' },
      pending: { label: 'Pending', classes: 'bg-yellow-500 text-white border border-yellow-500', icon: 'clock' },
      completed: { label: 'Completed', classes: 'bg-blue-500 text-white border border-blue-500', icon: 'check-circle-2' },
     // noshow: { label: 'No-show', classes: 'bg-gray-500 text-white border border-gray-500', icon: 'x-circle' },
      cancelled: { label: 'Cancelled', classes: 'bg-red-500 text-white border border-red-500', icon: 'ban' }
    };

    const cfg = statusConfig[status as AppointmentStatus] ?? statusConfig.pending;

    return (
      <button
        type="button"
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium ${cfg.classes}`}
        data-name="status-badge"
        aria-label={`status-${status}`}
      >
        <div className={`icon-${cfg.icon} text-xs`} />
        <span>{cfg.label}</span>
      </button>
    );
  } catch (error) {
    console.error('StatusBadge component error:', error);
    return null;
  }
}

export default StatusBadge;