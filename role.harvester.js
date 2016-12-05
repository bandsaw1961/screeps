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
      creep.say("delivering");
    }

    if(creep.memory.working) {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }
    else {
      const source = Game.getObjectById('5836b92f8b8b9619519f354a')
      // var source = sources.findBest(creep);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
};

module.exports = roleHarvester;
