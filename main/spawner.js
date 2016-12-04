/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

  creeps: { harvester: 5, upgrader: 6, builder: 6 },

  respawn: function() {
    for (let name in Memory.creeps) {
        if (Game.creeps[name] === undefined) {
            delete Memory.creeps[name];
        }
    }

    let creepCount = {};
    let s = "";
    _.each(Game.creeps, (c) => creepCount[c.memory.role] = (creepCount[c.memory.role] || 0) + 1);
    _.each(Object.keys(this.creeps), (type) => {
      s = s + `${type}: ${creepCount[type]} `;
      if ((creepCount[type] || 0) < this.creeps[type]) {
        let name = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE,MOVE], undefined, { role: type, working: false});
        if (!(name < 0)) {
          console.log(`Spawned: ${name} ${type}`)
        }
      }
    });
    // console.log(s);
  }
};
