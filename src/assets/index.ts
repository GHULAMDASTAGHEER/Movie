import type { ImageSourcePropType } from "react-native";

export const IMAGES = {
  Comedy: require("./images/commedies.png") as ImageSourcePropType,
  Crime: require("./images/crime.png") as ImageSourcePropType,
  Family: require("./images/family.png") as ImageSourcePropType,
  Documentaries: require("./images/documentation.png") as ImageSourcePropType,
  Dramas: require("./images/drama.png") as ImageSourcePropType,
  Fantasy: require("./images/fantasy.png") as ImageSourcePropType,
  Holidays: require("./images/holiday.png") as ImageSourcePropType,
  Horror: require("./images/horror.png") as ImageSourcePropType,
  SciFi: require("./images/scifri.png") as ImageSourcePropType,
  Thriller: require("./images/thriller.png") as ImageSourcePropType,
  MovieDetail: require("./images/moviedetail.png") as ImageSourcePropType,
} as const;
