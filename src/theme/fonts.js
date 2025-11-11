import { useFonts } from "expo-font";

/** Hook para carregar Poppins e retornar { ready } */
export function usePoppinsFonts() {
  const [ready] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),


    // Fraunces (coloca esses arquivos na pasta indicada)
    "Fraunces-Light": require("../assets/fonts/Fraunces-Light.ttf"),
    "Fraunces-Medium": require("../assets/fonts/Fraunces-Medium.ttf"),
  });
  return { ready };
}
