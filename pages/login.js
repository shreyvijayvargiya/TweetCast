import React from 'react';
import { LoginComponent } from '../components';
import Cookies from 'next-cookies';

export default function login(){
    return <LoginComponent />
};

export async function getServerSideProps({ req, res}){
    const token = Cookies({req, res});
    if(token.uid !== undefined){
        res.statusCode = 302
        res.setHeader('Location', `/`) 
        return { props: { }};
    }else {
        return { props: { } }
    }
}
