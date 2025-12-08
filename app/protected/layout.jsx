import NavBar from "./components/NavBar/NavBar";

export default function RootLayout({ children }) {
  return (
    <div className={`bg-base-100`}>
      <NavBar />
      {children}
    </div>
  );
}
