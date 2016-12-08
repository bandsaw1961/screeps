module.exports = function() {

  // Return true if id isn't someone elses target
  Creep.prototype.freeTarget = function(id) {
    return _.reduce(Memory.creeps, (acc, c, name) => acc && (name == this.name || id != c.myTarget), true);
  }

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

  Creep.prototype.findNearestStorage = function() {
    return this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => {
        return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
      }});
  };

  Creep.prototype.doTaskHarvest = function(site) {
    const source = site ? Game.getObjectById(site) : this.findBestSource();
    this.harvest(source);
    this.moveTo(source);
    return true;
  };

  Creep.prototype.doTaskReplenish = function() {

    var filter = (s) => {
      return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity; // && this.freeTarget(s.id);
    }

    const target = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: filter });
    if (target) {
      this.memory.myTarget = target.id;
      this.moveTo(target);
      _.forEach(this.pos.findInRange(FIND_STRUCTURES, 1, { filter: filter }), (s) => {
        this.transfer(s, RESOURCE_ENERGY);
      });
      return true;
    } else {
      this.memory.myTarget = undefined;
      return false;
    }
  };

  Creep.prototype.doTaskSupplyTower = function() {
    const target = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < 2*s.energyCapacity/3 });
    if (target) {
      this.memory.myTarget = target.id;
      if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
      return true;
    } else {
      this.memory.myTarget = undefined;
      return false;
    }
  };

  Creep.prototype.doTaskSupplyContainer = function() {
    const target = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity });
    if (target) {
      this.memory.myTarget = target.id;
      if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
      return true;
    } else {
      this.memory.myTarget = undefined;
      return false;
    }
  };

  // Focus on sites that have the most progress
  Creep.prototype.doTaskBuild = function() {
    var targets = _.sortBy(this.room.find(FIND_CONSTRUCTION_SITES), (s) => s.progressTotal - s.progress);
    if(targets.length > 0) {
      const target = targets[0];
      this.memory.myTarget = target.id;
      if(this.build(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
      return true;
    } else {
      this.memory.myTarget = undefined;
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
    const source = site ? Game.getObjectById(site) : this.findBestSource();
    const storage = this.findNearestStorage();
    if (this.memory.harvest) {
      if (source && (source.energy > 0 || !storage)) {
        this.harvest(source);
        this.moveTo(source);
      } else {
        // If there are no sources, switch back to finding an energy store
        this.memory.harvest = false;
        console.log(`${this.name} finding energy`);
      }
    } else {
      if (storage) {
        const energy = Math.min(this.carryCapacity, storage.store[RESOURCE_ENERGY]);
        if(this.withdraw(source, RESOURCE_ENERGY, energy) == ERR_NOT_IN_RANGE) {
          this.moveTo(source);
        }
      } else {
        // Switch to harvesting if no energy available or we need to spawn
        this.memory.harvest = true;
        console.log(`${this.name} switching to harvest`);
        this.getEnergy(site);
      }
    }
  };

};
