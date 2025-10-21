import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function resetToMain(params) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: "Main", params }],
    });
  }
}

export function getActiveRoute() {
  try {
    if (!navigationRef.isReady()) return null;
    let route = navigationRef.getCurrentRoute();
    while (route?.state?.index != null) {
      const { index, routes } = route.state;
      route = routes?.[index];
    }
    return route || navigationRef.getCurrentRoute();
  } catch {
    return navigationRef.getCurrentRoute();
  }
}

export function getActiveRouteName() {
  return getActiveRoute()?.name || null;
}
