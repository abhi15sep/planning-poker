import { useState } from 'react'
import { Button, Card, Modal } from '../common'
import type { Deck } from '../../types'

interface ModeratorControlsProps {
  isRevealed: boolean
  hasVotes: boolean
  onReveal: () => void
  onReset: () => void
  onComplete: (points: string) => void
  deck: Deck
}

export default function ModeratorControls({
  isRevealed,
  hasVotes,
  onReveal,
  onReset,
  onComplete,
  deck,
}: ModeratorControlsProps) {
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedPoints, setSelectedPoints] = useState<string>('')

  const handleComplete = () => {
    if (selectedPoints) {
      onComplete(selectedPoints)
      setShowCompleteModal(false)
      setSelectedPoints('')
    }
  }

  return (
    <>
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Moderator Controls
        </h3>
        <div className="flex flex-wrap gap-3">
          {!isRevealed ? (
            <Button onClick={onReveal} disabled={!hasVotes}>
              Reveal Cards
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={onReset}>
                Vote Again
              </Button>
              <Button onClick={() => setShowCompleteModal(true)}>
                Complete Story
              </Button>
            </>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Story"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Select the final estimate for this story:
          </p>
          <div className="flex flex-wrap gap-2">
            {deck.cards
              .filter((c) => !c.isSpecial)
              .map((card) => (
                <button
                  key={card.value}
                  onClick={() => setSelectedPoints(card.value)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    selectedPoints === card.value
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                  }`}
                >
                  {card.label}
                </button>
              ))}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowCompleteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete} disabled={!selectedPoints}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
