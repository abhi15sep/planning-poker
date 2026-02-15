import { Link } from 'react-router-dom'
import { Button } from '../components/common'

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-8xl mb-6">🃏</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Looks like this card got shuffled into the wrong deck.
      </p>
      <Link to="/">
        <Button size="lg">Go Home</Button>
      </Link>
    </div>
  )
}
