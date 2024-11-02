import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import Topbar from "./components/topbar/topbar";
import ShoppingListWrapper from './components/shoppingListWrapper/shoppingListWrapper';
import { ShoppingListProvider } from './providers/shopppingOverviewProvider';
import { UserProvider } from './providers/userProvider';


// Import Bootstrap CSS

// Import Bootstrap JavaScript (this ensures dropdowns, modals, etc., work)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <>
    <UserProvider>
      <ShoppingListProvider>
        <Topbar/>
        <ShoppingListWrapper/>
      </ShoppingListProvider>
    </UserProvider>
    </>
  );
}

export default App;
