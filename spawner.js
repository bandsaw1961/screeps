/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function() {
        for (let name in Memory.creeps) {
            if (Game.creeps[name] === undefined) {
                delete Memory.creeps[name];
            }
        }
        
        var minimumCreeps = { 'harvester': 10, 'upgrader': 4 };
        var creepCount = { };
        _.each(Game.creeps, (c) => creepCount[c.memory.role] = (creepCount[c.memory.role] || 0) + 1);
        _.each(['harvester', 'upgrader'], (type) => {
            console.log(`${type}: ${creepCount[type]}`);
            if (creepCount[type] < minimumCreeps[type]) {
                Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE,MOVE], undefined, { role: type, working: false});
            }
        });        
        
    }
};