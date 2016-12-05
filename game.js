module.exports = {

  findAllStructures: function(type) {
    return _.flatten(_.map(Game.rooms, (room) => room.find(FIND_STRUCTURES, { filter: (structure) => structure.structureType == type })));
  },

};
