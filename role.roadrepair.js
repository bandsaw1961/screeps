var sources = require('sources');

module.exports = {

  roleName: 'roadrepairer',

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
      creep.say('repairing');
    }

    if (creep.memory.working) {
      creep.doTaskSupplyTower() || creep.doTaskRepair() || creep.doTaskUpgradeController();
    } else {
      creep.getEnergy('5836b92f8b8b9619519f354b');
    }
  },
}
