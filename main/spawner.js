/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

  creeps: { harvester: 10, upgrader: 4, builder: 4 },

  run: function() {
    for (let name in Memory.creeps) {
        if (Game.creeps[name] === undefined) {
            delete Memory.creeps[name];
        }
    }

    let creepCount = {};
    _.each(Game.creeps, (c) => creepCount[c.memory.role] = (creepCount[c.memory.role] || 0) + 1);
    _.each(Object.keys(this.creeps), (type) => {
      console.log(`${type}: ${creepCount[type]}`);
      if ((creepCount[type] || 0) < this.creeps[type]) {
        Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE,MOVE], undefined, { role: type, working: false});
      }
    });
  }
};
