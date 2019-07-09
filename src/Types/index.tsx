import Arweave from 'arweave/web';
import React from 'react';

export interface UserState{
  loggedIn: boolean;
  address: string;
  balance: number;
}


export interface LoginProps {
  loggedin: (logged: boolean, address: string) => void;
  arweave?: Arweave;
}

export interface AppState{
  userDetails: UserState;
  arweave?: Arweave;
}

export interface RedirectState {
  redirectToReferrer: boolean;
}


export interface ButtonLoginProps {
}

export interface ButtonLogoutProps {
  logout: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
