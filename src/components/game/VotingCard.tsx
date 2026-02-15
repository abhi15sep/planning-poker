import { cn } from '../../utils/cn'
import type { CardValue } from '../../types'

interface VotingCardProps {
  card: CardValue
  isSelected?: boolean
  isDisabled?: boolean
  onClick?: () => void
}

export default function VotingCard({
  card,
  isSelected = false,
  isDisabled = false,
  onClick,
}: VotingCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'relative w-14 h-20 sm:w-16 sm:h-24 rounded-xl font-bold text-lg sm:text-xl',
        'flex items-center justify-center',
        'border-2 transition-all duration-200 ease-out',
        'shadow-sm hover:shadow-md',
        'transform-gpu',
        isSelected
          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-500 -translate-y-2 shadow-lg shadow-primary-500/30 scale-105'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600',
        !isDisabled && !isSelected && 'hover:border-primary-400 hover:-translate-y-1 hover:shadow-primary-500/10',
        isDisabled && 'opacity-50 cursor-not-allowed',
        card.isSpecial && !isSelected && 'text-primary-600 dark:text-primary-400'
      )}
    >
      <span className={cn(
        'transition-transform duration-200',
        isSelected && 'scale-110'
      )}>
        {card.label}
      </span>
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  )
}
