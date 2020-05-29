/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import icon from "../_assets/android-chrome-512x512.png";
import {Link} from "react-router-dom";

export default function Navbar() {
    return (
            <nav className='sticky-top navbar navbar-expand-lg navbar-light bg-light'>
                <img src={icon} width='32' height='32' alt=''/>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-item nav-link" to='/home' >Home</Link>
                        <Link className="nav-item nav-link" to='/about' >About</Link>
                        <Link className="nav-item nav-link" to='/spells' >Spells</Link>
                    </div>
                </div>
            </nav>
    )
}
