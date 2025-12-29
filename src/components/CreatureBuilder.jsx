import { useState, useRef, useEffect } from 'react'
import CreatureCanvas from './CreatureCanvas'
import { bodyTypes, eyeTypes, colors, mouthTypes } from '../data/creatureData'
import './CreatureBuilder.css'

// Keep others for now as they are not yet data-driven
// const colors = [...] - Now imported
// const eyeTypes = [...] - Now imported
// const mouthTypes = [...] - Now imported
const armTypes = ['none', 'small', 'long', 'claws']
const legTypes = ['none', 'stumpy', 'tall', 'wheels']
const accessoryTypes = ['none', 'horns', 'antenna', 'spikes', 'crown']

function CreatureBuilder({ onSave }) {
  const [creature, setCreature] = useState({
    name: '',
    bodyType: bodyTypes[0].id, // Default to first body
    color: colors[0].id,
    eyeType: eyeTypes[0].id,
    mouthType: mouthTypes[0].id,
    armType: 'small',
    legType: 'stumpy',
    accessory: 'none',
    // Base Stats
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

    // Body type affects stats (from data)
    const currentBody = bodyTypes.find(b => b.id === creature.bodyType)
    if (currentBody) {
      strength = currentBody.stats.strength
      speed = currentBody.stats.speed
      defense = currentBody.stats.defense
    }

    // Eye type affects stats
    const currentEye = eyeTypes.find(e => e.id === creature.eyeType)
    if (currentEye) {
      strength += currentEye.stats.strength || 0
      speed += currentEye.stats.speed || 0
      defense += currentEye.stats.defense || 0
    }

    // Color affects stats
    const currentColor = colors.find(c => c.id === creature.color)
    if (currentColor) {
      strength += currentColor.stats.strength || 0
      speed += currentColor.stats.speed || 0
      defense += currentColor.stats.defense || 0
    }

    // Mouth affects stats
    const currentMouth = mouthTypes.find(m => m.id === creature.mouthType)
    if (currentMouth) {
      strength += currentMouth.stats.strength || 0
      speed += currentMouth.stats.speed || 0
      defense += currentMouth.stats.defense || 0
    }

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
  }, [creature.bodyType, creature.eyeType, creature.color, creature.mouthType, creature.armType, creature.legType, creature.accessory])

  const updateCreature = (key, value) => {
    setCreature(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (!creature.name.trim()) {
      alert('Please give your creature a name!')
      return
    }
    // Need to pass the full body object so Canvas knows how to draw it later if we just saved ID
    // Actually, Canvas in Battle will need to know. 
    // For now, let's just save the state. The BattleArena will need to lookup the body by ID or we save the specialized props.
    // Let's attach special body props to the saved object.
    const currentBody = bodyTypes.find(b => b.id === creature.bodyType)
    const currentEye = eyeTypes.find(e => e.id === creature.eyeType)
    const currentColor = colors.find(c => c.id === creature.color)
    const currentMouth = mouthTypes.find(m => m.id === creature.mouthType)

    onSave({
      ...creature,
      color: currentColor ? currentColor.value : '#333', // Save actual hex for simple renderers
      colorId: creature.color, // Save ID for editing/logic if needed logic later
      // Clone specific body rendering props so we don't depend on looking up data later if we don't want to
      bodyProps: {
        type: currentBody.type,
        points: currentBody.points,
        sides: currentBody.sides,
        roughness: currentBody.roughness,
        fluffiness: currentBody.fluffiness
      },
      eyeProps: currentEye ? {
        type: currentEye.type,
        count: currentEye.count
      } : {},
      mouthProps: currentMouth ? {
        type: currentMouth.type
      } : {}
    })

    // Reset to create new creature
    setCreature({
      name: '',
      bodyType: bodyTypes[0].id,
      color: colors[0].id,
      eyeType: eyeTypes[0].id,
      mouthType: mouthTypes[0].id,
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
    const randomBody = bodyTypes[Math.floor(Math.random() * bodyTypes.length)]
    setCreature(prev => ({
      ...prev,
      bodyType: randomBody.id,
      color: colors[Math.floor(Math.random() * colors.length)].id,
      eyeType: eyeTypes[Math.floor(Math.random() * eyeTypes.length)].id,
      mouthType: mouthTypes[Math.floor(Math.random() * mouthTypes.length)].id,
      armType: armTypes[Math.floor(Math.random() * armTypes.length)],
      legType: legTypes[Math.floor(Math.random() * legTypes.length)],
      accessory: accessoryTypes[Math.floor(Math.random() * accessoryTypes.length)]
    }))
  }

  // Find current data for passing to Canvas preview
  const currentBodyData = bodyTypes.find(b => b.id === creature.bodyType) || bodyTypes[0]
  const currentEyeData = eyeTypes.find(e => e.id === creature.eyeType) || eyeTypes[0]
  const currentColorData = colors.find(c => c.id === creature.color) || colors[0]

  const creatureForCanvas = {
    ...creature,
    color: currentColorData.value, // Pass HEX to canvas
    bodyProps: {
      type: currentBodyData.type,
      points: currentBodyData.points,
      sides: currentBodyData.sides,
      roughness: currentBodyData.roughness,
      fluffiness: currentBodyData.fluffiness
    },
    eyeProps: {
      type: currentEyeData.type,
      count: currentEyeData.count
    },
    mouthProps: {
      type: (mouthTypes.find(m => m.id === creature.mouthType) || mouthTypes[0]).type
    }
  }

  return (
    <div className="creature-builder">
      <div className="builder-left">
        <div className="canvas-container">
          <CreatureCanvas creature={creatureForCanvas} />
        </div>

        <div className="stats-panel">
          <h3>Stats</h3>
          <div className="stat">
            <span>💪 Strength:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${Math.min(100, creature.strength * 5)}%` }}></div>
            </div>
            <span>{creature.strength}</span>
          </div>
          <div className="stat">
            <span>⚡ Speed:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${Math.min(100, creature.speed * 5)}%` }}></div>
            </div>
            <span>{creature.speed}</span>
          </div>
          <div className="stat">
            <span>🛡️ Defense:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${Math.min(100, creature.defense * 5)}%` }}></div>
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
          <label>Body Type ({bodyTypes.length} Options):</label>
          <select
            value={creature.bodyType}
            onChange={(e) => updateCreature('bodyType', e.target.value)}
            className="body-selector"
          >
            {bodyTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Color ({colors.length} Options):</label>
          <div className="color-picker">
            {colors.map(colorObj => (
              <button
                key={colorObj.id}
                className={creature.color === colorObj.id ? 'selected' : ''}
                style={{ backgroundColor: colorObj.value }}
                title={colorObj.name}
                onClick={() => updateCreature('color', colorObj.id)}
              />
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Eyes ({eyeTypes.length} Options):</label>
          <select
            value={creature.eyeType}
            onChange={(e) => updateCreature('eyeType', e.target.value)}
            className="body-selector"
          >
            {eyeTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Mouth ({mouthTypes.length} Options):</label>
          <select
            value={creature.mouthType}
            onChange={(e) => updateCreature('mouthType', e.target.value)}
            className="body-selector"
          >
            {mouthTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
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
