var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRoadrepairer = require('role.roadrepair');

module.exports.loop = function () {

  // Remove dead memory
  for (let name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      delete Memory.creeps[name];
    }
  }

  // var tower = Game.getObjectById('38f58cda47bb69d630158492');
  // if(tower) {
  //   var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
  //     filter: (structure) => structure.hits < structure.hitsMax
  //   });
  //   if(closestDamagedStructure) {
  //     tower.repair(closestDamagedStructure);
  //   }
  //
  //   var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  //   if(closestHostile) {
  //     tower.attack(closestHostile);
  //   }
  // }

  // In order of priority
  const creeps = [
    { role: 'harvester',    count: 14, handler: roleHarvester },
    { role: 'upgrader',     count: 8, handler: roleUpgrader },
    { role: 'builder',      count: 8, handler: roleBuilder },
    { role: 'roadrepairer', count: 3, handler: roleRoadrepairer }
  ]

  Memory.needToSpawn = false;

  // Respawn missing creeps
  let spawnPoint = Game.spawns.Spawn1;
  let creepCount = {};
  let s = "";
  let spawning = false;
  _.each(Game.creeps, (c) => creepCount[c.memory.role] = (creepCount[c.memory.role] || 0) + 1);
  _.each(creeps, (c) => {
    s += `${c.role} ${(creepCount[c.role]||0)}/${c.count} `;
    if ((creepCount[c.role] || 0) < c.count) {
      Memory.needToSpawn = true;
      if (!spawning) {
        let name = c.handler.spawn(spawnPoint);
        if (!(name < 0)) {
          spawning = true;
          console.log(`Spawning: ${name} ${c.role} ${(creepCount[c.role] || 0)+1}/${c.count}`)
        }
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
