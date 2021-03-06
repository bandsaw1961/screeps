require('prototype.creep')();
require('prototype.spawn')();
require('prototype.RoomObject')();

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRoadrepairer = require('role.roadrepair');
var game = require('game');

module.exports.loop = function () {

  Memory.wallHits = 20000;

  // Remove dead memory
  for (let name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      delete Memory.creeps[name];
    }
  }

  _.each(game.findAllStructures(STRUCTURE_TOWER), (tower) => {
    tower.doTaskRepair() || tower.doTaskAttack();
  });

  // Safe mode
  // _.each(game.findAllStructures(STRUCTURE_CONTROLLER), (controller) => {
  //   if (controller.room.find(FIND_HOSTILE_CREEPS).length > 0 && controller.safeMode === undefined && controller.safeModeAvailable > 0) {
  //     controller.activateSafeMode();
  //   }
  // });

  // In order of priority
  const creeps = [
    { role: 'harvester',    count: 3, handler: roleHarvester },
    { role: 'upgrader',     count: 2, handler: roleUpgrader },
    { role: 'builder',      count: 3, handler: roleBuilder },
    { role: 'roadrepairer', count: 1, handler: roleRoadrepairer }
  ]


  // Respawn missing creeps
  let spawnPoint = Game.spawns.Spawn1;
  Memory.creepCount = {};
  let s = "";
  Memory.needToSpawn = false;
  Memory.totalCreeps = 0;
  _.each(Game.creeps, (c) => {
    Memory.totalCreeps += 1;
    Memory.creepCount[c.memory.role] = (Memory.creepCount[c.memory.role] || 0) + 1
  });
  _.each(creeps, (c) => {
    s += `${c.role} ${(Memory.creepCount[c.role]||0)}/${c.count} `;
    if ((Memory.creepCount[c.role] || 0) < c.count && !Memory.needToSpawn) {
      Memory.needToSpawn = true;
      let energy = spawnPoint.room.energyCapacityAvailable;

      // If we are down to one or less creeps, then create one with whatever energy we have
      if ((Memory.totalCreeps || 0) <= 1) {
        energy = spawnPoint.room.energyAvailable;
      }
      let name = spawnPoint.createBalancedCreep(energy, c.role);
      if (!(name < 0)) {
        spawning = true;
        console.log(`Spawning: ${name} ${c.role} ${(Memory.creepCount[c.role] || 0)+1}/${c.count}`)
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
