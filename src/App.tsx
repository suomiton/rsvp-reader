import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./state/context";
import { EditorPage } from "./routes/EditorPage";
import { ReaderPage } from "./routes/ReaderPage";

export default function App() {
	return (
		<AppProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<EditorPage />} />
					<Route path="/read" element={<ReaderPage />} />
				</Routes>
			</BrowserRouter>
		</AppProvider>
	);
}
