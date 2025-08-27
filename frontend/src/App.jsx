
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <>
      <div>
        <Toaster />
      </div>
      
      <AppRoutes />
    </>
  );
};

export default App;
