import React from 'react';
import {ButtonLogoutProps} from '../../Types';

export default function LogoutButton(props: ButtonLogoutProps): JSX.Element {
    return(
            <button type="button" value="Logout" onClick={props.logout}>Logout</button>
    )

}
