const info = (...args) => {
  args && args.forEach((arg) => console.info(JSON.stringify(arg, null, 2)));
};

const warn = (...args) => {
  args && args.forEach((arg) => console.warn(JSON.stringify(arg, null, 2)));
};

const error = (...args) => {
  args && args.forEach((arg) => console.error(JSON.stringify(arg, null, 2)));
};

module.exports = { info, warn, error };
