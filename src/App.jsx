import { useState } from 'react'
import CreatureBuilder from './components/CreatureBuilder'
import BattleArena from './components/BattleArena'
import CreatureGallery from './components/CreatureGallery'
import './App.css'

function App() {
  const [view, setView] = useState('builder')
  const [creatures, setCreatures] = useState([])
  const [currentCreature, setCurrentCreature] = useState(null)

  const saveCreature = (creature) => {
    const newCreature = { ...creature, id: Date.now() }
    setCreatures([...creatures, newCreature])
    alert(`${creature.name} saved!`)
  }

  const selectCreatureForBattle = (creature) => {
    setCurrentCreature(creature)
    setView('battle')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🦖 Creature Creator 🤖</h1>
        <nav>
          <button
            className={view === 'builder' ? 'active' : ''}
            onClick={() => setView('builder')}
          >
            Build
          </button>
          <button
            className={view === 'gallery' ? 'active' : ''}
            onClick={() => setView('gallery')}
          >
            Gallery ({creatures.length})
          </button>
          <button
            className={view === 'battle' ? 'active' : ''}
            onClick={() => setView('battle')}
            disabled={creatures.length < 2}
          >
            Battle Arena
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'builder' && (
          <CreatureBuilder onSave={saveCreature} />
        )}
        {view === 'gallery' && (
          <CreatureGallery
            creatures={creatures}
            onSelectForBattle={selectCreatureForBattle}
            onDelete={(id) => setCreatures(creatures.filter(c => c.id !== id))}
          />
        )}
        {view === 'battle' && (
          <BattleArena
            creatures={creatures}
            selectedCreature={currentCreature}
          />
        )}
      </main>
    </div>
  )
}

export default App
