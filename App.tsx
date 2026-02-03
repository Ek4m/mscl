import { StatusBar, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import RootNavigator from "./src/navigation/RootNavigator";
import { store } from "./src/redux/root";
import { useEffect } from "react";
import { initDb } from "./src/db/config";

function App() {
  const isDarkMode = useColorScheme() === "dark";
  useEffect(() => {
    initDb();
  }, []);
  return (
    <SafeAreaProvider style={{backgroundColor:"black"}}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Provider store={store}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
