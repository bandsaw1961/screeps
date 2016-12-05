module.exports = function() {

  Creep.prototype.findBestSource = function() {
    return this.pos.findClosestByRange(FIND_SOURCES, {
      filter: function(object){
        if(object.energy < object.energyCapacity / 10) {
          return false;
        }
        return true;
      }
    });
  };

  Creep.prototype.doTaskHarvest = function(site) {
    const source = site ? Game.getObjectById(site) : this.findBestSource();
    if(this.harvest(source) == ERR_NOT_IN_RANGE) {
      this.moveTo(source);
    }
    return true;
  };

  Creep.prototype.doTaskRepair = function() {
    const target = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: function(s) {
        if (s.structureType == STRUCTURE_WALL) {
          return s.hits < Memory.wallHits;
        } else {
          return s.hits < s.hitsMax / 3;
        }
      }
    });
    if(target) {
      if(this.repair(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
      return true;
    } else {
      return false;
    }
  };

  Creep.prototype.doTaskSupplyTower = function() {
    if (target = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity })) {
      if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
      return true;
    } else {
      return false;
    }
  };

  Creep.prototype.doTaskBuild = function() {
    var target = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(target) {
      if(this.build(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
      return true;
    } else {
      return false;
    }
  };

  Creep.prototype.doTaskUpgradeController = function() {
    if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller);
    }
    return true;
  };

};
