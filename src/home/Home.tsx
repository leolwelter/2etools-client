import React from "react";
import Navbar from "../Navbar/Navbar";


export default function Home() {
    return (
        <div>
            <Navbar/>
            <div className='container-xl'>
                <div className='row'>
                    <div className='col mx-auto'>
                        <h2 className='text-center'>2eTools React Version</h2>
                    </div>
                </div>
            </div>
        </div>

    )
}
