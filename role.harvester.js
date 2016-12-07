var sources = require('sources');

var roleHarvester = {

  roleName: 'harvester',

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
      creep.doTaskReplenish() || creep.doTaskBuild() || creep.doTaskSupplyContainer();
    }
    else {
      creep.doTaskHarvest('5836b92f8b8b9619519f354a')
    }
  }
};

module.exports = roleHarvester;
