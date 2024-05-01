import {
    Route,
    BrowserRouter as Router,
    Routes,
    Navigate,
} from "react-router-dom";
import { LayoutRoutes } from './router/LayoutRoutes';
import { RouteName, routes } from './router/router';
import { Requests } from './views/Requests';

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<LayoutRoutes />}>
                    <Route
                        path={routes[RouteName.REQUESTS].path}
                        element={<Requests />}
                    />

                    <Route
                        path={routes[RouteName.STATS].path}
                        element={<div>stats</div>}
                    />

                    <Route
                        path={routes[RouteName.SQL_SCRIPTS].path}
                        element={<div>sql scripts</div>}
                    />
                </Route>

                <Route
                    path="*"
                    element={
                        <Navigate to={routes[RouteName.REQUESTS].path} replace />
                    }
                />
            </Routes>
        </Router>
    );
}