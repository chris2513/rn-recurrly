// New v5 way
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro"); // Note the capital 'W'

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "@/global.css" });