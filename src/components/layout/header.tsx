import {Layout, Space} from "antd";
import {CurrentUser} from "./current-user";

const headerStyles: React.CSSProperties = {
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 999,
}
export const Header = () => {
    return (
        <Layout.Header style={headerStyles}>
            <Space align={'center'} size={'middle'}>
                <CurrentUser/>
            </Space>
        </Layout.Header>
    )
}