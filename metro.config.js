const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    blockList: [
      /(\\__tests__\\.*)$/,
      /.*[\\/]android[\\/](\.gradle|\.cxx|build|app[\\/]build|app[\\/]\.cxx)[\\/].*/,
      /.*[\\/]node_modules[\\/].*[\\/]android[\\/]build[\\/].*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
