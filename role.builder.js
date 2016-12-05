var sources = require('sources');

var roleBuilder = {

  roleName: 'builder',

  spawn: function() {
    return Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], undefined, { role: this.roleName, working: false});
  },

  run: function(creep) {

    if(creep.memory.working && creep.carry.energy === 0 && Memory.needToSpawn) {
      creep.memory.working = false;
      creep.memory.harvest = true;
      creep.say('harvesting');
    }
    if(creep.memory.working && creep.carry.energy === 0 && !Memory.needToSpawn) {
      creep.memory.working = false;
      creep.memory.harvest = false;
      creep.say('withdrawing');
      console.log(`${creep.name} is withdrawing`);
    }
    if(!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('building');
    }

    if(creep.memory.working) {
      var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
      if(target) {
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      } else {
        creep.moveTo(Game.flags.Flag1)
      }
    }
    else {
      // Get energy from spawn if we don't need to spawn creeps
      if (creep.memory.harvest) {
        const source = Game.getObjectById('5836b92f8b8b9619519f354b')
        // const source = sources.findBest(creep);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      } else {
        const source = sources.findNearestEnergy(creep);
        if (source) {
          const energy = Math.min([creep.carryCapacity, source.energy])
          if(creep.withdraw(source, RESOURCE_ENERGY, energy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
          }
        }
      }
    }
  }
};

module.exports = roleBuilder;
