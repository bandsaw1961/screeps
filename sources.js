module.exports = {

  findBest: function(creep) {
    return creep.pos.findClosestByRange(FIND_SOURCES, {
      filter: function(object){
        if(object.energy < object.energyCapacity / 10) {
          return false;
        }
        return true;
      }
    });
  },

  findNearestSpawn: function(creep) {
    return creep.pos.findClosestByRange(FIND_MY_SPAWNS);
  },

  findNearestEnergy: function(creep) {
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          s.structureType == STRUCTURE_SPAWN ||
          s.structureType == s.STRUCTURE_EXTENSION
        ) && s.energy > s.energyCapacity / 2;
      }});
  },

};
