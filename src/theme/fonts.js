import { useFonts } from "expo-font";

/** Hook para carregar Poppins e retornar { ready } */
export function usePoppinsFonts() {
  const [ready] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });
  return { ready };
}
