export const apiKey = "a68d19c0d1754c47a2e10952240209";

export const weatherImages = {
  day: {
    "Partly cloudy": require("../assets/images/partlycloudy.png"),
    "Moderate rain": require("../assets/images/moderaterain.png"),
    "Patchy rain possible": require("../assets/images/moderaterain.png"),
    "Sunny": require("../assets/images/sun.png"),
    "Clear": require("../assets/images/sun.png"),
    "Overcast": require("../assets/images/cloud.png"),
    "Cloudy": require("../assets/images/cloud.png"),
    "Light rain": require("../assets/images/moderaterain.png"),
    "Moderate rain at times": require("../assets/images/moderaterain.png"),
    "Heavy rain": require("../assets/images/heavyrain.png"),
    "Heavy rain at times": require("../assets/images/heavyrain.png"),
    "Moderate or heavy freezing rain": require("../assets/images/heavyrain.png"),
    "Moderate or heavy rain shower": require("../assets/images/heavyrain.png"),
    "Moderate or heavy rain with thunder": require("../assets/images/heavyrain.png"),
    'Mist': require("../assets/images/mist.png"),
    'other': require("../assets/images/moderaterain.png"),
  },
  night: {
    "Partly cloudy": require("../assets/images/night_partlycloudy.png"),
    "Moderate rain": require("../assets/images/moderaterain.png"),
    "Patchy rain possible": require("../assets/images/moderaterain.png"),
    "Clear": require("../assets/images/night_clear.png"),
    "Overcast": require("../assets/images/cloud.png"),
    "Cloudy": require("../assets/images/cloud.png"),
    "Light rain": require("../assets/images/moderaterain.png"),
    "Moderate rain at times": require("../assets/images/moderaterain.png"),
    "Heavy rain": require("../assets/images/heavyrain.png"),
    "Heavy rain at times": require("../assets/images/heavyrain.png"),
    "Moderate or heavy freezing rain": require("../assets/images/heavyrain.png"),
    "Moderate or heavy rain shower": require("../assets/images/heavyrain.png"),
    "Moderate or heavy rain with thunder": require("../assets/images/heavyrain.png"),
    'Mist': require("../assets/images/mist.png"),
    'other': require("../assets/images/moderaterain.png"),
  }
};

export const getWeatherImage = (conditionText, isDay) => {
  const timeOfDay = isDay ? 'day' : 'night';
  return weatherImages[timeOfDay][conditionText] || weatherImages[timeOfDay]['other'];
};