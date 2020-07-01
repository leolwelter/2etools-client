import React, {useEffect, useState} from "react";
import {Trait} from "../_interfaces/trait";
import Navbar from "../Navbar/Navbar";
import {Card, CardContent, LinearProgress} from "@material-ui/core";
import DataService from "../_services/data-service";
import RollingTray from "../Roller/RollingTray";

export default function Traits() {
    let [traits, setTraits] = useState<Trait[]>();
    let [selected, setSelected] = useState<Trait>();
    let [error, setError] = useState<string>();

    useEffect(() => {
        document.title = 'Traits - 2eTools';
        DataService.getTraits()
            .then(succ => {
                setTraits(succ.sort((a, b) => a.name >= b.name ? 1 : -1))
            })
            .catch(err => {
                console.error(err);
                setError('oops, something went wrong. Please reload or try again later.');
            });
    }, []);

    function toggleSelected(trait: Trait) {
        if (trait === selected) {
            setSelected(undefined);
        } else {
            setSelected(trait);
        }
    }

    return (
        <div>
            <Navbar/>
            <div className='container-fluid'>
                {!error && <div className='row'>
                    <div className='col-12 col-md-4'>
                        <h4 className='text-center'>Traits: Click to display details</h4>
                        <div className="table-responsive table-scrollable">
                            {traits?.length ?
                                <table className="table table-bordered table-hover table-striped">
                                    <thead>
                                    <tr>
                                        <th className="text-capitalize">name</th>
                                        <th className="text-capitalize">group</th>
                                        <th className="text-capitalize">source</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {traits.map(trait => {
                                        return <tr key={trait.name} onClick={() => toggleSelected(trait)}
                                                   className={`${(trait === selected) ? 'bg-gold text-gold text-bold font-weight-bold' : ''}`}>
                                            <td className='align-middle'>{trait.name}</td>
                                            <td className='align-middle'>{trait.groups.join(', ')}</td>
                                            <td className='align-middle'>{trait.source.book} pg. {trait.source.page}</td>
                                        </tr>
                                    })}
                                    </tbody>
                                </table> :
                                <span className='d-block w-100 mx-auto'>
                                    <LinearProgress/>
                                </span>
                            }
                        </div>
                    </div>

                    {/*selected card*/}
                    {selected &&
                    <div className='col-12 col-md-4'>
                        <Card>
                            <CardContent>
                                <h4>{selected.name}</h4>
                                {selected.description ?
                                    <span>
                                    {selected.description.split('\n').map((p, ind) => {
                                        return <p key={ind}>{p}</p>
                                    })}
                                    </span> :
                                    <span>
                                        <i>No description available</i>
                                    </span>
                                }
                                <hr/>
                                <div>
                                    <label className='font-weight-bold mr-2'>Groups</label>
                                    {selected.groups.length > 0 ?
                                        <span>{selected.groups.join(', ')}</span> :
                                        <span>None</span>
                                    }
                                </div>
                                <div>
                                    <label className='font-weight-bold mr-2'>Source</label>
                                    <span>{selected.source.book} pg. {selected.source.page}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    }
                </div>}

                {/*error handling */}
                {error &&
                <div className='row'>
                    <div className='col'>
                        <span className='my-5 mx-auto d-block w-50 text-center alert alert-warning'>{error}</span>
                    </div>
                </div>
                }
            </div>
            <RollingTray/>
        </div>
    )
}
