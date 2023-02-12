import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
function App() {
	const { currentUser } = useContext(AuthContext);
	const ProtectedRoutes = ({ children }) => {
		if (!currentUser) {
			return <Navigate to={"/login"} />;
		} else {
			return children;
		}
	};
	const AuthRoutes = ({ children }) => {
		if (currentUser) {
			return <Navigate to={"/"} />;
		} else {
			return children;
		}
	};
	return (
		<div>
			<ToastContainer />
			<BrowserRouter>
				<Routes>
					<Route path={"/"}>
						<Route
							index
							element={
								<ProtectedRoutes>
									<Home />
								</ProtectedRoutes>
							}
						/>

						<Route
							path={"login"}
							element={
								<AuthRoutes>
									<Login />
								</AuthRoutes>
							}
						/>
						<Route
							path={"register"}
							element={
								<AuthRoutes>
									<Register />
								</AuthRoutes>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
