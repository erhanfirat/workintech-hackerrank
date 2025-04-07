import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

export const ThemeContainer = ({ children }) => {
  const { theme } = useSelector((s) => s.user);
  
  return (
    <div className={`app-container ${theme}`}>
      {children}
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          // Toast stil seçenekleri
          duration: 3000,
          style: {
            background: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#333",
          },
        }}
      />
    </div>
  );
};
