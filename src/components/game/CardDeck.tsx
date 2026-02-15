import type { CardValue } from '../../types'
import VotingCard from './VotingCard'

interface CardDeckProps {
  cards: CardValue[]
  selectedValue: string | null
  onSelect: (value: string) => void
  disabled?: boolean
}

export default function CardDeck({
  cards,
  selectedValue,
  onSelect,
  disabled = false,
}: CardDeckProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      {cards.map((card) => (
        <VotingCard
          key={card.value}
          card={card}
          isSelected={selectedValue === card.value}
          isDisabled={disabled}
          onClick={() => onSelect(card.value)}
        />
      ))}
    </div>
  )
}
