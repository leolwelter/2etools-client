import React, {useEffect} from "react";
import Navbar from "../Navbar/Navbar";
import {Card, CardContent} from "@material-ui/core";
import {toplinks} from "../_interfaces/toplink";
import {Link} from "react-router-dom";
import Footer from "../Navbar/Footer";
import RollingTray from "../Roller/RollingTray";


export default function Home() {

    useEffect(() => {
        document.title = '2eTools';
    }, []);

    return (
        <div>
            <Navbar/>
            <div className='container-xl'>
                <div className='row'>
                    <div className='col mx-auto'>
                        <h2 className='text-center'>2eTools</h2>
                        <Card>
                            <CardContent>
                                <div className='row'>
                                    {toplinks.map(tl => {
                                        return <div key={tl.label} className='text-center mx-auto col-3'>
                                            <figure className='figure position-relative'>
                                                <Link className='stretched-link' to={tl.link} aria-hidden='false'>
                                                    <img alt={tl.label} className='figure-img bg-gold' width='64px' src={tl.icon}/>
                                                </Link>
                                                <figcaption className='figure-caption'>{tl.label}</figcaption>
                                            </figure>
                                        </div>
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer/>
            <RollingTray/>
        </div>

    )
}
