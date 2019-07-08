import Arweave from 'arweave/web';
import React from 'react';

export interface UserState{
    loggedIn: boolean;
    address: string;
}


 export interface LoginProps {
    changeView: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    loggedin: (logged: boolean, address: string, view: string) => void;
    arweave?: Arweave;
}

export interface AppState{
    view: string;
    userDetails: UserState;
    arweave?: Arweave;
}

export interface ButtonLoginProps {
    changeView: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface ButtonLogoutProps {
    logout: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
