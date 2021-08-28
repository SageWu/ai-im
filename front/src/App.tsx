import User from "./user";
import CustomerService from "./cs";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <User />
      <div className="line" />
      <CustomerService />
    </div>
  );
}

export default App;
