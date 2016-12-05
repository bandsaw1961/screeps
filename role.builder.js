var sources = require('sources');

var roleBuilder = {

  roleName: 'builder',

  spawn: function() {
    return Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, { role: this.roleName, working: false});
  },

  run: function(creep) {

    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.memory.harvest = false;
      creep.say('get energy');
    }
    if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('building');
    }

    if (creep.memory.working) {
      creep.doTaskBuild() || creep.doTaskUpgradeController();
    }
    else {
      creep.getEnergy('5836b92f8b8b9619519f354b');
    }
  }
};

module.exports = roleBuilder;
