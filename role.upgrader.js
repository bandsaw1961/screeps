var sources = require('sources');

var roleUpgrader = {

  roleName: 'upgrader',

  run: function(creep) {

    if(creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.memory.harvest = false;
      creep.say('get energy');
    }
    if(!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('upgrading');
    }

    if(creep.memory.working) {
      creep.doTaskUpgradeController();
    }
    else {
      creep.getEnergy('5836b92f8b8b9619519f354b');
    }
  }
};

module.exports = roleUpgrader;
