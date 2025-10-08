import CreatureCanvas from './CreatureCanvas'
import './CreatureGallery.css'

function CreatureGallery({ creatures, onSelectForBattle, onDelete }) {
  if (creatures.length === 0) {
    return (
      <div className="gallery-empty">
        <h2>Your Creature Gallery</h2>
        <p>No creatures yet! Go to the Build tab to create your first creature.</p>
      </div>
    )
  }

  return (
    <div className="creature-gallery">
      <h2>Your Creature Gallery ({creatures.length})</h2>

      <div className="gallery-grid">
        {creatures.map(creature => (
          <div key={creature.id} className="gallery-card">
            <div className="card-header">
              <h3>{creature.name}</h3>
              <button
                className="delete-btn"
                onClick={() => {
                  if (window.confirm(`Delete ${creature.name}?`)) {
                    onDelete(creature.id)
                  }
                }}
                title="Delete creature"
              >
                🗑️
              </button>
            </div>

            <div className="card-canvas">
              <CreatureCanvas creature={creature} size={200} />
            </div>

            <div className="card-stats">
              <div className="stat-item">
                <span className="stat-icon">💪</span>
                <div className="stat-info">
                  <span className="stat-label">Strength</span>
                  <div className="stat-bar-small">
                    <div
                      className="stat-fill-small strength"
                      style={{ width: `${creature.strength * 5}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{creature.strength}</span>
                </div>
              </div>

              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <div className="stat-info">
                  <span className="stat-label">Speed</span>
                  <div className="stat-bar-small">
                    <div
                      className="stat-fill-small speed"
                      style={{ width: `${creature.speed * 5}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{creature.speed}</span>
                </div>
              </div>

              <div className="stat-item">
                <span className="stat-icon">🛡️</span>
                <div className="stat-info">
                  <span className="stat-label">Defense</span>
                  <div className="stat-bar-small">
                    <div
                      className="stat-fill-small defense"
                      style={{ width: `${creature.defense * 5}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{creature.defense}</span>
                </div>
              </div>

              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <div className="stat-info">
                  <span className="stat-label">Health</span>
                  <div className="stat-bar-small">
                    <div
                      className="stat-fill-small health"
                      style={{ width: `${creature.health}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{creature.health}</span>
                </div>
              </div>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <span className="detail-label">Body:</span>
                <span className="detail-value">{creature.bodyType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Eyes:</span>
                <span className="detail-value">{creature.eyeType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Arms:</span>
                <span className="detail-value">{creature.armType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Legs:</span>
                <span className="detail-value">{creature.legType}</span>
              </div>
              {creature.accessory !== 'none' && (
                <div className="detail-row">
                  <span className="detail-label">Accessory:</span>
                  <span className="detail-value">{creature.accessory}</span>
                </div>
              )}
            </div>

            <button
              className="battle-select-btn"
              onClick={() => onSelectForBattle(creature)}
            >
              ⚔️ Select for Battle
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatureGallery
