let ifaces = require('os').networkInterfaces();

let interfaces = () => {
  let result = [];
  Object.keys(ifaces).forEach( (ifname) => {
    ifaces[ifname].forEach(function (iface) {
      if (iface.internal !== false) {
        return;
      }

      result.push({
        'address': iface.address,
        'netmask': iface.netmask,
        'family': iface.family,
        'mac': iface.mac
      });
    });
  });

  return result;
};

module.exports = {
  interfaces: interfaces
};