module.exports = function override(config, env) {
    console.log("React app rewired works!")
    console.log(config)
    config.resolve.fallback = {
      fs: false
    };
    return config;
  };

  