import "./App.css";

import { MaterialUiProviders } from "./lib/mui/MaterialUiProviders";
import { RouterProvider } from "./routes/RouterProvider";

function App() {
  return (
    <MaterialUiProviders>
      <RouterProvider />
    </MaterialUiProviders>
  );
}

export default App;
