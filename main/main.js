var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRoadrepair = require('role.roadrepair');
var spawner = require('spawner');

module.exports.loop = function () {

  var tower = Game.getObjectById('38f58cda47bb69d630158492');
  if(tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
    });
    if(closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    }
  }

  var creeps = {
    harvester: { count: 8, role: roleHarvester },
    upgrader: { count: 8, role: roleUpgrader },
    builder: { count: 8, role: roleBuilder },
    roadrepair: { count: 1, role: roleRoadrepair }
  }

  // Run each creep
  for(var name in Game.creeps) {
    let creep = Game.creeps[name];
    let c = creeps[creep.memory.role];
    if (c) {
      c.role.run(creep;)
    }
  }

  // Remove dead memory
  for (let name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      delete Memory.creeps[name];
    }
  }

  // Respawn missing creeps
  let creepCount = {};
  _.each(Game.creeps, (c) => creepCount[c.memory.role] = (creepCount[c.memory.role] || 0) + 1);
  _.each(Object.keys(creeps), (role) => {
    if ((creepCount[role] || 0) < creeps[role].count) {
      let name = creeps[role].role.spawn();
      if (!(name < 0)) {
        console.log(`Spawned: ${name} ${role}`)
      }
    }
  });
}
