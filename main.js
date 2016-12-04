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
    { name: 'harvester',    count: 20, role: roleHarvester },
    { name: 'upgrader',     count: 12, role: roleUpgrader },
    { name: 'builder',      count: 8, role: roleBuilder },
    { name: 'roadrepairer', count: 1, role: roleRoadrepairer }
  ]

  // Run each creep
  for(let name in Game.creeps) {
    let creep = Game.creeps[name];
    // creep.memory.role = 'harvester';
    let c = _.find(creeps, (c) => c.name === creep.memory.role);
    if (c) {
      c.role.run(creep)
    }
  }

  // Respawn missing creeps
  let spawnPoint = Game.spawns.Spawn1;
  let creepCount = {};
  let s = "";
  let spawning = false;
  _.each(Game.creeps, (c) => creepCount[c.memory.role] = (creepCount[c.memory.role] || 0) + 1);
  _.each(creeps, (c) => {
    s += `${c.name} ${(creepCount[c.name]||0)}/${c.count} `;
    if (((creepCount[c.name] || 0) < c.count) && !spawning) {
      let name = c.role.spawn(spawnPoint);
      if (!(name < 0)) {
        spawning = true;
        console.log(`Spawned: ${name} ${c.name} ${(creepCount[c.name] || 0)+1}/${c.count}`)
      }
    }
  });
  console.log(s);
}
