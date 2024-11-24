import {ThemedLayoutV2, ThemedTitleV2} from "@refinedev/antd";
import {Header} from "./header";

export const Layout = ({children}: React.PropsWithChildren) => {
    return (
        <ThemedLayoutV2
            Header={Header}
            Title={(title) => <ThemedTitleV2 {...title} text={"Dashboard refine app"}/>}
        >{children}</ThemedLayoutV2>
    )
}