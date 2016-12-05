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

  Creep.prototype.findNearestEnergy = function() {
    return this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          s.structureType == STRUCTURE_SPAWN ||
          s.structureType == s.STRUCTURE_EXTENSION
        ) && s.energy && s.energy > s.energyCapacity / 2;
      }});
  };

  Creep.prototype.doTaskHarvest = function(site) {
    const source = site ? Game.getObjectById(site) : this.findBestSource();
    if(this.harvest(source) == ERR_NOT_IN_RANGE) {
      this.moveTo(source);
    }
    return true;
  };

  Creep.prototype.doTaskReplenish = function() {
    const target = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => {
        return (s.structureType == STRUCTURE_SPAWN ||
                s.structureType == STRUCTURE_EXTENSION ||
                s.structureType == STRUCTURE_TOWER && !Memory.needToSpawn) && s.energy < s.energyCapacity;
      }
    });
    if (target) {
      if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
      return true;
    } else {
      return false;
    }
  };

  Creep.prototype.doTaskRepair = function() {
    const target = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => {
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
    const target = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < 2*s.energyCapacity/3 });
    if (target) {
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

  // Either get energy from storage or harvest
  Creep.prototype.getEnergy = function(site) {
    if (this.memory.harvest) {
      const source = site ? Game.getObjectById(site) : this.findBestSource();
      if(this.harvest(source) == ERR_NOT_IN_RANGE) {
        this.moveTo(source);
      }
    } else {
      var source;
      if (!Memory.needToSpawn && (source = this.findNearestEnergy())) {
        const energy = Math.min([this.carryCapacity, source.energy])
        if(this.withdraw(source, RESOURCE_ENERGY, energy) == ERR_NOT_IN_RANGE) {
          this.moveTo(source);
        }
      } else {
        // Switch to harvesting if no energy available or we need to spawn
        this.memory.harvest = true;
        this.getEnergy(site);
      }
    }
  };

};
