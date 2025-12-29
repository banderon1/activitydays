import { legTypes } from './src/data/creatureData.js';

console.log('Leg Types Count:', legTypes.length);
console.log('First Leg:', legTypes[0]);
console.log('Wheels Leg:', legTypes.find(l => l.id === 'leg_wheels'));
console.log('Success');
