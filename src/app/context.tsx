import { createContext, useContext, useState } from 'react';

export interface User {
    userId: string
    auth: boolean
}

interface Context {
    user: User
    login: (user: User) => void
  
}





export const UserContext = createContext<Context | undefined>(undefined)