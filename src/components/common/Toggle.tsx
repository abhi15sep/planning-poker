import { cn } from '../../utils/cn'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Toggle({
  enabled,
  onChange,
  label,
  disabled = false,
}: ToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          enabled
            ? 'bg-primary-600 dark:bg-primary-500'
            : 'bg-gray-200 dark:bg-gray-700'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            'translate-y-0.5',
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  )
}
