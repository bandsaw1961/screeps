module.exports = {

  run: function(creep) {
    if(creep.energy == 0) {
      var spwn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
      creep.moveTo(spwn);
      if((spwn) > [199]) {
        spwn.transferEnergy(creep);
      }
    } else {
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
    }
  },
}
