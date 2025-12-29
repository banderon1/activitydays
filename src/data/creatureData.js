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
