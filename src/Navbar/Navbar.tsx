/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import icon from "../_assets/android-chrome-512x512.png";
import {Link} from "react-router-dom";
import {toplinks} from "../_interfaces/toplink";

export default function Navbar() {
    return (
            <nav className='sticky-top navbar navbar-expand-lg navbar-light bg-light'>
                <Link className="nav-item nav-link" to='/home'>
                    <img src={icon} width='32' height='32' alt=''/>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {toplinks.map(tl => {
                            return <Link key={tl.label} className="nav-item nav-link" to={tl.link} >{tl.label}</Link>
                        })}
                    </div>
                </div>
            </nav>
    )
}
