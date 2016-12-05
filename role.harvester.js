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
      creep.say(`del ${creep.carry.energy}`);
    }

    if(creep.memory.working) {
      const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });
      if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
    else {
      creep.doTaskHarvest('5836b92f8b8b9619519f354a')
    }
  }
};

module.exports = roleHarvester;
