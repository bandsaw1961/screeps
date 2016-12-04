module.exports = {

  findBest: function(creep) {
    return creep.pos.findClosestByRange(FIND_SOURCES, {
      filter: function(object){
        if(object.energy < object.energyCapacity / 3) {
          return false;
        }
        return true;
      }
    });
  },

};
