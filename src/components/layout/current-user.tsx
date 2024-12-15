import {Popover} from "antd";
import {CustomAvatar} from "../custom-avatar";

import type {User} from '@graphql/schema.types';

export const CurrentUser = () => {
    return (
        <>
            <Popover
                placement={'bottomRight'}
                trigger={'click'}
                overlayInnerStyle={{padding: 0}}
                overlayStyle={{zIndex: 999}}
            >
                <CustomAvatar/>
            </Popover>
        </>
    )
}