import type { Deck, CardValue, DeckType } from '../types'

const scrumCards: CardValue[] = [
  { value: '0', label: '0' },
  { value: '0.5', label: '1/2' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '5', label: '5' },
  { value: '8', label: '8' },
  { value: '13', label: '13' },
  { value: '20', label: '20' },
  { value: '40', label: '40' },
  { value: '100', label: '100' },
  { value: '?', label: '?', isSpecial: true },
  { value: 'coffee', label: '☕', isSpecial: true },
]

const fibonacciCards: CardValue[] = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '5', label: '5' },
  { value: '8', label: '8' },
  { value: '13', label: '13' },
  { value: '21', label: '21' },
  { value: '34', label: '34' },
  { value: '55', label: '55' },
  { value: '89', label: '89' },
  { value: '?', label: '?', isSpecial: true },
  { value: 'coffee', label: '☕', isSpecial: true },
]

const sequentialCards: CardValue[] = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '?', label: '?', isSpecial: true },
  { value: 'coffee', label: '☕', isSpecial: true },
]

const tshirtCards: CardValue[] = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: '?', label: '?', isSpecial: true },
  { value: 'coffee', label: '☕', isSpecial: true },
]

export const decks: Record<DeckType, Deck> = {
  scrum: {
    name: 'Scrum',
    type: 'scrum',
    cards: scrumCards,
  },
  fibonacci: {
    name: 'Fibonacci',
    type: 'fibonacci',
    cards: fibonacciCards,
  },
  sequential: {
    name: 'Sequential',
    type: 'sequential',
    cards: sequentialCards,
  },
  tshirt: {
    name: 'T-Shirt Sizes',
    type: 'tshirt',
    cards: tshirtCards,
  },
}

export const getDeck = (type: DeckType): Deck => {
  return decks[type] || decks.fibonacci
}

export const getDeckOptions = () => {
  return Object.values(decks).map((deck) => ({
    value: deck.type,
    label: deck.name,
  }))
}

export const isNumericValue = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value))
}

export const parseCardValue = (value: string): number | null => {
  if (isNumericValue(value)) {
    return parseFloat(value)
  }
  return null
}
