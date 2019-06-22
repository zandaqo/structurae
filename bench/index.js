[
  ...require('./bits').suits,
  ...require('./graphs').suits,
  ...require('./grids').suits,
  ...require('./json-object-view').suits,
  ...require('./sorted').suits,
  ...require('./strings').suits,
].forEach(suite => suite.run());
