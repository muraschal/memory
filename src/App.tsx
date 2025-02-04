import { useState, useEffect } from 'react'
import './App.css'
import { Card } from './types'
import { playSound } from './sounds'

function App() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<Card[]>([])
  const [isLocked, setIsLocked] = useState(false)

  const cardImages: Array<{emoji: string, name: string}> = [
    { emoji: '🐶', name: 'Hund' },
    { emoji: '🐱', name: 'Katze' },
    { emoji: '🐭', name: 'Maus' },
    { emoji: '🐹', name: 'Hamster' },
    { emoji: '🐰', name: 'Hase' },
    { emoji: '🦊', name: 'Fuchs' },
    { emoji: '🐻', name: 'Bär' },
    { emoji: '🐼', name: 'Panda' }
  ]

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = (): void => {
    const duplicatedCards = [...cardImages, ...cardImages]
    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards.map((content, index) => ({
      id: index,
      content: content.emoji,
      name: content.name,
      isFlipped: false,
      isMatched: false
    })))
  }

  const handleCardClick = (clickedCard: Card): void => {
    if (isLocked || clickedCard.isFlipped || clickedCard.isMatched) {
      return
    }

    const newCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    )
    
    setCards(newCards)
    playSound('flip')
    
    const updatedFlippedCards = [...flippedCards, clickedCard]
    setFlippedCards(updatedFlippedCards)

    if (updatedFlippedCards.length === 2) {
      setIsLocked(true)
      
      if (updatedFlippedCards[0].content === updatedFlippedCards[1].content) {
        setTimeout(() => {
          playSound('match')
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === updatedFlippedCards[0].id || card.id === updatedFlippedCards[1].id
                ? { ...card, isMatched: true }
                : card
            )
          )
          setFlippedCards([])
          setIsLocked(false)
          
          if (cards.every(card => card.isMatched)) {
            setTimeout(() => {
              playSound('victory')
            }, 300)
          }
        }, 300)
      } else {
        setTimeout(() => {
          playSound('wrong')
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === updatedFlippedCards[0].id || card.id === updatedFlippedCards[1].id
                ? { ...card, isFlipped: false }
                : card
            )
          )
          setFlippedCards([])
          setIsLocked(false)
        }, 800)
      }
    }
  }

  return (
    <div className="app">
      <h1>Memory Spiel</h1>
      <div className="card-grid">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back" data-content={card.content}>
                <span className="animal-name">{card.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
