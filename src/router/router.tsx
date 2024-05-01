import {
    IoFileTray,
    IoPieChart,
    IoFolderOpen
} from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

export enum RouteName {
    REQUESTS = 0,
    STATS = 2,
    SQL_SCRIPTS = 3,
}

export type Route = {
    path: string;
    name: string;
    icon: JSX.Element;
}

export const routes: Record<RouteName, Route> = {
    [RouteName.REQUESTS]: {
        path: '/',
        name: 'Zoznam žiadostí',
        icon: <IoFileTray />,
    },
    [RouteName.STATS]: {
        path: '/stats',
        name: 'Štatistiky',
        icon: <IoPieChart />,
    },
    [RouteName.SQL_SCRIPTS]: {
        path: '/sql-scripts',
        name: 'Zostavy',
        icon: <IoFolderOpen />,
    },
};

export const useRouter = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const navigateToRequests = () => navigate(routes[RouteName.REQUESTS].path);

    const navigateToStats = () => navigate(routes[RouteName.STATS].path);

    const navigateToSqlScripts = () => navigate(routes[RouteName.SQL_SCRIPTS].path);

    const currentRoute: Route | undefined = Object.values(routes)
        .find((value) => location.pathname === value.path)

    return {
        currentRoute,
        navigateToRequests,
        navigateToStats,
        navigateToSqlScripts,
    };
};