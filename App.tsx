import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { useSync } from "./src/hooks/useSync";

function AppContent() {
  const { ready, error } = useSync();

  if (!ready && !error) {
    return null; // da pra substituir por uma tela de loading
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <NavigationContainer>
      <AppContent />
    </NavigationContainer>
  )
}