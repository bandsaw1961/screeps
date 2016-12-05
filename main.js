var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRoadrepairer = require('role.roadrepair');
var game = require('game');
require('prototype.creep')();

module.exports.loop = function () {

  Memory.wallHits = 500;

  // Remove dead memory
  for (let name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      delete Memory.creeps[name];
    }
  }

  _.each(game.findAllStructures(STRUCTURE_TOWER), (tower) => {
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
  });

  // Safe mode
  _.each(game.findAllStructures(STRUCTURE_CONTROLLER), (controller) => {
    if (controller.safeMode === undefined && controller.safeModeAvailable > 0) {
      controller.activateSafeMode();
    }
  });

  // In order of priority
  const creeps = [
    { role: 'harvester',    count: 10, handler: roleHarvester },
    { role: 'upgrader',     count: 10, handler: roleUpgrader },
    { role: 'builder',      count: 8, handler: roleBuilder },
    { role: 'roadrepairer', count: 3, handler: roleRoadrepairer }
  ]

  Memory.needToSpawn = false;

  // Respawn missing creeps
  let spawnPoint = Game.spawns.Spawn1;
  let creepCount = {};
  let s = "";
  _.each(Game.creeps, (c) => creepCount[c.memory.role] = (creepCount[c.memory.role] || 0) + 1);
  _.each(creeps, (c) => {
    s += `${c.role} ${(creepCount[c.role]||0)}/${c.count} `;
    if ((creepCount[c.role] || 0) < c.count && !Memory.needToSpawn) {
      Memory.needToSpawn = true;
      let name = c.handler.spawn(spawnPoint);
      if (!(name < 0)) {
        spawning = true;
        console.log(`Spawning: ${name} ${c.role} ${(creepCount[c.role] || 0)+1}/${c.count}`)
      }
    }
  });
  // console.log(s);

  // Run each creep
  for(let name in Game.creeps) {
    let creep = Game.creeps[name];
    // creep.memory.role = 'harvester';
    let c = _.find(creeps, (c) => c.role === creep.memory.role);
    if (c) {
      c.handler.run(creep)
    }
  }

}
