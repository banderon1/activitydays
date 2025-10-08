import { useState, useRef, useEffect } from 'react'
import CreatureCanvas from './CreatureCanvas'
import './CreatureBuilder.css'

const bodyTypes = ['round', 'square', 'triangle', 'blob']
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
const eyeTypes = ['dots', 'angry', 'googly', 'laser']
const mouthTypes = ['smile', 'fangs', 'straight', 'roar']
const armTypes = ['none', 'small', 'long', 'claws']
const legTypes = ['none', 'stumpy', 'tall', 'wheels']
const accessoryTypes = ['none', 'horns', 'antenna', 'spikes', 'crown']

function CreatureBuilder({ onSave }) {
  const [creature, setCreature] = useState({
    name: '',
    bodyType: 'round',
    color: colors[0],
    eyeType: 'dots',
    mouthType: 'smile',
    armType: 'small',
    legType: 'stumpy',
    accessory: 'none',
    // Stats based on parts
    strength: 5,
    speed: 5,
    defense: 5,
    health: 100
  })

  // Calculate stats based on creature parts
  useEffect(() => {
    let strength = 5
    let speed = 5
    let defense = 5

    // Body type affects defense
    if (creature.bodyType === 'square') defense += 3
    if (creature.bodyType === 'round') defense += 2
    if (creature.bodyType === 'triangle') speed += 2
    if (creature.bodyType === 'blob') defense += 1

    // Arms affect strength
    if (creature.armType === 'claws') strength += 4
    if (creature.armType === 'long') strength += 2
    if (creature.armType === 'small') strength += 1

    // Legs affect speed
    if (creature.legType === 'wheels') speed += 4
    if (creature.legType === 'tall') speed += 3
    if (creature.legType === 'stumpy') speed += 1

    // Accessories provide bonuses
    if (creature.accessory === 'horns') strength += 2
    if (creature.accessory === 'spikes') defense += 2
    if (creature.accessory === 'antenna') speed += 2
    if (creature.accessory === 'crown') { strength += 1; defense += 1; speed += 1 }

    setCreature(prev => ({
      ...prev,
      strength,
      speed,
      defense,
      health: 100
    }))
  }, [creature.bodyType, creature.armType, creature.legType, creature.accessory])

  const updateCreature = (key, value) => {
    setCreature(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (!creature.name.trim()) {
      alert('Please give your creature a name!')
      return
    }
    onSave(creature)
    // Reset to create new creature
    setCreature({
      name: '',
      bodyType: 'round',
      color: colors[0],
      eyeType: 'dots',
      mouthType: 'smile',
      armType: 'small',
      legType: 'stumpy',
      accessory: 'none',
      strength: 5,
      speed: 5,
      defense: 5,
      health: 100
    })
  }

  const randomize = () => {
    setCreature(prev => ({
      ...prev,
      bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      eyeType: eyeTypes[Math.floor(Math.random() * eyeTypes.length)],
      mouthType: mouthTypes[Math.floor(Math.random() * mouthTypes.length)],
      armType: armTypes[Math.floor(Math.random() * armTypes.length)],
      legType: legTypes[Math.floor(Math.random() * legTypes.length)],
      accessory: accessoryTypes[Math.floor(Math.random() * accessoryTypes.length)]
    }))
  }

  return (
    <div className="creature-builder">
      <div className="builder-left">
        <div className="canvas-container">
          <CreatureCanvas creature={creature} />
        </div>

        <div className="stats-panel">
          <h3>Stats</h3>
          <div className="stat">
            <span>💪 Strength:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${creature.strength * 5}%` }}></div>
            </div>
            <span>{creature.strength}</span>
          </div>
          <div className="stat">
            <span>⚡ Speed:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${creature.speed * 5}%` }}></div>
            </div>
            <span>{creature.speed}</span>
          </div>
          <div className="stat">
            <span>🛡️ Defense:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${creature.defense * 5}%` }}></div>
            </div>
            <span>{creature.defense}</span>
          </div>
          <div className="stat">
            <span>❤️ Health:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${creature.health}%` }}></div>
            </div>
            <span>{creature.health}</span>
          </div>
        </div>
      </div>

      <div className="builder-right">
        <h2>Build Your Creature</h2>

        <div className="control-group">
          <label>Name:</label>
          <input
            type="text"
            value={creature.name}
            onChange={(e) => updateCreature('name', e.target.value)}
            placeholder="Enter creature name"
            maxLength={255}
          />
        </div>

        <div className="control-group">
          <label>Body Type:</label>
          <div className="button-group">
            {bodyTypes.map(type => (
              <button
                key={type}
                className={creature.bodyType === type ? 'selected' : ''}
                onClick={() => updateCreature('bodyType', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Color:</label>
          <div className="color-picker">
            {colors.map(color => (
              <button
                key={color}
                className={creature.color === color ? 'selected' : ''}
                style={{ backgroundColor: color }}
                onClick={() => updateCreature('color', color)}
              />
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Eyes:</label>
          <div className="button-group">
            {eyeTypes.map(type => (
              <button
                key={type}
                className={creature.eyeType === type ? 'selected' : ''}
                onClick={() => updateCreature('eyeType', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Mouth:</label>
          <div className="button-group">
            {mouthTypes.map(type => (
              <button
                key={type}
                className={creature.mouthType === type ? 'selected' : ''}
                onClick={() => updateCreature('mouthType', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Arms:</label>
          <div className="button-group">
            {armTypes.map(type => (
              <button
                key={type}
                className={creature.armType === type ? 'selected' : ''}
                onClick={() => updateCreature('armType', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Legs:</label>
          <div className="button-group">
            {legTypes.map(type => (
              <button
                key={type}
                className={creature.legType === type ? 'selected' : ''}
                onClick={() => updateCreature('legType', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Accessory:</label>
          <div className="button-group">
            {accessoryTypes.map(type => (
              <button
                key={type}
                className={creature.accessory === type ? 'selected' : ''}
                onClick={() => updateCreature('accessory', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="randomize-btn" onClick={randomize}>
            🎲 Randomize
          </button>
          <button className="save-btn" onClick={handleSave}>
            💾 Save Creature
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatureBuilder
