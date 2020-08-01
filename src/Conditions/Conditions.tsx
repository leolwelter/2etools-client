import {Condition, conditions} from "../_interfaces/condition";
import React, {useEffect, useState} from "react";
import Navbar from "../Navbar/Navbar";
import {Card, CardContent} from "@material-ui/core";
import RollingTray from "../Roller/RollingTray";

interface ConditionGroup {
    [name: string]: Condition[]
}

export default function Conditions() {
    let [selected, setSelected] = useState<Condition>();
    let [condList, setCondList] = useState<Condition[]>([]);

    let clist = condList.sort((a, b) => {
        if (a.group === b.group) return a.name < b.name ? -1 : 1
        else return a.group < b.group ? -1 : 1;
    });
    let groups: ConditionGroup = {};
    clist.forEach(cond => {
        if (groups[cond.group]) groups[cond.group].push(cond);
        else groups[cond.group] = [cond];
    });

    useEffect(() => {
        document.title = 'Conditions - 2eTools';
        setCondList(conditions);
    }, []);

    function toggleCondition(cond: Condition) {
        if (cond === selected) setSelected(undefined)
        else setSelected(cond)
    }

    return (
        <div>
            <Navbar/>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12 col-md-4'>
                        <h4 className='text-center'>Conditions: Click to display details</h4>
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
                                {clist.map((cond, ind) => {
                                    return <tr key={ind} onClick={() => toggleCondition(cond)}
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
                                <span>
                                    {selected.description.split('\n').map((p, ind) => {
                                        return <p key={ind}>{p}</p>
                                    })
                                    }</span>
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
            <RollingTray/>
        </div>
    )
}
