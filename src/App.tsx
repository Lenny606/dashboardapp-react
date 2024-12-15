import {Authenticated, GitHubBanner, Refine, WelcomePage} from "@refinedev/core";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";

import {useNotificationProvider} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import {
    authProvider,
    dataProvider, liveProvider
} from "./providers";
import routerBindings, {
    CatchAllNavigate,
    DocumentTitleHandler,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import {App as AntdApp} from "antd";
import {createClient} from "graphql-ws";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {Home, Login, Register, ForgotPassword} from "./pages";
import {Layout} from "./components/layout";
import {resources} from "@/config/resources";

const API_URL = "https://api.nestjs-query.refine.dev/graphql";
const WS_URL = "wss://api.nestjs-query.refine.dev/graphql";

// const gqlClient = new GraphQLClient(API_URL);
// const wsClient = createClient({ url: WS_URL });

function App() {
    return (
        <BrowserRouter>
            {/*<GitHubBanner/>*/}
            <RefineKbarProvider>
                <AntdApp>
                    <DevtoolsProvider>
                        <Refine
                            dataProvider={dataProvider}
                            liveProvider={liveProvider}
                            notificationProvider={useNotificationProvider}
                            routerProvider={routerBindings}
                            authProvider={authProvider}
                            resources={resources}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                useNewQueryKeys: true,
                                projectId: "9Q9TkA-i7zfVS-zaVbHF",
                                liveMode: "auto",
                            }}
                        >
                            <Routes>
                                {/*<Route index element={<WelcomePage/>}/>*/}

                                <Route path={'/forgot-password'} element={<ForgotPassword/>}/>
                                <Route path={'/login'} element={<Login/>}/>
                                <Route path={'/register'} element={<Register/>}/>
                                <Route
                                    element={
                                        <Authenticated
                                            key={'authenticated-layout'}
                                            fallback={<CatchAllNavigate to={'/login'}/>}
                                            v3LegacyAuthProviderCompatible={true}
                                        >
                                            <Layout>
                                                <Outlet/>
                                            </Layout>
                                        </Authenticated>
                                    }>
                                    <Route index element={<Home/>}/>
                                </Route>
                            </Routes>
                            <RefineKbar/>
                            <UnsavedChangesNotifier/>
                            <DocumentTitleHandler/>
                        </Refine>
                        <DevtoolsPanel/>
                    </DevtoolsProvider>
                </AntdApp>
            </RefineKbarProvider>
        </BrowserRouter>
    )
        ;
}

export default App;
