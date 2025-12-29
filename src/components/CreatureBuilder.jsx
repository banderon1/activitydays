import { useState, useEffect } from 'react'
import { bodyTypes, eyeTypes, colors, mouthTypes, armTypes, legTypes, accessoryTypes } from '../data/creatureData'
import CreatureCanvas from './CreatureCanvas'
import './CreatureBuilder.css'

// Keep others for now as they are not yet data-driven
// const colors = [...] - Now imported
// const eyeTypes = [...] - Now imported
// const mouthTypes = [...] - Now imported
// const armTypes = [...] - Now imported
// const legTypes = [...] - Now imported
// const accessoryTypes = [...] - Now imported

function CreatureBuilder({ onSave }) {
  console.log('CreatureBuilder legTypes:', legTypes);
  const safeLegType = (legTypes && legTypes.length > 0) ? legTypes[0].id : 'leg_stumpy';

  const [creature, setCreature] = useState({
    name: '',
    bodyType: bodyTypes[0].id, // Default to first body
    color: colors[0].id,
    eyeType: eyeTypes[0].id,
    mouthType: mouthTypes[0].id,
    armType: armTypes[0].id,
    legType: safeLegType,
    accessory: accessoryTypes[0].id,
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

    // Arms affect stats
    const currentArm = armTypes.find(a => a.id === creature.armType)
    if (currentArm) {
      strength += currentArm.stats.strength || 0
      speed += currentArm.stats.speed || 0
      defense += currentArm.stats.defense || 0
    }

    // Legs affect stats
    // Legs affect stats
    const currentLeg = (legTypes && legTypes.find) ? legTypes.find(l => l.id === creature.legType) : null
    if (currentLeg) {
      strength += currentLeg.stats.strength || 0
      speed += currentLeg.stats.speed || 0
      defense += currentLeg.stats.defense || 0
    }

    // Accessories provide bonuses
    const currentAccessory = accessoryTypes.find(a => a.id === creature.accessory)
    if (currentAccessory) {
      strength += currentAccessory.stats.strength || 0
      speed += currentAccessory.stats.speed || 0
      defense += currentAccessory.stats.defense || 0
      // health handled in initialization usually but let's just stick to Str/Spd/Def for display
    }

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
    const currentArm = armTypes.find(a => a.id === creature.armType)
    const currentLeg = legTypes.find(l => l.id === creature.legType)

    onSave({
      ...creature,
      color: currentColor ? currentColor.value : '#333',
      colorId: creature.color,
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
      } : {},
      armProps: currentArm ? {
        type: currentArm.type
      } : {},
      legProps: currentLeg ? {
        type: currentLeg.type
      } : {},
      accessoryProps: {
        type: (accessoryTypes.find(a => a.id === randomAccessory) || accessoryTypes[0]).type,
        layer: (accessoryTypes.find(a => a.id === randomAccessory) || accessoryTypes[0]).layer
      }
    })

    // Reset to create new creature
    setCreature({
      name: '',
      bodyType: bodyTypes[0].id,
      color: colors[0].id,
      eyeType: eyeTypes[0].id,
      mouthType: mouthTypes[0].id,
      armType: armTypes[0].id,
      legType: legTypes[0].id,
      accessory: accessoryTypes[0].id,
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
      armType: armTypes[Math.floor(Math.random() * armTypes.length)].id,
      legType: legTypes[Math.floor(Math.random() * legTypes.length)].id,
      accessory: accessoryTypes[Math.floor(Math.random() * accessoryTypes.length)].id
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
      fluffiness: currentBodyData.fluffiness,
      anchors: currentBodyData.anchors // Pass explicit anchors
    },
    eyeProps: {
      type: currentEyeData.type,
      count: currentEyeData.count
    },
    mouthProps: {
      type: (mouthTypes.find(m => m.id === creature.mouthType) || mouthTypes[0]).type
    },
    armProps: {
      type: (armTypes.find(a => a.id === creature.armType) || armTypes[0]).type
    },
    legProps: {
      type: (legTypes && legTypes.length > 0) ? (legTypes.find(l => l.id === creature.legType) || legTypes[0]).type : 'stumpy'
    },
    accessoryProps: {
      type: (accessoryTypes.find(a => a.id === creature.accessory) || accessoryTypes[0]).type,
      layer: (accessoryTypes.find(a => a.id === creature.accessory) || accessoryTypes[0]).layer
    }
  }

  console.log('Rendering CreatureBuilder with creatureForCanvas:', creatureForCanvas);

  return (
    <div className="creature-builder">
      <div className="builder-left">
        <div className="canvas-container">
          <CreatureCanvas creature={creatureForCanvas} />
        </div>

        <div className="stats-panel">
          <h3>
            Stats
            <span className={`type-badge type-${currentBodyData.element || 'neutral'}`}>
              {currentBodyData.element ? currentBodyData.element.toUpperCase() : 'NEUTRAL'}
            </span>
          </h3>
          <div className="stat">
            <span>💪 Strength:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${Math.max(0, Math.min(100, creature.strength * 5))}%`, backgroundColor: creature.strength < 0 ? '#ff4d4d' : undefined }}></div>
            </div>
            <span>{creature.strength}</span>
          </div>
          <div className="stat">
            <span>⚡ Speed:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${Math.max(0, Math.min(100, creature.speed * 5))}%`, backgroundColor: creature.speed < 0 ? '#ff4d4d' : undefined }}></div>
            </div>
            <span>{creature.speed}</span>
          </div>
          <div className="stat">
            <span>🛡️ Defense:</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${Math.max(0, Math.min(100, creature.defense * 5))}%`, backgroundColor: creature.defense < 0 ? '#ff4d4d' : undefined }}></div>
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
          <label>Arms ({armTypes.length} Options):</label>
          <select
            value={creature.armType}
            onChange={(e) => updateCreature('armType', e.target.value)}
            className="body-selector"
          >
            {armTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Legs ({legTypes.length} Options):</label>
          <select
            value={creature.legType}
            onChange={(e) => updateCreature('legType', e.target.value)}
            className="body-selector"
          >
            {legTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Accessory ({accessoryTypes.length} Options):</label>
          <select
            value={creature.accessory}
            onChange={(e) => updateCreature('accessory', e.target.value)}
            className="body-selector"
          >
            {accessoryTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
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
