var sources = require('sources');

var roleUpgrader = {

  roleName: 'upgrader',

  spawn: function(spawnPoint) {
    return spawnPoint.createCreep([WORK,WORK,CARRY,MOVE], undefined, { role: this.roleName, working: false});
  },

  run: function(creep) {

    if(creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.say('harvesting');
    }
    if(!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('upgrading');
    }

    if(creep.memory.working) {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
    else {
      const source = Game.getObjectById('5836b92f8b8b9619519f354b')
      // var source = sources.findBest(creep);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
};

module.exports = roleUpgrader;
