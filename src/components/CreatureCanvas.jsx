import { useRef, useEffect } from 'react'

function CreatureCanvas({ creature, size = 300 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const scale = size / 300 // Scale factor for different sizes

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(scale, scale)

    // Draw legs
    drawLegs(ctx, creature)

    // Draw body
    drawBody(ctx, creature)

    // Draw arms
    drawArms(ctx, creature)

    // Draw accessory (behind face)
    if (creature.accessory !== 'none' && creature.accessory !== 'crown') {
      drawAccessory(ctx, creature)
    }

    // Draw eyes
    drawEyes(ctx, creature)

    // Draw mouth
    drawMouth(ctx, creature)

    // Draw crown (on top)
    if (creature.accessory === 'crown') {
      drawAccessory(ctx, creature)
    }

    ctx.restore()
  }, [creature, size])

  const drawBody = (ctx, creature) => {
    ctx.fillStyle = creature.color
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3

    ctx.save()
    ctx.translate(150, 150)

    // Default to 'circle' if no bodyProps (fallback)
    const bodyProps = creature.bodyProps || {}
    const type = bodyProps.type || creature.bodyType.split('_')[0] || 'round' // Fallback for old saves

    switch (type) {
      case 'circle': // basic_round falls here
      case 'round':
        ctx.beginPath()
        ctx.arc(0, 0, 60, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
      case 'square':
        ctx.fillRect(-60, -60, 120, 120)
        ctx.strokeRect(-60, -60, 120, 120)
        break
      case 'triangle':
        ctx.beginPath()
        ctx.moveTo(0, -70)
        ctx.lineTo(-60, 50)
        ctx.lineTo(60, 50)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
      case 'blob':
        ctx.beginPath()
        ctx.ellipse(0, 0, 70, 50, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break

      // Parametric Star
      case 'star':
        ctx.beginPath()
        const points = bodyProps.points || 5
        // Outer radius 80, inner radius depends on 'spikiness' usually but 35 is good default
        const outerRadius = 80
        const innerRadius = 35
        for (let i = 0; i < points; i++) {
          const angleOuter = (18 + i * (360 / points)) * Math.PI / 180
          const angleInner = (18 + (i + 0.5) * (360 / points)) * Math.PI / 180 // half step set

          // Actually standard star logic
          ctx.lineTo(Math.cos(angleOuter) * outerRadius, -Math.sin(angleOuter) * outerRadius)
          ctx.lineTo(Math.cos(angleInner) * innerRadius, -Math.sin(angleInner) * innerRadius)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break

      // Parametric Polygon
      case 'polygon':
        ctx.beginPath()
        const sides = bodyProps.sides || 6
        const radius = 70
        for (let i = 0; i < sides; i++) {
          const angle = (i * (360 / sides)) * Math.PI / 180
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break

      // Parametric Rock
      case 'rock':
        // Seed-based jagged look would be ideal, but for now we use roughness to add variation
        // Since we don't have a stable random seed per creature in this view without re-generating on each render,
        // we will use a deterministic approach based on roughness + index
        ctx.beginPath()
        const roughness = bodyProps.roughness || 1
        const rockRadius = 70
        const rockPoints = 8 + roughness // More points for detailed rocks

        for (let i = 0; i < rockPoints; i++) {
          const angle = (i * (360 / rockPoints)) * Math.PI / 180
          // Create some deterministic variance
          const variance = Math.sin(i * 3 + roughness) * (roughness * 4)
          const r = rockRadius + variance
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Cracks
        if (roughness > 3) {
          ctx.moveTo(-10, -10)
          ctx.lineTo(10, 10)
          ctx.lineTo(20 + roughness, 5)
          ctx.stroke()
        }
        break

      // Parametric Cloud
      case 'cloud':
        // Fluffiness determines number of puffs
        const fluffiness = bodyProps.fluffiness || 5
        const puffCount = 5 + Math.ceil(fluffiness / 2)

        // Draw central mass
        ctx.beginPath()
        ctx.arc(0, 0, 40, 0, Math.PI * 2)
        ctx.fill()

        // Draw surrounding puffs
        for (let i = 0; i < puffCount; i++) {
          const angle = (i * (360 / puffCount)) * Math.PI / 180
          const d = 40 // distance from center
          const puffSize = 25 + (i % 2) * 10 // alternate size

          const px = Math.cos(angle) * d
          const py = Math.sin(angle) * d

          ctx.beginPath()
          ctx.arc(px, py, puffSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
        // Redraw center to cover inner strokes if needed? 
        // Actually clouds usually look better merged. 
        // To merge properly in 2D canvas without composite operations is tricky for outline.
        // Simplified: Draw all filled circles first, then stroke the whole path?
        // Or just let them overlap. The current implementation draws strokes inside which looks messy.
        // Improved Cloud:
        ctx.fillStyle = creature.color
        // We need a path describing the union for the stroke. 
        // For simplicity in this quick refactor, we just draw overlapping filled circles 
        // but that leaves internal strokes if we stroke each one.
        // Let's rely on just drawing them all. 
        break

      case 'ghost':
        ctx.beginPath()
        ctx.arc(0, -20, 60, Math.PI, 0)
        ctx.lineTo(60, 60)
        // Wavy bottom
        for (let i = 1; i <= 6; i++) {
          ctx.lineTo(60 - (20 * i), (i % 2 == 0) ? 60 : 50)
        }
        ctx.lineTo(-60, 60)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
    }

    ctx.restore()
  }

  const drawEyes = (ctx, creature) => {
    ctx.save()
    ctx.translate(150, 140)

    // Determine eye render type and props
    const eyeProps = creature.eyeProps || {}
    const eyeType = eyeProps.type || (creature.eyeType ? creature.eyeType.split('_')[1] || creature.eyeType.split('_')[0] : 'dots')
    const eyeCount = eyeProps.count || 2

    switch (eyeType) {
      // --- BASIC ---
      case 'dots':
        drawStandardEyes(ctx, 10, '#333')
        break
      case 'anime':
        drawAnimeEyes(ctx)
        break
      case 'big':
        drawStandardEyes(ctx, 15, '#333', true) // Big with glint
        break
      case 'small':
        drawStandardEyes(ctx, 5, '#333')
        break

      // --- EMOTIONS ---
      case 'angry':
        drawAngryEyes(ctx)
        break
      case 'sad':
        drawSadEyes(ctx)
        break
      case 'bored':
        drawBoredEyes(ctx)
        break
      case 'happy':
        drawHappyEyes(ctx)
        break
      case 'crazy':
        drawCrazyEyes(ctx)
        break

      // --- MONSTER ---
      case 'cyclops':
        drawCyclopsEye(ctx)
        break
      case 'triclops':
        drawTriclopsEyes(ctx)
        break
      case 'spider':
        drawSpiderEyes(ctx, eyeCount)
        break
      case 'snail':
        drawSnailEyes(ctx)
        break
      case 'vertical':
        drawVerticalEyes(ctx)
        break

      // --- TECH ---
      case 'visor':
        drawVisor(ctx)
        break
      case 'laser':
        drawLaserEyes(ctx)
        break
      case 'hypno':
        drawHypnoEyes(ctx)
        break
      case 'matrix':
        drawMatrixEyes(ctx)
        break
      case 'glowing':
        drawGlowingEyes(ctx)
        break
      case 'scanner':
        drawScannerEye(ctx)
        break

      default:
        drawStandardEyes(ctx, 10, '#333')
    }

    ctx.restore()
  }

  const drawMouth = (ctx, creature) => {
    ctx.save()
    ctx.translate(150, 165)
    ctx.strokeStyle = '#333'
    ctx.fillStyle = '#333'
    ctx.lineWidth = 3

    switch (creature.mouthType) {
      case 'smile':
        ctx.beginPath()
        ctx.arc(0, 0, 20, 0, Math.PI)
        ctx.stroke()
        break
      case 'fangs':
        ctx.beginPath()
        ctx.moveTo(-15, 0)
        ctx.lineTo(15, 0)
        ctx.stroke()
        // Fangs
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.moveTo(-10, 0)
        ctx.lineTo(-8, 15)
        ctx.lineTo(-6, 0)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(10, 0)
        ctx.lineTo(8, 15)
        ctx.lineTo(6, 0)
        ctx.fill()
        ctx.stroke()
        break
      case 'straight':
        ctx.beginPath()
        ctx.moveTo(-15, 0)
        ctx.lineTo(15, 0)
        ctx.stroke()
        break
      case 'roar':
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.ellipse(0, 5, 15, 20, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
    }

    ctx.restore()
  }

  const drawArms = (ctx, creature) => {
    ctx.save()
    ctx.translate(150, 150)
    ctx.strokeStyle = creature.color
    ctx.fillStyle = creature.color
    ctx.lineWidth = 10

    switch (creature.armType) {
      case 'small':
        // Left arm
        ctx.beginPath()
        ctx.moveTo(-50, 0)
        ctx.lineTo(-70, 10)
        ctx.stroke()
        // Right arm
        ctx.beginPath()
        ctx.moveTo(50, 0)
        ctx.lineTo(70, 10)
        ctx.stroke()
        break
      case 'long':
        // Left arm
        ctx.beginPath()
        ctx.moveTo(-50, -10)
        ctx.lineTo(-90, 20)
        ctx.stroke()
        // Right arm
        ctx.beginPath()
        ctx.moveTo(50, -10)
        ctx.lineTo(90, 20)
        ctx.stroke()
        break
      case 'claws':
        ctx.lineWidth = 8
        // Left arm
        ctx.beginPath()
        ctx.moveTo(-50, 0)
        ctx.lineTo(-80, 15)
        ctx.stroke()
        // Left claws
        ctx.strokeStyle = '#333'
        ctx.lineWidth = 3
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(-80, 15)
          ctx.lineTo(-85 - i * 5, 25)
          ctx.stroke()
        }
        // Right arm
        ctx.strokeStyle = creature.color
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(50, 0)
        ctx.lineTo(80, 15)
        ctx.stroke()
        // Right claws
        ctx.strokeStyle = '#333'
        ctx.lineWidth = 3
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(80, 15)
          ctx.lineTo(85 + i * 5, 25)
          ctx.stroke()
        }
        break
    }

    ctx.restore()
  }

  const drawLegs = (ctx, creature) => {
    ctx.save()
    ctx.translate(150, 210)
    ctx.strokeStyle = creature.color
    ctx.fillStyle = creature.color
    ctx.lineWidth = 10

    switch (creature.legType) {
      case 'stumpy':
        // Left leg
        ctx.beginPath()
        ctx.moveTo(-30, 0)
        ctx.lineTo(-30, 20)
        ctx.stroke()
        // Right leg
        ctx.beginPath()
        ctx.moveTo(30, 0)
        ctx.lineTo(30, 20)
        ctx.stroke()
        break
      case 'tall':
        // Left leg
        ctx.beginPath()
        ctx.moveTo(-30, 0)
        ctx.lineTo(-30, 50)
        ctx.stroke()
        // Right leg
        ctx.beginPath()
        ctx.moveTo(30, 0)
        ctx.lineTo(30, 50)
        ctx.stroke()
        break
      case 'wheels':
        ctx.fillStyle = '#333'
        ctx.strokeStyle = '#333'
        // Left wheel
        ctx.beginPath()
        ctx.arc(-30, 15, 15, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        // Right wheel
        ctx.beginPath()
        ctx.arc(30, 15, 15, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
    }

    ctx.restore()
  }

  const drawAccessory = (ctx, creature) => {
    ctx.save()
    ctx.translate(150, 150)
    ctx.strokeStyle = '#333'
    ctx.fillStyle = '#8B4513'
    ctx.lineWidth = 3

    switch (creature.accessory) {
      case 'horns':
        // Left horn
        ctx.fillStyle = '#8B4513'
        ctx.beginPath()
        ctx.moveTo(-40, -50)
        ctx.lineTo(-30, -80)
        ctx.lineTo(-20, -50)
        ctx.fill()
        ctx.stroke()
        // Right horn
        ctx.beginPath()
        ctx.moveTo(40, -50)
        ctx.lineTo(30, -80)
        ctx.lineTo(20, -50)
        ctx.fill()
        ctx.stroke()
        break
      case 'antenna':
        ctx.strokeStyle = '#333'
        ctx.lineWidth = 2
        // Left antenna
        ctx.beginPath()
        ctx.moveTo(-20, -60)
        ctx.lineTo(-25, -85)
        ctx.stroke()
        ctx.fillStyle = '#ff00ff'
        ctx.beginPath()
        ctx.arc(-25, -85, 5, 0, Math.PI * 2)
        ctx.fill()
        // Right antenna
        ctx.beginPath()
        ctx.moveTo(20, -60)
        ctx.lineTo(25, -85)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(25, -85, 5, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'spikes':
        ctx.fillStyle = '#666'
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath()
          ctx.moveTo(i * 20 - 8, -60)
          ctx.lineTo(i * 20, -80)
          ctx.lineTo(i * 20 + 8, -60)
          ctx.fill()
          ctx.stroke()
        }
        break
      case 'crown':
        ctx.fillStyle = '#FFD700'
        ctx.strokeStyle = '#DAA520'
        ctx.beginPath()
        ctx.moveTo(-40, -60)
        // Points of crown
        ctx.lineTo(-30, -80)
        ctx.lineTo(-20, -65)
        ctx.lineTo(-10, -80)
        ctx.lineTo(0, -65)
        ctx.lineTo(10, -80)
        ctx.lineTo(20, -65)
        ctx.lineTo(30, -80)
        ctx.lineTo(40, -60)
        ctx.lineTo(40, -50)
        ctx.lineTo(-40, -50)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Jewels
        ctx.fillStyle = '#ff0000'
        ctx.beginPath()
        ctx.arc(0, -55, 4, 0, Math.PI * 2)
        ctx.fill()
        break
    }

    ctx.restore()
  }

  // --- DRAWING HELPERS ---

  const drawStandardEyes = (ctx, r, pupilColor, glint = false) => {
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    // Left
    ctx.beginPath(); ctx.arc(-20, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Right
    ctx.beginPath(); ctx.arc(20, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Pupils
    ctx.fillStyle = pupilColor
    ctx.beginPath(); ctx.arc(-20, 0, r / 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 0, r / 2, 0, Math.PI * 2); ctx.fill();

    if (glint) {
      ctx.fillStyle = '#fff'
      ctx.beginPath(); ctx.arc(-22, -2, r / 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(18, -2, r / 4, 0, Math.PI * 2); ctx.fill();
    }
  }

  const drawAnimeEyes = (ctx) => {
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    // Draw large ovals
    ctx.beginPath(); ctx.ellipse(-20, 0, 15, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(20, 0, 15, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Sparkles
    ctx.fillStyle = '#333'
    ctx.beginPath(); ctx.arc(-20, 4, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 4, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(-25, -5, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(15, -5, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-18, 8, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(22, 8, 3, 0, Math.PI * 2); ctx.fill();
  }

  const drawAngryEyes = (ctx) => {
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 4
    // Eyebrows
    ctx.beginPath(); ctx.moveTo(-35, -10); ctx.lineTo(-10, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(35, -10); ctx.lineTo(10, 0); ctx.stroke();
    // Eyes
    drawStandardEyes(ctx, 10, '#333')
  }

  const drawSadEyes = (ctx) => {
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3
    // Droopy brows
    ctx.beginPath(); ctx.moveTo(-35, 0); ctx.lineTo(-15, -10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(35, 0); ctx.lineTo(15, -10); ctx.stroke();
    // Wet Eyes
    drawStandardEyes(ctx, 12, '#333')
    ctx.fillStyle = '#00aaff' // Tears
    ctx.beginPath(); ctx.arc(-20, 10, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 10, 5, 0, Math.PI * 2); ctx.fill();
  }

  const drawBoredEyes = (ctx) => {
    // Half closed eyelids
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    // Eyes
    ctx.beginPath(); ctx.arc(-20, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(20, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Pupils
    ctx.fillStyle = '#333'
    ctx.beginPath(); ctx.arc(-20, 0, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 0, 3, 0, Math.PI * 2); ctx.fill();
    // Eyelids
    ctx.fillStyle = '#ddd'
    ctx.beginPath(); ctx.rect(-30, -10, 20, 10); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.rect(10, -10, 20, 10); ctx.fill(); ctx.stroke();
  }

  const drawHappyEyes = (ctx) => {
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.arc(-20, 0, 10, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(20, 0, 10, Math.PI, 0); ctx.stroke();
  }

  const drawCrazyEyes = (ctx) => {
    drawStandardEyes(ctx, 12, '#333')
    // Spiral pupils? Or just mismatched
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(-20, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(20, 0, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#333'
    ctx.beginPath(); ctx.arc(-20, 0, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 0, 2, 0, Math.PI * 2); ctx.fill();

    // Spiral lines
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(-20, 0, 8, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(20, 0, 5, 0, Math.PI * 2); ctx.stroke();
  }

  const drawCyclopsEye = (ctx) => {
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.arc(0, -10, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#333'
    ctx.beginPath(); ctx.arc(0, -10, 10, 0, Math.PI * 2); ctx.fill();
    // Glint
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(5, -15, 5, 0, Math.PI * 2); ctx.fill();
  }

  const drawTriclopsEyes = (ctx) => {
    // Three eyes in triangle
    ctx.translate(0, -10)
    drawStandardEyes(ctx, 10, '#333') // Bottom two
    // Top one
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(0, -25, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#333'
    ctx.beginPath(); ctx.arc(0, -25, 5, 0, Math.PI * 2); ctx.fill();
  }

  const drawSpiderEyes = (ctx, count) => {
    ctx.fillStyle = '#000'
    // Main pair
    ctx.beginPath(); ctx.arc(-15, 0, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(15, 0, 8, 0, Math.PI * 2); ctx.fill();
    // Additional eyes
    const extra = count - 2
    if (extra > 0) {
      ctx.beginPath(); ctx.arc(0, -15, 6, 0, Math.PI * 2); ctx.fill();
    }
    if (extra >= 3) {
      ctx.beginPath(); ctx.arc(-25, -10, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(25, -10, 4, 0, Math.PI * 2); ctx.fill();
    }
  }

  const drawSnailEyes = (ctx) => {
    // Stalks
    ctx.strokeStyle = '#666' // Snail skin color?
    ctx.lineWidth = 6
    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-40, -40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(40, -40); ctx.stroke();
    // Eyes on top
    ctx.translate(-40, -40); drawStandardEyes(ctx, 8, '#333'); ctx.translate(40, 40); // reuse helper?? No, position is diff

    // Draw manually at tips
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-40, -40, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(40, -40, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#000'
    ctx.beginPath(); ctx.arc(-40, -40, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(40, -40, 3, 0, Math.PI * 2); ctx.fill();
  }

  const drawVerticalEyes = (ctx) => {
    ctx.fillStyle = '#fff9cc' // Yellowish
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(-20, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(20, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Slit pupils
    ctx.fillStyle = '#000'
    ctx.beginPath(); ctx.ellipse(-20, 0, 2, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(20, 0, 2, 10, 0, 0, Math.PI * 2); ctx.fill();
  }

  const drawVisor = (ctx) => {
    ctx.fillStyle = '#00ffff'
    ctx.strokeStyle = '#009999'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(-50, -15, 100, 30, 5)
    ctx.fill()
    ctx.stroke()
    // Scan line
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.beginPath(); ctx.moveTo(-45, 0); ctx.lineTo(45, 0); ctx.stroke();
  }

  const drawLaserEyes = (ctx) => {
    // Red glowing eyes
    ctx.fillStyle = '#ff0000'
    ctx.shadowColor = 'red'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(-20, 0, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 0, 8, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Beams
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)'
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-100, 50); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(100, 50); ctx.stroke();
  }

  const drawHypnoEyes = (ctx) => {
    ctx.strokeStyle = '#ff00ff'
    ctx.lineWidth = 2
    for (let r = 2; r < 15; r += 4) {
      ctx.beginPath(); ctx.arc(-20, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(20, 0, r, 0, Math.PI * 2); ctx.stroke();
    }
  }

  const drawMatrixEyes = (ctx) => {
    ctx.fillStyle = '#0f0'
    ctx.font = '12px monospace'
    ctx.fillText('10', -30, 0)
    ctx.fillText('01', -30, 10)
    ctx.fillText('01', 15, 0)
    ctx.fillText('10', 15, 10)
  }

  const drawGlowingEyes = (ctx) => {
    ctx.fillStyle = '#ffff00'
    ctx.shadowColor = 'yellow'; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.arc(-20, 0, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 0, 10, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  const drawScannerEye = (ctx) => {
    // Tech monocle
    drawStandardEyes(ctx, 10, '#333')
    ctx.strokeStyle = '#0f0'
    ctx.lineWidth = 1
    // Target reticle over left eye
    ctx.beginPath(); ctx.arc(-20, 0, 15, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-35, 0); ctx.lineTo(-5, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-20, -15); ctx.lineTo(-20, 15); ctx.stroke();
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ border: '2px solid #333', borderRadius: '8px', backgroundColor: '#f0f0f0' }}
    />
  )
}

export default CreatureCanvas
