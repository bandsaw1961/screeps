var sources = require('sources');

var roleHarvester = {

  roleName: 'harvester',

  spawn: function() {
    return Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, { role: this.roleName, working: false});
  },

  /** @param {Creep} creep **/
  run: function(creep) {

    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.say("harvesting");
    }
    if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
      creep.say(`delvr ${creep.carry.energy}`);
    }

    if (creep.memory.working) {
      creep.doTaskReplenish();
    }
    else {
      creep.doTaskHarvest('5836b92f8b8b9619519f354a')
    }
  }
};

module.exports = roleHarvester;
