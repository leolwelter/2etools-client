import {Condition, conditions} from "../_interfaces/condition";
import React, {useState} from "react";
import Navbar from "../Navbar/Navbar";
import {Card, CardContent} from "@material-ui/core";

interface ConditionGroup {
    [name: string]: Condition[]
}

export default function Conditions() {
    let [selected, setSelected] = useState<Condition>();

    let clist = conditions.sort((a, b) => a.group > b.group ? 1 : -1);
    let groups: ConditionGroup = {};
    clist.forEach(cond => {
        if (groups[cond.group]) groups[cond.group].push(cond);
        else groups[cond.group] = [cond];
    });

    function toggleCondition(cond: Condition) {
        if (cond === selected) setSelected(undefined)
        else setSelected(cond)
    }

    return (
        <div>
            <Navbar/>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col text-center'>
                        <h3>Conditions Reference</h3>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-md-4'>
                        <h4 className='text-center'>Spells: Click to display details</h4>
                        <div className="table-responsive table-scrollable">
                            <table className="table table-bordered table-hover table-striped">
                                <thead>
                                <tr>
                                    <th className="text-capitalize">name</th>
                                    <th className="text-capitalize">overrides</th>
                                    <th className="text-capitalize">group</th>
                                    <th className="text-capitalize">source</th>
                                </tr>
                                </thead>
                                <tbody>
                                {conditions.map(cond => {
                                    return <tr key={cond.name} onClick={() => toggleCondition(cond)}
                                               className={`${(cond === selected) ? 'bg-gold text-gold text-bold font-weight-bold' : ''}`}>
                                        <td className='align-middle'>{cond.name}</td>
                                        <td className='align-middle'>{cond.overrides.join(', ')}</td>
                                        <td className='align-middle'>{cond.group}</td>
                                        <td className='align-middle'>{cond.source.book} pg. {cond.source.page}</td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/*selected card*/}
                    {selected &&
                    <div className='col-12 col-md-4'>
                        <Card>
                            <CardContent>
                                <h4>{selected.name}</h4>
                                <span>{selected.description}</span>
                                <hr/>
                                {selected.overrides.length > 0 &&
                                <div>
                                    <label className='font-weight-bold mr-2'>Overrides</label>
                                    <span>{selected.overrides.join(', ')}</span>
                                </div>
                                }
                                <div>
                                    <label className='font-weight-bold mr-2'>Group</label>
                                    <span>{selected.group}</span>
                                </div>
                                <div>
                                    <label className='font-weight-bold mr-2'>Source</label>
                                    <span>{selected.source.book} pg. {selected.source.page}</span>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}
