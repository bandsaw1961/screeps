module.exports = {

  run: function(creep) {
    if(creep.energy == 0) {
      var spwn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
      creep.moveTo(spwn);
      if((spwn) > [199]) {
        spwn.transferEnergy(creep);
      }
    } else {
      var SR = creep.pos.findClosestByRange(FIND_STRUCTURES, {
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
      if(targets.length) {
        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }
  },
}
