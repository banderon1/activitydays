import { useState, useEffect } from 'react'
import CreatureCanvas from './CreatureCanvas'
import './BattleArena.css'

function BattleArena({ creatures, selectedCreature }) {
  const [fighter1, setFighter1] = useState(selectedCreature || null)
  const [fighter2, setFighter2] = useState(null)
  const [battleState, setBattleState] = useState('select') // select, fighting, finished
  const [currentHP1, setCurrentHP1] = useState(100)
  const [currentHP2, setCurrentHP2] = useState(100)
  const [battleLog, setBattleLog] = useState([])
  const [winner, setWinner] = useState(null)
  const [turn, setTurn] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (selectedCreature) {
      setFighter1(selectedCreature)
    }
  }, [selectedCreature])

  const selectFighter = (creature, position) => {
    if (position === 1) {
      setFighter1(creature)
      setCurrentHP1(creature.health)
    } else {
      setFighter2(creature)
      setCurrentHP2(creature.health)
    }
  }

  const addLog = (message) => {
    setBattleLog(prev => [...prev, message])
  }

  const calculateDamage = (attacker, defender) => {
    // Base damage from strength
    let damage = attacker.strength * 2

    // Add random variation (80-120% of base damage)
    damage = Math.floor(damage * (0.8 + Math.random() * 0.4))

    // Reduce by defender's defense
    damage = Math.max(1, damage - defender.defense)

    // Speed affects critical hit chance
    const critChance = attacker.speed / 100
    if (Math.random() < critChance) {
      damage = Math.floor(damage * 1.5)
      return { damage, isCrit: true }
    }

    return { damage, isCrit: false }
  }

  const startBattle = () => {
    if (!fighter1 || !fighter2) {
      alert('Select two creatures to battle!')
      return
    }

    if (fighter1.id === fighter2.id) {
      alert('A creature cannot battle itself!')
      return
    }

    setBattleState('fighting')
    setCurrentHP1(fighter1.health)
    setCurrentHP2(fighter2.health)
    setBattleLog([`⚔️ ${fighter1.name} vs ${fighter2.name} - Battle begins!`])
    setWinner(null)
    setTurn(1)
  }

  const executeTurn = () => {
    if (isAnimating) return

    setIsAnimating(true)

    // Determine who attacks first based on speed
    let attacker, defender, setAttackerHP, setDefenderHP, attackerHP, defenderHP

    if (turn % 2 === 1) {
      // Fighter 1's turn
      attacker = fighter1
      defender = fighter2
      attackerHP = currentHP1
      defenderHP = currentHP2
      setDefenderHP = setCurrentHP2
    } else {
      // Fighter 2's turn
      attacker = fighter2
      defender = fighter1
      attackerHP = currentHP2
      defenderHP = currentHP1
      setDefenderHP = setCurrentHP1
    }

    const { damage, isCrit } = calculateDamage(attacker, defender)
    const newHP = Math.max(0, defenderHP - damage)

    setDefenderHP(newHP)

    const critText = isCrit ? ' 💥 CRITICAL HIT!' : ''
    addLog(`${attacker.name} attacks ${defender.name} for ${damage} damage!${critText}`)

    setTimeout(() => {
      if (newHP <= 0) {
        setBattleState('finished')
        setWinner(attacker)
        addLog(`🏆 ${attacker.name} wins the battle!`)
      } else {
        setTurn(turn + 1)
      }
      setIsAnimating(false)
    }, 500)
  }

  const resetBattle = () => {
    setBattleState('select')
    setFighter1(null)
    setFighter2(null)
    setCurrentHP1(100)
    setCurrentHP2(100)
    setBattleLog([])
    setWinner(null)
    setTurn(1)
  }

  const availableCreatures = creatures.filter(c => {
    if (!fighter1) return true
    if (!fighter2) return c.id !== fighter1.id
    return false
  })

  return (
    <div className="battle-arena">
      <h2>⚔️ Battle Arena</h2>

      {battleState === 'select' && (
        <div className="creature-selection">
          <div className="selection-column">
            <h3>Fighter 1</h3>
            {fighter1 ? (
              <div className="selected-fighter">
                <CreatureCanvas creature={fighter1} size={200} />
                <h4>{fighter1.name}</h4>
                <button onClick={() => setFighter1(null)}>Change</button>
              </div>
            ) : (
              <div className="creature-grid">
                {creatures.map(creature => (
                  <div
                    key={creature.id}
                    className="creature-card"
                    onClick={() => selectFighter(creature, 1)}
                  >
                    <CreatureCanvas creature={creature} size={100} />
                    <p>{creature.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="vs-divider">VS</div>

          <div className="selection-column">
            <h3>Fighter 2</h3>
            {fighter2 ? (
              <div className="selected-fighter">
                <CreatureCanvas creature={fighter2} size={200} />
                <h4>{fighter2.name}</h4>
                <button onClick={() => setFighter2(null)}>Change</button>
              </div>
            ) : (
              <div className="creature-grid">
                {availableCreatures.map(creature => (
                  <div
                    key={creature.id}
                    className="creature-card"
                    onClick={() => selectFighter(creature, 2)}
                  >
                    <CreatureCanvas creature={creature} size={100} />
                    <p>{creature.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {battleState === 'select' && fighter1 && fighter2 && (
        <button className="start-battle-btn" onClick={startBattle}>
          ⚔️ Start Battle!
        </button>
      )}

      {(battleState === 'fighting' || battleState === 'finished') && (
        <div className="battle-screen">
          <div className="fighters">
            <div className="fighter">
              <CreatureCanvas creature={fighter1} size={200} />
              <h3>{fighter1.name}</h3>
              <div className="health-bar">
                <div
                  className="health-fill"
                  style={{ width: `${(currentHP1 / fighter1.health) * 100}%` }}
                ></div>
              </div>
              <p className="hp-text">{currentHP1} / {fighter1.health} HP</p>
              <div className="stats-mini">
                <span>💪 {fighter1.strength}</span>
                <span>⚡ {fighter1.speed}</span>
                <span>🛡️ {fighter1.defense}</span>
              </div>
            </div>

            <div className="battle-vs">VS</div>

            <div className="fighter">
              <CreatureCanvas creature={fighter2} size={200} />
              <h3>{fighter2.name}</h3>
              <div className="health-bar">
                <div
                  className="health-fill"
                  style={{ width: `${(currentHP2 / fighter2.health) * 100}%` }}
                ></div>
              </div>
              <p className="hp-text">{currentHP2} / {fighter2.health} HP</p>
              <div className="stats-mini">
                <span>💪 {fighter2.strength}</span>
                <span>⚡ {fighter2.speed}</span>
                <span>🛡️ {fighter2.defense}</span>
              </div>
            </div>
          </div>

          <div className="battle-controls">
            {battleState === 'fighting' && (
              <button
                className="attack-btn"
                onClick={executeTurn}
                disabled={isAnimating}
              >
                {isAnimating ? '...' : turn % 2 === 1 ? `${fighter1.name} Attack!` : `${fighter2.name} Attack!`}
              </button>
            )}
            {battleState === 'finished' && (
              <div className="winner-announcement">
                <h2>🏆 {winner.name} Wins! 🏆</h2>
                <button className="new-battle-btn" onClick={resetBattle}>
                  New Battle
                </button>
              </div>
            )}
          </div>

          <div className="battle-log">
            <h4>Battle Log</h4>
            <div className="log-entries">
              {battleLog.map((entry, index) => (
                <div key={index} className="log-entry">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {creatures.length < 2 && battleState === 'select' && (
        <div className="no-creatures">
          <p>You need at least 2 creatures to battle!</p>
          <p>Go to the Build tab to create more creatures.</p>
        </div>
      )}
    </div>
  )
}

export default BattleArena
