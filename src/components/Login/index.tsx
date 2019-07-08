import React from 'react';
import {ButtonLoginProps} from '../../Types';


/** @augments {React.Component<object, object>} */
export default function LoginButton(props: ButtonLoginProps): JSX.Element {
      return(
          <button type="submit" value="Login" onClick={props.changeView}>Login</button>
      )

  }
