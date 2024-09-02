import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { MagnifyingGlassIcon as SearchIcon } from "react-native-heroicons/outline";
import { MapPinIcon as MapIcon } from "react-native-heroicons/solid";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { getWeatherImage } from "../constants"; // Assuming you updated getWeatherImage in this file
import * as Progress from "react-native-progress";
import * as Location from "expo-location"; // Import expo-location
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons for the settings icon

export default function HomeScreen() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCelsius, setIsCelsius] = useState(true); // Temperature unit state
  const [isKilometers, setIsKilometers] = useState(true); // Distance unit state
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const convertCelsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9) / 5 + 32); // Round to the nearest whole number
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const toggleDistanceUnit = () => {
    setIsKilometers(!isKilometers);
  };

  const handleLocation = (loc) => {
    console.log(locations);
    setLocations([]);
    setShowSearchBar(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      console.log(data);
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => setLocations(data));
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    // Request location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      fetchWeatherFallback();
      return;
    }

    // Get the user's current location
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Use the latitude and longitude to fetch the city name
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    let city = reverseGeocode[0].city;

    // Fetch weather data for the detected city
    fetchWeatherForecast({ cityName: city, days: "7" }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  // Fallback to a default city if location is not available
  const fetchWeatherFallback = () => {
    fetchWeatherForecast({ cityName: "Atlanta", days: "7" }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleDebounce = useCallback(debounce(handleSearch, 1000), []);
  const { current, location } = weather;

  return (
    <View className="h-[7] flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={13}
        source={{
          uri: "https://i.pinimg.com/736x/cf/37/59/cf3759d8676ccb5f629c45e7d204fb05.jpg",
        }}
        className="h-full w-full absolute"
      />

      {/* SETTINGS ICON */}
      <View className="absolute top-10 left-10 z-50">
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
          <MaterialIcons name="settings" size={30} color="white" />
        </TouchableOpacity>
        {showDropdown && (
          <View className="absolute left-0 mt-8 w-40 bg-white rounded-lg shadow-lg p-4 z-50">
            {/* Temperature Unit Toggle */}
            <TouchableOpacity
              onPress={toggleTemperatureUnit}
              className="flex-row justify-between items-center mb-3"
            >
              <Text className="text-lg text-gray-800">
                {isCelsius ? "Celsius" : "Fahrenheit"}
              </Text>
              <Feather
                name={isCelsius ? "toggle-right" : "toggle-left"}
                size={24}
                color={isCelsius ? "green" : "gray"}
              />
            </TouchableOpacity>
            {/* Distance Unit Toggle */}
            <TouchableOpacity
              onPress={toggleDistanceUnit}
              className="flex-row justify-between items-center"
            >
              <Text className="text-lg text-gray-800">
                {isKilometers ? "Kilometers" : "Miles"}
              </Text>
              <Feather
                name={isKilometers ? "toggle-right" : "toggle-left"}
                size={24}
                color={isKilometers ? "green" : "gray"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="white" />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/* SEARCH BAR SECTION */}
          <View className=" mx-4 relative z-50">
            <View
              className="flex-row justify-end items-center rounded-full "
              style={{
                backgroundColor: showSearchBar
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearchBar ? (
                <TextInput
                  onChangeText={handleDebounce}
                  placeholder="Search City"
                  placeholderTextColor={"white"}
                  className="h-12 pl-4 text-xl pb-1 flex-1"
                />
              ) : null}

              <TouchableOpacity
                onPress={() => setShowSearchBar(!showSearchBar)}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="p-3 rounded-full m-1"
              >
                <SearchIcon size={25} color="white" />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearchBar ? (
              <View
                className=" absolute w-full top-16 rounded-3xl "
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  borderBottomColor: "#f0f0f0",
                  backdropFilter: "blur(6px)",
                }}
              >
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      className={
                        "flex-row items-center m-1 p-3  px-4 " + borderClass
                      }
                    >
                      <MapIcon size={20} color={"black"} />
                      <Text className="text-black font-bold text-lg ml-2">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* FORECAST SECTION */}
          <View className="flex-1 flex justify-around mx-4 mb-2">
            <View className="flex-row items-center justify-center px-8">
              <Text className="text-white text-3xl font-bold items-center justify-center">
                {location?.name},
              </Text>
              <Text className="text-lg text-white font-semibold items-center justify-center">
                {" " + location?.country}
              </Text>
            </View>

            {/* IMAGE VIEW */}
            <View className="justify-center flex-row">
              <Image
                source={getWeatherImage(current?.condition?.text, current?.is_day)}
                className="w-52 h-52"
              />
            </View>

            {/* TEMPERATURE DISPLAY */}
            <View className="flex-row justify-center items-center">
              <Text className="text-center text-6xl text-white font-bold">
                {isCelsius
                  ? `${Math.round(current?.temp_c)}`
                  : `${Math.round(convertCelsiusToFahrenheit(current?.temp_c))}`}
              </Text>
              <Text className="text-white text-3xl ml-2">
                {isCelsius ? "°C" : "°F"}
              </Text>
            </View>

            <Text className="text-center text-xl text-white tracking-widest">
              {current?.condition?.text}
            </Text>

            {/* WEATHER CONDITIONS */}
            <View>
              <View className="flex-row space-x-6 items-center ">
                <View className="ml-8 flex-row space-x-1 items-center">
                  <Feather name="wind" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    {isKilometers
                      ? `${current?.wind_kph} km/h`
                      : `${Math.round(current?.wind_kph / 1.609)} mph`}
                  </Text>
                </View>
                <View className="ml-2 flex-row space-x-1 items-center">
                  <Entypo name="drop" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    {current?.humidity}%
                  </Text>
                </View>
                <View className="ml-2 flex-row space-x-1 items-center">
                  <Feather name="sun" size={30} color="white" />
                  <Text className="items-center text-white text-lg font-semibold">
                    {current?.uv} UV
                  </Text>
                </View>
              </View>
            </View>

            {/* NEXT DAYS FORECAST */}
            <View className="flex-row items-center ml-2 ">
              <FontAwesome name="calendar" size={30} color="white" />
              <Text className="text-white font-semibold ml-3 text-lg">
                Daily Forecast
              </Text>
            </View>

            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {weather?.forecast?.forecastday?.map((day, index) => {
                  let date = new Date(day.date);
                  let options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("en-US", options);

                  return (
                    <View
                      key={index}
                      className="w-32 rounded-3xl py-4 px-5 ml-3"
                      style={{ backgroundColor: theme.bgWhite(0.3) }}
                    >
                      <Image
                        source={{ uri: `https:${day?.day?.condition?.icon}` }}  // Using API's icon URL
                        className="w-12 h-12 ml-5"
                      />
                      <Text className="text-slate-300 font-semibold text-center py-1">
                        {dayName}
                      </Text>
                      <Text className="text-white font-semibold text-lg text-center">
                        {isCelsius
                          ? `${Math.round(day?.day?.avgtemp_c)}°C`
                          : `${Math.round(
                              convertCelsiusToFahrenheit(day?.day?.avgtemp_c)
                            )}°F`}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
           {/* NAME AND INFO BUTTON SECTION */}
           <View className="flex items-center mb-8">
            <Text className="text-white text-lg font-bold">Shadi Buchanan</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="mt-4 px-4 py-2 rounded-full"
              style={{ backgroundColor: theme.bgWhite(0.3) }}
            >
              <Text className="text-white text-lg">Info</Text>
            </TouchableOpacity>
          </View>
          {/* MODAL */}
          <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    console.log('Modal has been closed.');
    setModalVisible(!modalVisible);
  }}
>
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)'}}>
    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
      <View style={{flex: 1, width: '100%'}} />
    </TouchableWithoutFeedback>
    <View style={{position: 'absolute', backgroundColor: 'white', padding: 24, borderRadius: 10, width: '90%', maxHeight: '80%'}}>
      <ScrollView>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 16}}>
          PM Accelerator
        </Text>
        <Text style={{fontSize: 14, color: '#444', marginBottom: 8}}>
          The Product Manager Accelerator Program is designed to
                        support PM professionals through every stage of their
                        career. From students looking for entry-level jobs to
                        Directors looking to take on a leadership role, our
                        program has helped over hundreds of students fulfill
                        their career aspirations.
                      </Text>
                      <Text className="text-gray-800 text-base mb-2">
                        Our Product Manager Accelerator community is ambitious
                        and committed. Through our program, they have learned,
                        honed, and developed new PM and leadership skills,
                        giving them a strong foundation for their future
                        endeavors.
                      </Text>
                      <Text className="text-gray-800 text-base mb-2">
                        Learn product management for free today on our YouTube
                        channel:
                        <Text style={{ color: "blue" }}>
                          {" "}
                          https://www.youtube.com/c/drnancyli?sub_confirmation=1
                        </Text>
                      </Text>
                      <Text className="text-gray-800 text-base mb-2">
                        Interested in PM Accelerator Pro?
                        {"\n"}Step 1️⃣: Attend the Product Masterclass to learn
                        more about the program details, price, different
                        packages, and stay until the end to get a FREE AI
                        Course.
                      </Text>
                      <Text className="text-gray-800 text-base mb-2">
                        Learn how to create a killer product portfolio in two
                        weeks that will help you land any PM job (traditional or
                        AI) even if you were laid off or have zero PM
                        experience:
                        <Text style={{ color: "blue" }}>
                          {" "}
                          https://www.drnancyli.com/masterclass
                        </Text>
                      </Text>
                      <Text className="text-gray-800 text-base mb-2">
                        Step 2️⃣: Reserve your early bird ticket and submit an
                        application to talk to our Head of Admission.
                      </Text>
                      <Text className="text-gray-800 text-base mb-2">
                        Step 3️⃣: Successful applicants join our PMA Pro
                        community to receive customized coaching!
                  
          </Text>
        {/* More text elements */}
      </ScrollView>
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={{marginTop: 16, backgroundColor: '#007bff', borderRadius: 50, paddingHorizontal: 32, paddingVertical: 8}}
      >
        <Text style={{textAlign: 'center', color: 'white'}}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


        </SafeAreaView>
      )}
    </View>
  );
}
