module.exports = function() {

  RoomObject.prototype.doTaskRepair = function() {
    const target = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => {
        if (s.structureType == STRUCTURE_WALL) {
          return s.hits < Memory.wallHits;
        } else if (s.structureType == STRUCTURE_CONTAINER) {
          return s.hits < s.hitsMax;
        } else {
          return s.hits < 2 * s.hitsMax / 3;
        }
      }
    });
    if (target) {
      if(this.repair(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
      return true;
    } else {
      return false;
    }
  };

  RoomObject.prototype.doTaskAttack = function() {
    const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
      this.attack(target);
      return true;
    }
    return false;
  };

};
