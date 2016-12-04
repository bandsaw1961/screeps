module.exports = {

  findBest: function(creep) {
    return creep.pos.findClosestByRange(FIND_SOURCES);
  },

};
