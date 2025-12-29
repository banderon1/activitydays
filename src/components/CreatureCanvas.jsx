import { useRef, useEffect } from 'react'

function CreatureCanvas({ creature, size = 300 }) {
  console.log('CreatureCanvas MOUNTED with:', creature);
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

    // Draw back accessory (behind body)
    if (creature.accessoryProps?.layer === 'back') {
      console.log('Drawing Accessory (Back)...');
      drawBackAccessory(ctx, creature)
    }

    // Draw legs
    console.log('Scaling done. Drawing Legs...');
    drawLegs(ctx, creature)

    // Draw body
    console.log('Drawing Body...');
    drawBody(ctx, creature)

    // Draw arms
    console.log('Drawing Arms...');
    drawArms(ctx, creature)

    // Draw eyes
    console.log('Drawing Eyes...');
    drawEyes(ctx, creature)

    // Draw mouth
    console.log('Drawing Mouth...');
    drawMouth(ctx, creature)

    // Draw front accessory (on top)
    if (creature.accessoryProps?.layer === 'front') {
      console.log('Drawing Accessory (Front)...');
      drawFrontAccessory(ctx, creature)
    }

    ctx.restore()
    console.log('Canvas rendering completed.');
  }, [creature, size])

  const drawBody = (ctx, creature) => {
    ctx.fillStyle = creature.color
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3

    ctx.save()
    ctx.translate(150, 150)

    const bodyProps = creature.bodyProps || {}
    const type = bodyProps.type || 'hero' // Default

    switch (type) {
      // 1. HERO TORSO
      case 'hero':
        // Trapezoid torso
        ctx.beginPath()
        ctx.moveTo(-50, -40) // Shoulder L
        ctx.lineTo(50, -40)  // Shoulder R
        ctx.lineTo(30, 40)   // Waist R
        ctx.lineTo(0, 50)    // Crotch
        ctx.lineTo(-30, 40)  // Waist L
        ctx.closePath()
        ctx.fill(); ctx.stroke()
        // Pecs detail
        ctx.beginPath(); ctx.moveTo(-30, -10); ctx.quadraticCurveTo(0, 10, 30, -10); ctx.stroke()
        break

      // 2. MECH CHASSIS
      case 'mech':
        ctx.fillStyle = '#b3b3b3'; // Industrial Grey override (or keep user color? Let's use user color but darken)
        ctx.fillStyle = creature.color;
        // Hexagonal Chest
        ctx.beginPath()
        ctx.moveTo(-40, -50); ctx.lineTo(40, -50)
        ctx.lineTo(60, -10); ctx.lineTo(40, 50)
        ctx.lineTo(-40, 50); ctx.lineTo(-60, -10)
        ctx.closePath()
        ctx.fill(); ctx.stroke()
        // Vents
        ctx.fillStyle = '#333';
        ctx.fillRect(-20, 10, 40, 5)
        ctx.fillRect(-20, 20, 40, 5)
        break

      // 3. BEAST BODY (Quadruped)
      case 'beast':
        // Horizontal Oval
        ctx.beginPath()
        ctx.ellipse(0, 10, 60, 40, 0, 0, Math.PI * 2)
        ctx.fill(); ctx.stroke()
        // Flank muscle
        ctx.beginPath(); ctx.arc(-30, 10, 20, 0, Math.PI, true); ctx.stroke();
        break

      // 4. INSECT THORAX
      case 'insect':
        // Segmented
        ctx.beginPath(); ctx.ellipse(0, -20, 40, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke() // Upper
        ctx.beginPath(); ctx.ellipse(0, 30, 35, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke() // Abdomen
        break

      // 5. SLIME CORE
      case 'slime':
        ctx.beginPath()
        ctx.moveTo(-40, -30)
        ctx.bezierCurveTo(-60, -10, -50, 50, 0, 60)
        ctx.bezierCurveTo(50, 50, 60, -10, 40, -30)
        ctx.quadraticCurveTo(0, -50, -40, -30)
        ctx.fill(); ctx.stroke()
        // Bubbles inside
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.beginPath(); ctx.arc(-20, 0, 5, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(20, 20, 8, 0, Math.PI * 2); ctx.fill()
        break

      // 6. GEODE (Rock)
      case 'geode':
        ctx.beginPath()
        ctx.moveTo(-40, -50); ctx.lineTo(30, -60)
        ctx.lineTo(60, -10); ctx.lineTo(40, 60)
        ctx.lineTo(-30, 50); ctx.lineTo(-60, 0)
        ctx.closePath()
        ctx.fill(); ctx.stroke()
        // Crystal center
        ctx.fillStyle = '#bdf';
        ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(10, 10); ctx.lineTo(20, -5); ctx.fill();
        break

      // 7. NOVA CORE (Star)
      case 'nova':
        ctx.beginPath()
        for (let i = 0; i < 8; i++) {
          const angle = (i * 45) * Math.PI / 180
          const r = i % 2 === 0 ? 60 : 30
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
        }
        ctx.closePath()
        ctx.fill(); ctx.stroke()
        break

      default:
        // Fallback Circle
        ctx.beginPath()
        ctx.arc(0, 0, 50, 0, Math.PI * 2)
        ctx.fill(); ctx.stroke()
    }

    ctx.restore()
  }

  const drawEyes = (ctx, creature) => {
    ctx.save()
    // Use Face Anchor if available, else default
    const anchor = creature.bodyProps?.anchors?.face || { x: 0, y: -10 }
    ctx.translate(150 + anchor.x, 150 + anchor.y)

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
    // Use Face Anchor, then offset down slightly for mouth
    const anchor = creature.bodyProps?.anchors?.face || { x: 0, y: -10 }
    ctx.translate(150 + anchor.x, 150 + anchor.y + 25)
    ctx.strokeStyle = '#333'
    ctx.fillStyle = '#333'
    ctx.lineWidth = 3

    // Determine mouth type from props or direct type
    const mouthProps = creature.mouthProps || {}
    const mouthType = mouthProps.type || (creature.mouthType ? creature.mouthType.split('_')[1] || 'smile' : 'smile')

    switch (mouthType) {
      // --- BASIC ---
      case 'smile':
        ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI); ctx.stroke();
        break
      case 'frown':
        ctx.beginPath(); ctx.arc(0, 20, 20, Math.PI, 0); ctx.stroke();
        break
      case 'neutral':
        ctx.beginPath(); ctx.moveTo(-20, 10); ctx.lineTo(20, 10); ctx.stroke();
        break
      case 'open':
        ctx.beginPath(); ctx.arc(0, 10, 10, 0, Math.PI * 2); ctx.stroke();
        break
      case 'tongue':
        ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI); ctx.stroke(); // Smile
        ctx.fillStyle = '#ff9999';
        ctx.beginPath(); ctx.moveTo(-5, 20); ctx.quadraticCurveTo(0, 35, 5, 20); ctx.fill(); ctx.stroke();
        break

      // --- ANIMAL ---
      case 'cat':
        ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-10, 10); ctx.quadraticCurveTo(-20, 10, -25, 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(10, 10); ctx.quadraticCurveTo(20, 10, 25, 5); ctx.stroke();
        break
      case 'dog':
        ctx.beginPath(); ctx.moveTo(-20, 5); ctx.quadraticCurveTo(0, 25, 20, 5); ctx.stroke(); // Open mouth
        ctx.fillStyle = '#ff9999'; // Tongue
        ctx.beginPath(); ctx.ellipse(5, 20, 8, 12, Math.PI / 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        break
      case 'beak':
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(10, -5); ctx.lineTo(0, 15); ctx.fill(); ctx.stroke();
        break
      case 'rabbit':
        ctx.beginPath(); ctx.moveTo(-5, 5); ctx.lineTo(-10, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(5, 5); ctx.lineTo(10, 10); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-5, 10, 5, 10); ctx.strokeRect(-5, 10, 5, 10);
        ctx.fillRect(0, 10, 5, 10); ctx.strokeRect(0, 10, 5, 10);
        break
      case 'snout':
        ctx.fillStyle = '#ffcccc';
        ctx.beginPath(); ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(-5, 0, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(5, 0, 3, 0, Math.PI * 2); ctx.fill();
        break

      // --- MONSTER ---
      case 'fangs':
        // Mouth line
        ctx.beginPath(); ctx.moveTo(-20, 5); ctx.lineTo(20, 5); ctx.stroke();
        // Fangs
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(-15, 5); ctx.lineTo(-10, 20); ctx.lineTo(-5, 5); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(15, 5); ctx.lineTo(10, 20); ctx.lineTo(5, 5); ctx.fill(); ctx.stroke();
        break
      case 'tusks':
        // Bottom tusks
        ctx.fillStyle = '#fffef0';
        ctx.beginPath(); ctx.moveTo(-20, 15); ctx.quadraticCurveTo(-25, -10, -35, -20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, 15); ctx.quadraticCurveTo(25, -10, 35, -20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-15, 10); ctx.lineTo(15, 10); ctx.stroke();
        break
      case 'toothy': // Shark
        ctx.fillStyle = '#000'; // Open mouth
        ctx.beginPath(); ctx.arc(0, 10, 25, 0, Math.PI, false); ctx.fill();
        ctx.fillStyle = '#fff'; // Sharp teeth
        for (let i = 0; i < 5; i++) {
          ctx.beginPath(); ctx.moveTo(-20 + i * 10, 10); ctx.lineTo(-15 + i * 10, 30); ctx.lineTo(-10 + i * 10, 10); ctx.fill();
        }
        break
      case 'leech':
        ctx.beginPath(); ctx.arc(0, 10, 15, 0, Math.PI * 2); ctx.stroke();
        // Circular teeth
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          ctx.beginPath(); ctx.arc(Math.cos(angle) * 10, 10 + Math.sin(angle) * 10, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        break
      case 'gaping':
        ctx.fillStyle = '#110000';
        ctx.beginPath(); ctx.ellipse(0, 15, 25, 35, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        break

      // --- TECH ---
      case 'speaker':
        ctx.fillStyle = '#444';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(-20 + i * 15, 0, 10, 20);
        }
        break
      case 'vent':
        ctx.fillStyle = '#666';
        ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.lineTo(15, 20); ctx.lineTo(-15, 20); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillRect(-10, 5, 20, 2);
        ctx.fillRect(-8, 10, 16, 2);
        ctx.fillRect(-6, 15, 12, 2);
        break
      case 'stitch':
        ctx.beginPath(); ctx.moveTo(-30, 10); ctx.lineTo(30, 10); ctx.stroke();
        for (let i = 0; i < 5; i++) {
          ctx.beginPath(); ctx.moveTo(-20 + i * 10, 0); ctx.lineTo(-20 + i * 10, 20); ctx.stroke();
        }
        break
      case 'zipper':
        ctx.fillStyle = '#333';
        ctx.fillRect(-30, 8, 60, 4);
        ctx.fillStyle = '#888';
        for (let i = 0; i < 10; i++) {
          ctx.fillRect(-30 + i * 6, 5, 2, 10);
        }
        ctx.fillStyle = '#aaa'; // Pull tab
        ctx.fillRect(30, 8, 5, 15);
        break
      case 'void':
        ctx.fillStyle = '#000';
        ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(0, 10, 15, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        break
      case 'mustache':
        ctx.fillStyle = '#333'; // Handlebar
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.quadraticCurveTo(15, -5, 30, 10);
        ctx.quadraticCurveTo(15, 5, 0, 5);
        ctx.moveTo(0, 5);
        ctx.quadraticCurveTo(-15, -5, -30, 10);
        ctx.quadraticCurveTo(-15, 5, 0, 5);
        ctx.fill();
        break

      default:
        ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI); ctx.stroke();
    }

    ctx.restore()
  }

  const drawArms = (ctx, creature) => {
    ctx.save()
    // Base translate to center, then we use anchors relative to 0,0
    ctx.translate(150, 150)

    // Anchors
    const anchors = creature.bodyProps?.anchors || { armL: { x: -50, y: 0 }, armR: { x: 50, y: 0 } }
    const { armL, armR } = anchors

    ctx.strokeStyle = creature.color
    ctx.fillStyle = creature.color
    ctx.lineWidth = 10

    // Determine arm type from props or direct type
    const armProps = creature.armProps || {}
    const armType = armProps.type || (creature.armType ? creature.armType.split('_')[1] || 'small' : 'small')

    switch (armType) {
      // --- BASIC ---
      case 'none':
        break
      case 'small': // Stick
        // Left
        ctx.beginPath(); ctx.moveTo(armL.x, armL.y); ctx.lineTo(armL.x - 20, armL.y + 10); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(armR.x, armR.y); ctx.lineTo(armR.x + 20, armR.y + 10); ctx.stroke();
        break
      case 'noodle': // Wavy
        // Left
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(-60, -20, -80, 0); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.quadraticCurveTo(60, -20, 80, 0); ctx.stroke();
        break
      case 'long':
        // Left
        ctx.beginPath(); ctx.moveTo(-50, -10); ctx.lineTo(-100, 30); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(50, -10); ctx.lineTo(100, 30); ctx.stroke();
        break
      case 'fat':
        ctx.lineWidth = 20;
        // Left
        ctx.beginPath(); ctx.moveTo(armL.x, armL.y); ctx.lineTo(armL.x - 30, armL.y + 10); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(armR.x, armR.y); ctx.lineTo(armR.x + 30, armR.y + 10); ctx.stroke();
        break

      // --- MUSCLE ---
      case 'muscle': // Brawny
        ctx.lineWidth = 15;
        // Left flex
        ctx.beginPath(); ctx.moveTo(armL.x, armL.y); ctx.lineTo(armL.x - 30, armL.y - 20); ctx.lineTo(armL.x - 40, armL.y - 50); ctx.stroke();
        // Right flex
        ctx.beginPath(); ctx.moveTo(armR.x, armR.y); ctx.lineTo(armR.x + 30, armR.y - 20); ctx.lineTo(armR.x + 40, armR.y - 50); ctx.stroke();
        break
      case 'ripped': // Veiny/Angular
        ctx.lineWidth = 12;
        // Left
        ctx.beginPath(); ctx.moveTo(-50, 10); ctx.lineTo(-80, 0); ctx.lineTo(-100, 10); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(50, 10); ctx.lineTo(80, 0); ctx.lineTo(100, 10); ctx.stroke();
        break
      case 'hulk': // Massive
        ctx.lineWidth = 25;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-50, 10); ctx.lineTo(-100, 30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 10); ctx.lineTo(100, 30); ctx.stroke();
        break
      case 'gloves': // Boxer
        ctx.lineWidth = 10;
        // Arms
        ctx.beginPath(); ctx.moveTo(armL.x, armL.y); ctx.lineTo(armL.x - 30, armL.y + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(armR.x, armR.y); ctx.lineTo(armR.x + 30, armR.y + 10); ctx.stroke();
        // Gloves
        ctx.fillStyle = '#ff0000';
        ctx.beginPath(); ctx.arc(armL.x - 35, armL.y + 15, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(armR.x + 35, armR.y + 15, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        break
      case 'knuckles':
        ctx.lineWidth = 10;
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-80, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(80, 10); ctx.stroke();
        // Brass
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-90, 5, 10, 20); ctx.strokeRect(-90, 5, 10, 20);
        ctx.fillRect(80, 5, 10, 20); ctx.strokeRect(80, 5, 10, 20);
        break

      // --- MONSTER ---
      case 'tentacle':
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        // Wavy tentacles
        ctx.beginPath(); ctx.moveTo(-50, 10); ctx.bezierCurveTo(-70, 40, -90, -20, -110, 20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 10); ctx.bezierCurveTo(70, 40, 90, -20, 110, 20); ctx.stroke();
        break
      case 'claws':
        ctx.lineWidth = 8
        // Left arm
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-80, 15); ctx.stroke();
        // Left claws
        ctx.strokeStyle = '#333'; ctx.lineWidth = 3
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-80, 15); ctx.lineTo(-85 - i * 5, 25); ctx.stroke(); }
        // Right arm
        ctx.strokeStyle = creature.color; ctx.lineWidth = 8
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(80, 15); ctx.stroke();
        // Right claws
        ctx.strokeStyle = '#333'; ctx.lineWidth = 3
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(80, 15); ctx.lineTo(85 + i * 5, 25); ctx.stroke(); }
        break
      case 'wings':
        ctx.fillStyle = creature.color; // Same as body but maybe translucent?
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
        // Left Wing
        ctx.beginPath(); ctx.moveTo(-50, -20); ctx.lineTo(-120, -60); ctx.lineTo(-100, 20); ctx.lineTo(-80, 10); ctx.lineTo(-70, 30); ctx.lineTo(-50, 10); ctx.fill(); ctx.stroke();
        // Right Wing
        ctx.beginPath(); ctx.moveTo(50, -20); ctx.lineTo(120, -60); ctx.lineTo(100, 20); ctx.lineTo(80, 10); ctx.lineTo(70, 30); ctx.lineTo(50, 10); ctx.fill(); ctx.stroke();
        break
      case 'fins':
        ctx.fillStyle = creature.color;
        // Left Fin
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(-90, -10, -80, 40); ctx.quadraticCurveTo(-60, 20, -50, 20); ctx.fill(); ctx.stroke();
        // Right Fin
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.quadraticCurveTo(90, -10, 80, 40); ctx.quadraticCurveTo(60, 20, 50, 20); ctx.fill(); ctx.stroke();
        break
      case 'vines':
        ctx.strokeStyle = '#2ECC40'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(-40, 0); ctx.bezierCurveTo(-60, 30, -80, -10, -100, 40); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(40, 0); ctx.bezierCurveTo(60, 30, 80, -10, 100, 40); ctx.stroke();
        // Thorns
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.moveTo(-70, 10); ctx.lineTo(-80, 0); ctx.lineTo(-65, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(70, 10); ctx.lineTo(80, 0); ctx.lineTo(65, 0); ctx.fill();
        break
      case 'slug':
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; // Slime trail visual?
        // Just stubby slime arms
        ctx.lineWidth = 12; ctx.lineCap = 'round';
        ctx.strokeStyle = creature.color;
        ctx.beginPath(); ctx.moveTo(-50, 20); ctx.lineTo(-70, 40); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 20); ctx.lineTo(70, 40); ctx.stroke();
        break

      // --- TECH ---
      case 'robot':
        ctx.strokeStyle = '#999'; ctx.lineWidth = 12;
        // Joints
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-70, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(70, 0); ctx.stroke();
        ctx.fillStyle = '#555';
        ctx.beginPath(); ctx.arc(-70, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(70, 0, 8, 0, Math.PI * 2); ctx.fill();
        // Forearms
        ctx.strokeStyle = '#999';
        ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-90, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(70, 0); ctx.lineTo(90, 10); ctx.stroke();
        // Clamps
        ctx.strokeStyle = '#333'; ctx.lineWidth = 4;
        ctx.strokeRect(-100, 5, 10, 10); ctx.strokeRect(90, 5, 10, 10);
        break
      case 'drill':
        ctx.fillStyle = '#aaa';
        // Left Drill
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-70, -10); ctx.lineTo(-110, 10); ctx.lineTo(-70, 30); ctx.fill(); ctx.stroke();
        // Right Drill
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(70, -10); ctx.lineTo(110, 10); ctx.lineTo(70, 30); ctx.fill(); ctx.stroke();
        break
      case 'magnet':
        ctx.fillStyle = '#f00'; ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2;
        // Magnet U shape
        const drawMagnet = (x, sign) => {
          ctx.save(); ctx.translate(x, 0); ctx.scale(sign, 1);
          ctx.fillRect(0, -15, 20, 10); ctx.strokeRect(0, -15, 20, 10); // Top
          ctx.fillRect(0, 15, 20, 10); ctx.strokeRect(0, 15, 20, 10); // Bottom
          ctx.fillStyle = '#ccc';
          ctx.fillRect(20, -15, 10, 40); ctx.strokeRect(20, -15, 10, 40); // Base
          ctx.restore();
        }
        drawMagnet(-80, 1);
        drawMagnet(80, -1);
        break
      case 'shield':
        ctx.fillStyle = '#0074D9'; ctx.strokeStyle = '#fff';
        // Arms holding shields
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-70, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(70, 10); ctx.stroke();
        // Shields
        ctx.beginPath(); ctx.arc(-80, 10, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(80, 10, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        break
      case 'cannon':
        ctx.fillStyle = '#111';
        // Left Cannon
        ctx.beginPath(); ctx.rect(-100, -10, 50, 30); ctx.fill();
        // Right Cannon
        ctx.beginPath(); ctx.rect(50, -10, 50, 30); ctx.fill();
        break
      case 'saw':
        ctx.fillStyle = '#ddd'; ctx.strokeStyle = '#888';
        // Arms
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-70, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(70, 10); ctx.stroke();
        // Saws
        const drawSaw = (x) => {
          ctx.beginPath(); ctx.arc(x, 15, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, 15, 5, 0, Math.PI * 2); ctx.stroke();
        }
        drawSaw(-85); drawSaw(85);
        break

      default:
        // Basic small arms
        ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-70, 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(70, 10); ctx.stroke();
    }

    ctx.restore()
  }

  const drawLegs = (ctx, creature) => {
    ctx.save()
    // Legs drawn relative to center, using anchor offsets
    ctx.translate(150, 150)

    // Anchors
    const anchors = creature.bodyProps?.anchors || { legL: { x: -30, y: 60 }, legR: { x: 30, y: 60 } }
    const { legL, legR } = anchors

    ctx.strokeStyle = creature.color
    ctx.fillStyle = creature.color
    ctx.lineWidth = 10

    // Determine leg type from props or direct type
    const legProps = creature.legProps || {}
    const legType = legProps.type || (creature.legType ? creature.legType.split('_')[1] || 'stumpy' : 'stumpy')

    switch (legType) {
      // --- BASIC ---
      case 'none':
        break
      case 'stumpy':
        // Left
        ctx.beginPath(); ctx.moveTo(legL.x, legL.y); ctx.lineTo(legL.x, legL.y + 20); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(legR.x, legR.y); ctx.lineTo(legR.x, legR.y + 20); ctx.stroke();
        break
      case 'human':
        ctx.lineWidth = 12;
        // Left
        ctx.beginPath(); ctx.moveTo(legL.x, legL.y); ctx.lineTo(legL.x, legL.y + 60); ctx.lineTo(legL.x - 10, legL.y + 60); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(legR.x, legR.y); ctx.lineTo(legR.x, legR.y + 60); ctx.lineTo(legR.x + 10, legR.y + 60); ctx.stroke();
        break
      case 'stick':
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-35, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(35, 60); ctx.stroke();
        break
      case 'fat':
        ctx.lineWidth = 25;
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-30, 30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(30, 30); ctx.stroke();
        break

      // --- SPEED ---
      case 'cat':
        ctx.lineWidth = 10;
        // Left
        ctx.beginPath(); ctx.moveTo(legL.x, legL.y); ctx.quadraticCurveTo(legL.x - 10, legL.y + 20, legL.x - 5, legL.y + 40); ctx.stroke();
        // Right
        ctx.beginPath(); ctx.moveTo(legR.x, legR.y); ctx.quadraticCurveTo(legR.x + 10, legR.y + 20, legR.x + 5, legR.y + 40); ctx.stroke();
        break
      case 'cheetah':
        ctx.lineWidth = 8;
        // Jointed fast legs
        const drawCheetahLeg = (x) => {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x * 1.2, 20); ctx.lineTo(x, 50); ctx.lineTo(x * 1.3, 55); ctx.stroke();
        }
        drawCheetahLeg(-30); drawCheetahLeg(30);
        break
      case 'rabbit':
        ctx.lineWidth = 10;
        const drawRabbitFoot = (x) => {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 30); ctx.stroke();
          ctx.fillStyle = creature.color || '#fff';
          ctx.beginPath(); ctx.ellipse(x * 1.2, 35, 10, 20, Math.PI / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        drawRabbitFoot(-30); drawRabbitFoot(30);
        break
      case 'wheels':
        ctx.fillStyle = '#333'; ctx.strokeStyle = '#333';
        // Left
        ctx.beginPath(); ctx.arc(legL.x, legL.y + 15, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#aaa'; ctx.beginPath(); ctx.arc(legL.x, legL.y + 15, 5, 0, Math.PI * 2); ctx.fill();
        // Right
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(legR.x, legR.y + 15, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#aaa'; ctx.beginPath(); ctx.arc(legR.x, legR.y + 15, 5, 0, Math.PI * 2); ctx.fill();
        break
      case 'springs':
        ctx.strokeStyle = '#999'; ctx.lineWidth = 3;
        const drawSpring = (x) => {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.moveTo(x + (i % 2 === 0 ? -10 : 10), i * 10);
            ctx.lineTo(x + (i % 2 === 0 ? 10 : -10), i * 10 + 10);
          }
          ctx.stroke();
        }
        drawSpring(-30); drawSpring(30);
        break

      // --- MONSTER ---
      case 'spider':
        ctx.lineWidth = 4;
        const drawSpiderLeg = (xStart, xKnee, yKnee, xKnee2, yKnee2) => {
          ctx.beginPath(); ctx.moveTo(xStart, 0); ctx.lineTo(xKnee, yKnee); ctx.lineTo(xKnee2, yKnee2); ctx.stroke();
        }
        // 4 legs
        drawSpiderLeg(-20, -60, -20, -80, 40);
        drawSpiderLeg(-10, -50, -10, -60, 50);
        drawSpiderLeg(10, 50, -10, 60, 50);
        drawSpiderLeg(20, 60, -20, 80, 40);
        break
      case 'tentacles':
        ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-20, 0); ctx.bezierCurveTo(-40, 30, -10, 50, -50, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, 0); ctx.bezierCurveTo(40, 30, 10, 50, 50, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(10, 20, -10, 40, 0, 60); ctx.stroke();
        break
      case 'slime':
        ctx.fillStyle = 'rgba(100,255,100,0.5)';
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.quadraticCurveTo(0, 40, 30, 0); ctx.fill();
        break
      case 'hooves':
        ctx.lineWidth = 12;
        const drawHoof = (x) => {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 40); ctx.stroke();
          ctx.fillStyle = '#222';
          ctx.fillRect(x - 8, 40, 16, 10);
        }
        drawHoof(-30); drawHoof(30);
        break
      case 'clawed': // Raptor
        ctx.lineWidth = 8;
        const drawClawLeg = (x) => {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 30); ctx.stroke();
          // Claws
          ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x - 10, 45); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, 50); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x + 10, 45); ctx.stroke();
        }
        drawClawLeg(-30); drawClawLeg(30);
        break
      case 'roots':
        ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 5;
        const drawRoot = (x) => {
          ctx.beginPath(); ctx.moveTo(x, 0);
          ctx.quadraticCurveTo(x - 20, 30, x - 40, 50); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, 10);
          ctx.quadraticCurveTo(x + 20, 30, x + 30, 50); ctx.stroke();
        }
        drawRoot(-20); drawRoot(20);
        break

      // --- TECH ---
      case 'walker':
        ctx.strokeStyle = '#666'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-50, 30); ctx.lineTo(-40, 60); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(50, 30); ctx.lineTo(40, 60); ctx.stroke();
        break
      case 'treads':
        ctx.fillStyle = '#333';
        ctx.fillRect(-60, 0, 120, 40);
        ctx.fillStyle = '#555';
        for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-40 + i * 20, 35, 5, 0, Math.PI * 2); ctx.fill(); }
        break
      case 'jet':
        ctx.fillStyle = '#999';
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-40, 30); ctx.lineTo(-20, 30); ctx.fill();
        ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(40, 30); ctx.lineTo(20, 30); ctx.fill();
        // Fire
        ctx.fillStyle = 'orange';
        ctx.beginPath(); ctx.moveTo(-30, 30); ctx.lineTo(-40, 50); ctx.lineTo(-20, 50); ctx.fill();
        ctx.beginPath(); ctx.moveTo(30, 30); ctx.lineTo(40, 50); ctx.lineTo(20, 50); ctx.fill();
        break
      case 'antigrav':
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.ellipse(0, 20, 40, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.shadowColor = 'cyan'; ctx.shadowBlur = 15;
        ctx.fillStyle = '#0ff';
        ctx.beginPath(); ctx.ellipse(0, 20, 30, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        break
      case 'mech':
        ctx.fillStyle = '#444'; ctx.strokeStyle = '#888';
        const drawMechLeg = (x) => {
          ctx.fillRect(x - 10, 0, 20, 25); ctx.strokeRect(x - 10, 0, 20, 25);
          ctx.fillRect(x - 15, 25, 30, 35); ctx.strokeRect(x - 15, 25, 30, 35);
        }
        drawMechLeg(-40); drawMechLeg(40);
        break
      case 'skates':
        // Legs
        ctx.lineWidth = 10;
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-30, 40); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(30, 40); ctx.stroke();
        // Skates
        ctx.fillStyle = '#fff'; ctx.fillRect(-40, 40, 20, 10); ctx.fillRect(20, 40, 20, 10);
        // Wheels
        ctx.fillStyle = 'cyan';
        ctx.beginPath(); ctx.arc(-35, 55, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-25, 55, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(25, 55, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(35, 55, 4, 0, Math.PI * 2); ctx.fill();
        break

      default:
        // Left leg
        ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-30, 20); ctx.stroke();
        // Right leg
        ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(30, 20); ctx.stroke();
    }

    ctx.restore()
  }

  const drawBackAccessory = (ctx, creature) => {
    ctx.save()
    ctx.translate(150, 150)
    const type = creature.accessoryProps?.type || 'none';

    switch (type) {
      // --- WINGS ---
      case 'wings_bat':
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(80, -80, 140, -40);
        ctx.quadraticCurveTo(100, 20, 0, 0); // Wing shape needs tweaking
        // Left Wing
        ctx.save(); ctx.scale(-1, 1);
        ctx.beginPath(); ctx.moveTo(20, -20); ctx.quadraticCurveTo(80, -100, 150, -60);
        ctx.quadraticCurveTo(120, 20, 60, 0); ctx.lineTo(20, -20); ctx.fill();
        ctx.restore();
        // Right Wing
        ctx.beginPath(); ctx.moveTo(20, -20); ctx.quadraticCurveTo(80, -100, 150, -60);
        ctx.quadraticCurveTo(120, 20, 60, 0); ctx.lineTo(20, -20); ctx.fill();
        break;
      case 'wings_angel':
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ddd'; ctx.lineWidth = 2;
        const drawAngelWing = (x, s) => {
          ctx.save(); ctx.scale(s, 1);
          ctx.beginPath(); ctx.moveTo(x, -20);
          ctx.quadraticCurveTo(x + 80, -80, x + 120, -40);
          ctx.quadraticCurveTo(x + 100, 40, x + 20, 0);
          ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        drawAngelWing(20, 1);
        drawAngelWing(20, -1);
        break;
      case 'cape':
        ctx.fillStyle = '#d00';
        ctx.beginPath();
        ctx.moveTo(-40, -40);
        ctx.lineTo(40, -40);
        ctx.lineTo(60, 100);
        ctx.quadraticCurveTo(0, 120, -60, 100);
        ctx.fill();
        break;
      case 'jetpack':
        ctx.fillStyle = '#ccc';
        // Tanks
        ctx.beginPath(); ctx.rect(-40, -60, 30, 80); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(10, -60, 30, 80); ctx.fill(); ctx.stroke();
        // Flames
        ctx.fillStyle = 'orange';
        ctx.beginPath(); ctx.moveTo(-25, 20); ctx.lineTo(-35, 50); ctx.lineTo(-15, 50); ctx.fill();
        ctx.beginPath(); ctx.moveTo(25, 20); ctx.lineTo(15, 50); ctx.lineTo(35, 50); ctx.fill();
        break;
      case 'spikes':
        ctx.fillStyle = '#555';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(-60, -40 + i * 40); ctx.lineTo(-90, -20 + i * 40); ctx.lineTo(-60, 0 + i * 40); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(60, -40 + i * 40); ctx.lineTo(90, -20 + i * 40); ctx.lineTo(60, 0 + i * 40); ctx.fill();
        }
        break;
      case 'shell':
        ctx.fillStyle = '#228B22'; ctx.strokeStyle = '#006400'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(0, 0, 75, 85, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Pattern
        ctx.beginPath(); ctx.moveTo(0, -85); ctx.lineTo(0, 85); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-75, 0); ctx.lineTo(75, 0); ctx.stroke();
        break;
      case 'backpack':
        ctx.fillStyle = '#8B4513';
        ctx.beginPath(); ctx.roundRect(-50, -50, 100, 100, 10); ctx.fill();
        ctx.fillStyle = '#D2691E'; // Pocket
        ctx.beginPath(); ctx.roundRect(-40, 0, 80, 40, 5); ctx.fill();
        break;
      case 'magic':
        ctx.strokeStyle = 'cyan'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 90, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI * 2); ctx.stroke();
        // Runes/Glow
        break;
    }
    ctx.restore()
  }

  const drawFrontAccessory = (ctx, creature) => {
    ctx.save()
    ctx.translate(150, 150)
    const type = creature.accessoryProps?.type || 'none';

    switch (type) {
      // --- HEADGEAR ---
      case 'tophat':
        ctx.fillStyle = '#111';
        ctx.fillRect(-40, -90, 80, 60); // Cylinder
        ctx.fillRect(-60, -30, 120, 10); // Brim
        ctx.fillStyle = '#f00'; ctx.fillRect(-40, -40, 80, 10); // Ribbon
        break;
      case 'cowboy':
        ctx.fillStyle = '#8B4513';
        ctx.beginPath(); ctx.ellipse(0, -40, 70, 20, 0, Math.PI, 0); ctx.fill(); // Brim top
        ctx.beginPath(); ctx.ellipse(0, -40, 70, 20, 0, 0, Math.PI); ctx.fill(); // Brim bottom (visual)
        ctx.fillRect(-40, -80, 80, 50); // Crown
        break;
      case 'crown':
        ctx.fillStyle = '#FFD700'; ctx.strokeStyle = '#DAA520';
        ctx.beginPath(); ctx.moveTo(-40, -60);
        ctx.lineTo(-30, -90); ctx.lineTo(-20, -70); ctx.lineTo(0, -95);
        ctx.lineTo(20, -70); ctx.lineTo(30, -90); ctx.lineTo(40, -60);
        ctx.lineTo(40, -50); ctx.lineTo(-40, -50); ctx.closePath();
        ctx.fill(); ctx.stroke();
        break;
      case 'helmet':
        ctx.fillStyle = '#ccc'; ctx.strokeStyle = '#555';
        ctx.beginPath(); ctx.arc(0, -20, 65, Math.PI, 0); ctx.lineTo(65, 20); ctx.lineTo(0, 50); ctx.lineTo(-65, 20); ctx.closePath();
        ctx.fill(); ctx.stroke();
        // Slit
        ctx.fillStyle = '#111'; ctx.fillRect(-40, -10, 80, 5);
        break;
      case 'horns':
        ctx.fillStyle = '#ccc';
        ctx.beginPath(); ctx.moveTo(-40, -50); ctx.quadraticCurveTo(-60, -80, -30, -90); ctx.lineTo(-20, -50); ctx.fill();
        ctx.beginPath(); ctx.moveTo(40, -50); ctx.quadraticCurveTo(60, -80, 30, -90); ctx.lineTo(20, -50); ctx.fill();
        break;
      case 'antenna':
        ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, -100); ctx.stroke();
        ctx.fillStyle = '#0f0'; ctx.beginPath(); ctx.arc(0, -100, 5, 0, Math.PI * 2); ctx.fill();
        break;
      case 'halo':
        ctx.strokeStyle = 'yellow'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(0, -90, 40, 10, 0, 0, Math.PI * 2); ctx.stroke();
        break;
      case 'flower':
        ctx.fillStyle = 'pink';
        ctx.beginPath(); ctx.arc(40, -60, 15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'yellow'; ctx.beginPath(); ctx.arc(40, -60, 5, 0, Math.PI * 2); ctx.fill();
        break;

      // --- FACE ---
      case 'glasses':
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(-45, -10, 40, 20);
        ctx.fillRect(5, -10, 40, 20);
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke();
        break;
      case 'monocle':
        ctx.strokeStyle = 'gold'; ctx.lineWidth = 2; ctx.fillStyle = 'rgba(200,250,255,0.3)';
        ctx.beginPath(); ctx.arc(20, 0, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(35, 0); ctx.lineTo(35, 60); ctx.stroke(); // Chain
        break;
      case 'mask':
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.moveTo(-50, -10); ctx.lineTo(50, -10); ctx.lineTo(40, 20); ctx.lineTo(0, 10); ctx.lineTo(-40, 20); ctx.fill();
        // Eye holes
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(-20, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(20, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        break;
      case 'mustache':
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.quadraticCurveTo(15, 10, 30, 25); ctx.quadraticCurveTo(15, 20, 0, 20);
        ctx.moveTo(0, 20);
        ctx.quadraticCurveTo(-15, 10, -30, 25); ctx.quadraticCurveTo(-15, 20, 0, 20);
        ctx.fill();
        break;
      case 'eyepatch':
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(-20, 0, 15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-30, -10); ctx.lineTo(40, -40); ctx.stroke();
        break;
      case 'flies':
        ctx.fillStyle = '#000';
        for (let i = 0; i < 5; i++) {
          const x = Math.cos(Date.now() / 500 + i) * 50;
          const y = Math.sin(Date.now() / 500 + i) * 50 - 50;
          ctx.fillRect(x, y, 3, 3);
        }
        break;
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
