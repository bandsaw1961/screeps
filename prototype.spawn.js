module.exports = function() {

  StructureSpawn.prototype.createBalancedCreep = function(energy, roleName) {
    const parts = Math.floor(energy / 200);
    let body = [];
    for (let i = 0 ; i < parts ; i++) {
      body.push(WORK);
    }
    for (let i = 0 ; i < parts ; i++) {
      body.push(CARRY);
    }
    for (let i = 0 ; i < parts ; i++) {
      body.push(MOVE);
    }
    return this.createCreep(body, undefined, { role: roleName, working: false });
  }

};
