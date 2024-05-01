import Layout from "../layout/Layout";
import { Outlet } from "react-router-dom";

export const LayoutRoutes = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};