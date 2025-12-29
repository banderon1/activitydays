export const generateBodyTypes = () => {
    const types = []

    // Basic Shapes
    const basicShapes = ['round', 'square', 'triangle', 'blob']
    const basicNames = {
        'round': 'Circle',
        'square': 'Block',
        'triangle': 'Wedge',
        'blob': 'Slime'
    }
    basicShapes.forEach((shape) => {
        types.push({
            id: `basic_${shape}`,
            name: basicNames[shape],
            type: shape,
            stats: { speed: 5, strength: 5, defense: 5 }
        })
    })

    // Stars
    // 3-12 points
    const starPrefixes = {
        3: 'Tri', 4: 'Quad', 5: 'Penta', 6: 'Hexa',
        7: 'Hepta', 8: 'Octa', 9: 'Nona', 10: 'Deca',
        11: 'Hendeca', 12: 'Dodeca'
    }
    for (let i = 3; i <= 12; i++) {
        types.push({
            id: `star_${i}`,
            name: `${starPrefixes[i]}star`,
            type: 'star',
            points: i,
            stats: {
                speed: 5 + Math.floor(i / 2),
                strength: 4 + Math.floor(i / 3),
                defense: 5 - Math.floor(i / 4)
            }
        })
    }

    // Polygons
    // 3-12 sides
    const polyNames = {
        3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon',
        7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon',
        11: 'Hendecagon', 12: 'Dodecagon'
    }
    for (let i = 3; i <= 12; i++) {
        types.push({
            id: `poly_${i}`,
            name: polyNames[i] || `Polygon-${i}`,
            type: 'polygon',
            sides: i,
            stats: {
                defense: 5 + Math.floor(i / 2),
                strength: 5 + Math.floor(i / 4),
                speed: 6 - Math.floor(i / 3)
            }
        })
    }

    // Rocks (1-10 roughness)
    // Map roughness to creative names
    const rockNames = [
        'Smooth Stone', 'Pebble', 'Cobble', 'Rock',
        'Boulder', 'Crag', 'Shard', 'Spire',
        'Monolith', 'Mountain'
    ]
    for (let i = 1; i <= 10; i++) {
        types.push({
            id: `rock_${i}`,
            name: rockNames[i - 1],
            type: 'rock',
            roughness: i,
            stats: {
                defense: 7 + Math.floor(i / 2),
                speed: 4 - Math.floor(i / 4),
                strength: 6
            }
        })
    }

    // Clouds (1-10 fluffiness)
    const cloudNames = [
        'Wisp', 'Mist', 'Puff', 'Vapor',
        'Cloud', 'Cumulus', 'Stratus', 'Nimbus',
        'Storm', 'Hurricane'
    ]
    for (let i = 1; i <= 10; i++) {
        types.push({
            id: `cloud_${i}`,
            name: cloudNames[i - 1],
            type: 'cloud',
            fluffiness: i,
            stats: {
                speed: 6 + Math.floor(i / 3),
                defense: 5 + Math.floor(i / 4),
                strength: 4
            }
        })
    }

    return types
}

export const bodyTypes = generateBodyTypes()

export const generateEyeTypes = () => {
    const types = []

    // 1. Basic Eyes
    // Neutral stats
    const basicEyes = [
        { id: 'eye_dots', name: 'Standard Dots', type: 'dots', stats: { speed: 2, strength: 2, defense: 2 } },
        { id: 'eye_anime', name: 'Sparkle Anime', type: 'anime', stats: { speed: 3, strength: 1, defense: 2 } },
        { id: 'eye_big', name: 'Big Puppy', type: 'big', stats: { speed: 1, strength: 1, defense: 3 } }, // cuteness = defense?
        { id: 'eye_small', name: 'Beady Small', type: 'small', stats: { speed: 3, strength: 2, defense: 1 } }
    ]
    types.push(...basicEyes)

    // 2. Emotions
    const emotionEyes = [
        { id: 'eye_angry', name: 'Furious', type: 'angry', stats: { strength: 6, defense: 1, speed: 3 } },
        { id: 'eye_sad', name: 'Teary', type: 'sad', stats: { defense: 5, strength: 1, speed: 2 } },
        { id: 'eye_bored', name: 'Unimpressed', type: 'bored', stats: { defense: 6, speed: 1, strength: 2 } },
        { id: 'eye_happy', name: 'Joyful', type: 'happy', stats: { speed: 6, strength: 2, defense: 2 } },
        { id: 'eye_crazy', name: 'Wild', type: 'crazy', stats: { strength: 5, speed: 5, defense: 0 } }
    ]
    types.push(...emotionEyes)

    // 3. Monster Eyes
    const monsterEyes = [
        { id: 'eye_cyclops', name: 'Cyclops', type: 'cyclops', stats: { strength: 8, defense: 3, speed: 1 } },
        { id: 'eye_triclops', name: 'Tri-clops', type: 'triclops', stats: { speed: 5, strength: 4, defense: 3 } },
        { id: 'eye_spider_3', name: 'Spider (3 Eyes)', type: 'spider', count: 3, stats: { speed: 6, defense: 3, strength: 2 } },
        { id: 'eye_spider_5', name: 'Spider (5 Eyes)', type: 'spider', count: 5, stats: { speed: 8, defense: 2, strength: 2 } },
        { id: 'eye_snail', name: 'Snail Stalks', type: 'snail', stats: { defense: 7, speed: 1, strength: 2 } },
        { id: 'eye_vertical', name: 'Vertical Slit', type: 'vertical', stats: { strength: 5, speed: 4, defense: 2 } }
    ]
    types.push(...monsterEyes)

    // 4. Tech/Magic Eyes
    const techEyes = [
        { id: 'eye_visor', name: 'Cyber Visor', type: 'visor', stats: { defense: 8, strength: 3, speed: 3 } },
        { id: 'eye_laser', name: 'Laser Beam', type: 'laser', stats: { strength: 9, speed: 4, defense: 1 } },
        { id: 'eye_hypno', name: 'Hypno Spiral', type: 'hypno', stats: { speed: 7, defense: 4, strength: 1 } },
        { id: 'eye_matrix', name: 'Digital Matrix', type: 'matrix', stats: { speed: 6, defense: 5, strength: 3 } },
        { id: 'eye_glowing', name: 'Glowing Orbs', type: 'glowing', stats: { strength: 6, speed: 5, defense: 2 } },
        { id: 'eye_scanner', name: 'Target Scope', type: 'scanner', stats: { strength: 7, speed: 6, defense: 2 } }
    ]
    types.push(...techEyes)

    return types
}

export const eyeTypes = generateEyeTypes()

export const generateColors = () => {
    // 21 Colors with stats
    // Strength (Red/Orange), Speed (Blue/Cyan/Yellow), Defense (Green/Brown/Grey)
    return [
        // REDS (Strength)
        { id: 'col_red', name: 'Fiery Red', value: '#FF4136', stats: { strength: 3, speed: 1, defense: 0 } },
        { id: 'col_crimson', name: 'Deep Crimson', value: '#85144b', stats: { strength: 4, defense: 1, speed: 0 } },
        { id: 'col_maroon', name: 'Maroon', value: '#600000', stats: { strength: 3, defense: 2, speed: 0 } },


        // ORANGES/YELLOWS (Mixed Strength/Speed)
        { id: 'col_orange', name: 'Blaze Orange', value: '#FF851B', stats: { strength: 2, speed: 2, defense: 0 } },
        { id: 'col_gold', name: 'Golden', value: '#FFD700', stats: { speed: 1, defense: 1, strength: 1 } }, // Balanced
        { id: 'col_yellow', name: 'Lightning Yellow', value: '#FFDC00', stats: { speed: 4, strength: 1, defense: -1 } },

        // GREENS (Defense/Speed)
        { id: 'col_lime', name: 'Toxic Lime', value: '#01FF70', stats: { speed: 3, defense: 0, strength: 1 } },
        { id: 'col_green', name: 'Leaf Green', value: '#2ECC40', stats: { defense: 2, speed: 2, strength: 0 } },
        { id: 'col_forest', name: 'Forest Green', value: '#155e26', stats: { defense: 3, strength: 1, speed: 0 } },
        { id: 'col_olive', name: 'Olive', value: '#3D9970', stats: { defense: 4, speed: -1, strength: 1 } },

        // BLUES (Speed/Defense)
        { id: 'col_aqua', name: 'Aqua', value: '#7FDBFF', stats: { speed: 3, defense: 1, strength: 0 } },
        { id: 'col_sky', name: 'Sky Blue', value: '#6EC6FF', stats: { speed: 3, defense: 0, strength: 0 } },
        { id: 'col_blue', name: 'Ocean Blue', value: '#0074D9', stats: { defense: 2, strength: 1, speed: 1 } },
        { id: 'col_navy', name: 'Navy', value: '#001f3f', stats: { defense: 3, strength: 2, speed: -1 } },

        // PURPLES/PINKS (Magic/Wild)
        { id: 'col_purple', name: 'Mystic Purple', value: '#B10DC9', stats: { speed: 2, strength: 2, defense: 0 } },
        { id: 'col_fuchsia', name: 'Fuchsia', value: '#F012BE', stats: { speed: 3, strength: 1, defense: 0 } },
        { id: 'col_lavender', name: 'Lavender', value: '#E6E6FA', stats: { speed: 2, defense: 1, strength: 0 } },

        // MONOCHROME/EARTH (Defense)
        { id: 'col_white', name: 'Ghost White', value: '#FFFFFF', stats: { speed: 2, defense: 0, strength: 0 } },

        { id: 'col_grey', name: 'Steel Grey', value: '#AAAAAA', stats: { defense: 3, strength: 1, speed: 0 } },
        { id: 'col_brown', name: 'Earth Brown', value: '#8B4513', stats: { defense: 3, strength: 2, speed: -1 } }
    ]
}

export const colors = generateColors()

export const generateMouthTypes = () => {
    const types = []

    // 1. Basic Mouths (Neutral/Balanced)
    const basicMouths = [
        { id: 'mouth_smile', name: 'Happy Smile', type: 'smile', stats: { speed: 2, strength: 1, defense: 2 } },
        { id: 'mouth_frown', name: 'Sad Frown', type: 'frown', stats: { defense: 3, strength: 1, speed: 1 } },
        { id: 'mouth_neutral', name: 'Stoic Line', type: 'neutral', stats: { defense: 4, strength: 1, speed: 0 } },
        { id: 'mouth_open', name: 'Surprised O', type: 'open', stats: { speed: 3, defense: 1, strength: 1 } },
        { id: 'mouth_tongue', name: 'Silly Tongue', type: 'tongue', stats: { speed: 4, strength: 1, defense: 0 } },
    ]
    types.push(...basicMouths)

    // 2. Animal/Nature (Speed/Defense)
    const animalMouths = [
        { id: 'mouth_cat', name: 'Kitty :3', type: 'cat', stats: { speed: 5, defense: 0, strength: 0 } },
        { id: 'mouth_dog', name: 'Puppy Pant', type: 'dog', stats: { speed: 4, strength: 1, defense: 0 } },
        { id: 'mouth_beak', name: 'Sharp Beak', type: 'beak', stats: { speed: 5, strength: 2, defense: -2 } },
        { id: 'mouth_rabbit', name: 'Buck Teeth', type: 'rabbit', stats: { speed: 4, defense: 2, strength: -1 } },
        { id: 'mouth_snout', name: 'Pig Snout', type: 'snout', stats: { defense: 4, strength: 2, speed: -1 } },
    ]
    types.push(...animalMouths)

    // 3. Monster/Aggressive (Strength)
    const monsterMouths = [
        { id: 'mouth_fangs', name: 'Vampire Fangs', type: 'fangs', stats: { strength: 5, speed: 2, defense: -2 } },
        { id: 'mouth_tusks', name: 'Orc Tusks', type: 'tusks', stats: { strength: 6, defense: 2, speed: -3 } },
        { id: 'mouth_shark', name: 'Shark Teeth', type: 'toothy', stats: { strength: 7, speed: 1, defense: -3 } },
        { id: 'mouth_leech', name: 'Leech Sucker', type: 'leech', stats: { strength: 5, defense: 3, speed: -3 } },
        { id: 'mouth_gaping', name: 'Gaping Maw', type: 'gaping', stats: { strength: 8, defense: 0, speed: -3 } },
    ]
    types.push(...monsterMouths)

    // 4. Tech/Weird (Special)
    const techMouths = [
        { id: 'mouth_speaker', name: 'Speaker Grill', type: 'speaker', stats: { defense: 5, strength: 0, speed: 0 } },
        { id: 'mouth_vent', name: 'Exhaust Vent', type: 'vent', stats: { speed: 5, defense: 2, strength: -2 } },
        { id: 'mouth_stitch', name: 'Stitched Shut', type: 'stitch', stats: { defense: 8, speed: -2, strength: -1 } },
        { id: 'mouth_zipper', name: 'Zipper', type: 'zipper', stats: { defense: 6, speed: -1, strength: 0 } },
        { id: 'mouth_void', name: 'Dark Void', type: 'void', stats: { strength: 4, defense: 4, speed: -3 } },
        { id: 'mouth_mustache', name: 'Gentleman', type: 'mustache', stats: { defense: 3, strength: 2, speed: 0 } }
    ]
    types.push(...techMouths)

    return types
}

export const mouthTypes = generateMouthTypes()

export const generateArmTypes = () => {
    const types = []

    // 1. Basic Arms (Balanced)
    const basicArms = [
        { id: 'arm_none', name: 'No Arms', type: 'none', stats: { speed: 2, strength: 0, defense: 0 } },
        { id: 'arm_start', name: 'Stick Arms', type: 'small', stats: { strength: 1, defense: 0, speed: 0 } },
        { id: 'arm_noodle', name: 'Noodle Arms', type: 'noodle', stats: { strength: 1, speed: 1, defense: 0 } },
        { id: 'arm_long', name: 'Long Reach', type: 'long', stats: { strength: 2, defense: 1, speed: -1 } },
        { id: 'arm_fat', name: 'Chubby Arms', type: 'fat', stats: { defense: 2, strength: 2, speed: -1 } },
    ]
    types.push(...basicArms)

    // 2. Muscle/Strength (Strength Focus)
    const muscleArms = [
        { id: 'arm_brawny', name: 'Brawny', type: 'muscle', stats: { strength: 5, defense: 2, speed: -2 } },
        { id: 'arm_ripped', name: 'Ripped', type: 'ripped', stats: { strength: 6, defense: 1, speed: -1 } },
        { id: 'arm_hulk', name: 'Hulking', type: 'hulk', stats: { strength: 8, defense: 3, speed: -4 } },
        { id: 'arm_boxer', name: 'Boxer Gloves', type: 'gloves', stats: { strength: 4, defense: 4, speed: 0 } },
        { id: 'arm_knuckles', name: 'Brass Knuckles', type: 'knuckles', stats: { strength: 5, speed: 1, defense: 0 } },
    ]
    types.push(...muscleArms)

    // 3. Monster/Nature (Speed/Special)
    const monsterArms = [
        { id: 'arm_tentacle', name: 'Tentacles', type: 'tentacle', stats: { speed: 3, strength: 2, defense: 1 } },
        { id: 'arm_claws', name: 'Sharp Claws', type: 'claws', stats: { strength: 5, speed: 2, defense: -1 } },
        { id: 'arm_wings', name: 'Bat Wings', type: 'wings', stats: { speed: 6, defense: 1, strength: 0 } },
        { id: 'arm_fins', name: 'Shark Fins', type: 'fins', stats: { speed: 5, strength: 2, defense: 1 } },
        { id: 'arm_vines', name: 'Thorn Vines', type: 'vines', stats: { defense: 4, strength: 1, speed: 1 } },
        { id: 'arm_slug', name: 'Slime Trails', type: 'slug', stats: { defense: 5, speed: -2, strength: 1 } },
    ]
    types.push(...monsterArms)

    // 4. Tech/Utility (Defense/Utility)
    const techArms = [
        { id: 'arm_robot', name: 'Robot Arms', type: 'robot', stats: { strength: 4, defense: 3, speed: -1 } },
        { id: 'arm_drill', name: 'Drill Hands', type: 'drill', stats: { strength: 7, defense: 1, speed: -2 } },
        { id: 'arm_magnet', name: 'Magnets', type: 'magnet', stats: { defense: 4, speed: 1, strength: 1 } },
        { id: 'arm_shield', name: 'Shields', type: 'shield', stats: { defense: 8, strength: 1, speed: -3 } },
        { id: 'arm_cannon', name: 'Arm Cannons', type: 'cannon', stats: { strength: 6, speed: -1, defense: 2 } },
        { id: 'arm_saw', name: 'Buzzsaws', type: 'saw', stats: { strength: 7, speed: 1, defense: -2 } }
    ]
    types.push(...techArms)

    return types
}

export const armTypes = generateArmTypes()

export const generateLegTypes = () => {
    const types = []

    // 1. Basic Legs (Balanced)
    const basicLegs = [
        { id: 'leg_none', name: 'No Legs', type: 'none', stats: { speed: 0, strength: 0, defense: 0 } },
        { id: 'leg_stumpy', name: 'Stumpy Legs', type: 'stumpy', stats: { speed: 1, strength: 1, defense: 0 } },
        { id: 'leg_human', name: 'Human Legs', type: 'human', stats: { speed: 3, strength: 2, defense: 0 } },
        { id: 'leg_stick', name: 'Stick Legs', type: 'stick', stats: { speed: 2, strength: 0, defense: 0 } },
        { id: 'leg_fat', name: 'Chubby Legs', type: 'fat', stats: { speed: 1, strength: 2, defense: 1 } },
    ]
    types.push(...basicLegs)

    // 2. Speed/Agility (Speed Focus)
    const speedLegs = [
        { id: 'leg_cat', name: 'Cat Paws', type: 'cat', stats: { speed: 6, strength: 2, defense: 0 } },
        { id: 'leg_cheetah', name: 'Cheetah Legs', type: 'cheetah', stats: { speed: 8, strength: 3, defense: -1 } },
        { id: 'leg_rabbit', name: 'Rabbit Feet', type: 'rabbit', stats: { speed: 7, strength: 1, defense: 0 } },
        { id: 'leg_wheels', name: 'Wheels', type: 'wheels', stats: { speed: 9, strength: 0, defense: 1 } },
        { id: 'leg_springs', name: 'Springs', type: 'springs', stats: { speed: 6, strength: 0, defense: -1 } },
    ]
    types.push(...speedLegs)

    // 3. Monster/Nature (Various)
    const monsterLegs = [
        { id: 'leg_spider', name: 'Spider Legs', type: 'spider', stats: { speed: 5, strength: 2, defense: 1 } }, // Multi-leg logic needed?
        { id: 'leg_tentacles', name: 'Tentacle Legs', type: 'tentacles', stats: { speed: 3, strength: 3, defense: 1 } },
        { id: 'leg_slime', name: 'Slime Trail', type: 'slime', stats: { speed: 1, defense: 4, strength: 1 } },
        { id: 'leg_hooves', name: 'Hooves', type: 'hooves', stats: { speed: 5, strength: 4, defense: 1 } },
        { id: 'leg_clawed', name: 'Raptor Claws', type: 'clawed', stats: { speed: 6, strength: 5, defense: 0 } },
        { id: 'leg_roots', name: 'Tree Roots', type: 'roots', stats: { speed: -2, defense: 6, strength: 3 } }
    ]
    types.push(...monsterLegs)

    // 4. Tech/Utility (Tech)
    const techLegs = [
        { id: 'leg_robot', name: 'Tech Walkers', type: 'walker', stats: { speed: 3, defense: 4, strength: 4 } },
        { id: 'leg_treads', name: 'Tank Treads', type: 'treads', stats: { speed: 2, defense: 7, strength: 5 } },
        { id: 'leg_jet', name: 'Hover Jet', type: 'jet', stats: { speed: 8, defense: 1, strength: 1 } },
        { id: 'leg_antigrav', name: 'Anti-Grav', type: 'antigrav', stats: { speed: 6, defense: 3, strength: 0 } },
        { id: 'leg_mech', name: 'Mech Legs', type: 'mech', stats: { strength: 6, defense: 5, speed: 2 } },
        { id: 'leg_skates', name: 'Roller Skates', type: 'skates', stats: { speed: 7, strength: 1, defense: 0 } }
    ]
    types.push(...techLegs)

    return types
}

export const legTypes = generateLegTypes()

const generateAccessoryTypes = () => {
    const types = [
        { id: 'acc_none', name: 'None', type: 'none', layer: 'front', stats: { speed: 0, strength: 0, defense: 0, health: 0 } },

        // --- HEADGEAR (Front/Top) ---
        { id: 'acc_hat_top', name: 'Top Hat', type: 'tophat', layer: 'front', stats: { speed: 0, strength: 0, defense: 0, health: 0 } },
        { id: 'acc_hat_cowboy', name: 'Cowboy Hat', type: 'cowboy', layer: 'front', stats: { speed: 1, strength: 0, defense: 0, health: 0 } },
        { id: 'acc_crown', name: 'Royal Crown', type: 'crown', layer: 'front', stats: { speed: 0, strength: 2, defense: 2, health: 0 } },
        { id: 'acc_helmet', name: 'Knight Helmet', type: 'helmet', layer: 'front', stats: { speed: -1, strength: 0, defense: 5, health: 0 } },
        { id: 'acc_horns', name: 'Demon Horns', type: 'horns', layer: 'front', stats: { speed: 0, strength: 3, defense: 0, health: 0 } },
        { id: 'acc_antenna', name: 'Alien Antenna', type: 'antenna', layer: 'front', stats: { speed: 2, strength: 0, defense: 0, health: 0 } },
        { id: 'acc_halo', name: 'Angel Halo', type: 'halo', layer: 'front', stats: { speed: 0, strength: 0, defense: 1, health: 5 } },
        { id: 'acc_flower', name: 'Flower', type: 'flower', layer: 'front', stats: { speed: 0, strength: 0, defense: 0, health: 2 } },

        // --- FACE (Front) ---
        { id: 'acc_glasses', name: 'Sunglasses', type: 'glasses', layer: 'front', stats: { speed: 1, strength: 0, defense: 0, health: 0 } },
        { id: 'acc_monocle', name: 'Monocle', type: 'monocle', layer: 'front', stats: { speed: 0, strength: 0, defense: 0, health: 0 } },
        { id: 'acc_mask', name: 'Hero Mask', type: 'mask', layer: 'front', stats: { speed: 0, strength: 0, defense: 2, health: 0 } },
        { id: 'acc_mustache', name: 'Mustache', type: 'mustache', layer: 'front', stats: { speed: 0, strength: 1, defense: 0, health: 0 } },
        { id: 'acc_patch', name: 'Eye Patch', type: 'eyepatch', layer: 'front', stats: { speed: 0, strength: 2, defense: 0, health: 0 } },

        // --- BACK (Back) ---
        { id: 'acc_wings_bat', name: 'Bat Wings', type: 'wings_bat', layer: 'back', stats: { speed: 3, strength: 0, defense: 0, health: 0 } },
        { id: 'acc_wings_angel', name: 'Angel Wings', type: 'wings_angel', layer: 'back', stats: { speed: 2, strength: 0, defense: 1, health: 0 } },
        { id: 'acc_cape', name: 'Hero Cape', type: 'cape', layer: 'back', stats: { speed: 1, strength: 0, defense: 1, health: 0 } },
        { id: 'acc_jetpack', name: 'Jetpack', type: 'jetpack', layer: 'back', stats: { speed: 5, strength: 0, defense: 1, health: 0 } },
        { id: 'acc_spikes', name: 'Back Spikes', type: 'spikes', layer: 'back', stats: { speed: 0, strength: 0, defense: 4, health: 0 } },
        { id: 'acc_shell', name: 'Turtle Shell', type: 'shell', layer: 'back', stats: { speed: -2, strength: 0, defense: 8, health: 0 } },
        { id: 'acc_backpack', name: 'Backpack', type: 'backpack', layer: 'back', stats: { speed: -1, strength: 0, defense: 0, health: 5 } },

        // --- FLOATING (Front/All) ---
        { id: 'acc_flies', name: 'Swarm of Flies', type: 'flies', layer: 'front', stats: { speed: 0, strength: 0, defense: -1, health: -2 } },
        { id: 'acc_magic', name: 'Magic Aura', type: 'magic', layer: 'back', stats: { speed: 1, strength: 2, defense: 1, health: 0 } },
    ]
    return types
}

export const accessoryTypes = generateAccessoryTypes()
