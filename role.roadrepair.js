var sources = require('sources');

module.exports = {

  roleName: 'roadrepairer',

  spawn: function() {
   return Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], undefined, { role: this.roleName, working: false});
  },

  run: function(creep) {

    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.say('harvesting');
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('repairing');
    }

    if(creep.memory.working) {
      var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(object){
          if(object.structureType != STRUCTURE_ROAD ) {
            return false;
          }
          if(object.hits > object.hitsMax / 3) {
            return false;
          }
          return true;
        }
      });
      if(target) {
        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    } else {
      var source = sources.findBest(creep);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  },
}
