var sources = require('sources');

var roleBuilder = {

  roleName: 'builder',

  run: function(creep) {

    // If we have no harvesters, switch role
    if (Memory.creepCount['harvester'] < 1) {
      creep.memory.role = 'harvester';
    }
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.memory.harvest = true;
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
      creep.getEnergy();
    }
  }
};

module.exports = roleBuilder;
