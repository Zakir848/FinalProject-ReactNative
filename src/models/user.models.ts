import * as Location from "expo-location";
export const getCurrentAddress = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("PERMISSION_DENIED");

  if (!(await Location.hasServicesEnabledAsync())) throw new Error("GPS_OFF");

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = pos.coords;

  let street = "";
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    street = [place?.street, place?.streetNumber, place?.district, place?.city]
      .filter(Boolean)
      .join(", ");
  } catch (error) {
    console.log(error);
  }

  return { latitude, longitude, street };
};
