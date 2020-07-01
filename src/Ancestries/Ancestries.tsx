import React, {useEffect, useState} from "react";
import Navbar from "../Navbar/Navbar";
import {Card, CardContent, LinearProgress, Tooltip} from "@material-ui/core";
import {Ancestry} from "../_interfaces/ancestry";
import DataService from "../_services/data-service";
import RollingTray from "../Roller/RollingTray";

export default function Ancestries() {
    let [selected, setSelected] = useState<Ancestry>();
    let [ancestries, setAncestries] = useState<Ancestry[]>();
    let [error, setError] = useState<string>();

    useEffect(() => {
        document.title = 'Ancestries - 2eTools';
        DataService.getAncestries().then(res => {
            setAncestries(res);
        }).catch(err => {
            setError(err);
        })
    }, []);

    function toggleSelected(ancestry: Ancestry) {
        if (ancestry === selected) setSelected(undefined)
        else setSelected(ancestry)
    }

    return (
        <div>
            <Navbar/>
            <div className='container-fluid'>
                {!error &&
                <div className='row'>
                    {/*ancestries table*/}
                    <div className='col-12 col-md-6 col-xl-4'>
                        <h4 className='text-center'>Ancestries: Click for details</h4>
                        <div className="table-responsive table-scrollable">
                            {ancestries?.length ?
                                <table className="table table-bordered table-hover table-striped">
                                    <thead>
                                    <tr className='text-capitalize text-justify'>
                                        <th>name</th>
                                        <th title='hit points'>HP</th>
                                        <th>size</th>
                                        <th>senses</th>
                                        <th>speed</th>
                                        <th>source</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {ancestries.map(ancestry => {
                                        return <tr key={ancestry.id} onClick={() => toggleSelected(ancestry)}
                                                   className={`${(ancestry === selected) ? 'bg-gold text-gold text-bold font-weight-bold' : ''}`}>
                                            <td className='align-middle'>{ancestry.name}</td>
                                            <td className='align-middle'>{ancestry.hitPoints}</td>
                                            <td className='align-middle'>{ancestry.size}</td>
                                            <td className='align-middle'>{
                                                ancestry.senses.map(s => {
                                                    return <Tooltip key={s.name} title={s.text}>
                                                        <span>{s.name}</span>
                                                    </Tooltip>
                                                })
                                            }</td>
                                            <td className='align-middle'>{ancestry.speed}</td>
                                            <td className='align-middle'>{ancestry.source.book}</td>
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
                    <div className='col-12 col-md col-xl-5'>
                        <Card>
                            <CardContent>
                                <span>
                                    {selected.description.map((p, ind) => {
                                        return <div key={ind}>
                                            <h4>{p.header}</h4>
                                            {p.text.split('\n').map((psplit, ind) => {
                                                return <p key={ind}>{psplit}</p>
                                            })}
                                        </div>
                                    })
                                    }</span>
                                <hr/>
                                <span>
                                    <h3>{selected.name} Mechanics</h3>
                                    <div>
                                        <label className='font-weight-bold'>Hit Points</label>
                                        <span className='pl-1'>{selected.hitPoints}</span>
                                    </div>
                                    <div>
                                        <label className='font-weight-bold'>Size</label>
                                        <span className='pl-1'>{selected.size}</span>
                                    </div>
                                    <div>
                                        <label className='font-weight-bold'>Speed</label>
                                        <span className='pl-1'>{selected.speed}</span>
                                    </div>
                                    <div>
                                        <label className='font-weight-bold'>Ability Boosts</label>
                                        <span className='pl-1'>{selected.abilityBoosts.join(', ')}</span>
                                    </div>
                                    {selected.abilityFlaws.length > 0 &&
                                    <div>
                                        <label className='font-weight-bold'>Ability Flaws</label>
                                        <span className='pl-1'>{selected.abilityFlaws.join(', ')}</span>
                                    </div>}
                                    {selected.languages.length > 0 &&
                                    <div>
                                        <label className='font-weight-bold'>Languages</label>
                                        <span className='pl-1'>{selected.languages.join(', ')}</span>
                                    </div>}
                                    <div>
                                        {selected.extras.map((p, ind) => {
                                            return <div key={ind}>
                                                <h4>{p.header}</h4>
                                                {p.text.split('\n').map((psplit, ind) => {
                                                    return <p key={ind}>{psplit}</p>
                                                })}
                                            </div>
                                        })}
                                    </div>
                                </span>
                                <hr/>
                                <div>
                                    <label className='font-weight-bold mr-2'>Source</label>
                                    <span>{selected.source.book} pg. {selected.source.page}</span>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                    }
                </div>
                }
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
