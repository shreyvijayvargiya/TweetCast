import { Dashboard } from '../components';
import Cookies from 'next-cookies';

export default function DashbaordPage(){ 
    return <Dashboard />
};

export async function getServerSideProps({ req, res}){
    const token = Cookies({req, res});
    if(token.uid === undefined){
        res.statusCode = 302
        res.setHeader('Location', `/login`) 
        return { props: { }};
    }else {
        return { props: { } }
    };
};
