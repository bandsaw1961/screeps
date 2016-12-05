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

};
