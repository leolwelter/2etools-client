import Navbar from "../Navbar/Navbar";
import React, {useEffect, useState} from "react";
import {Spell} from "../_interfaces/spell";
import DataService from "../_services/data-service";
import {Card, CardContent, LinearProgress, Tooltip} from "@material-ui/core";
import freeAction from "../_assets/FreeAction.png";
import oneAction from "../_assets/OneAction.png";
import twoActions from "../_assets/TwoActions.png";
import threeActions from "../_assets/ThreeActions_I.png";
import reaction from "../_assets/Reaction.png";

export default function Spells() {
    let [spells, setSpells] = useState<Spell[]>();
    let [selectedSpell, setSelectedSpell] = useState<Spell>();
    let [error, setError] = useState<string>();

    useEffect(() => {
        DataService.getSpells()
            .then(succ => {
                setSpells(succ.sort((a, b) => a.name >= b.name ? 1 : -1))
            })
            .catch(err => {
                console.error(err);
                setError('oops, something went wrong. Please reload or try again later.');
            });
    }, []);

    function toggleSpell(spell: Spell) {
        if (spell === selectedSpell) {
            setSelectedSpell(undefined);
        } else {
            setSelectedSpell(spell);
        }
    }

    return (
        <div>
            <Navbar/>
            <div className='container-fluid'>
                {!error &&
                <div className='row'>
                    {/*spells table*/}
                    <div className='col-12 col-md-6'>
                        <h4 className='text-center'>Spells: Click to display details</h4>
                        <div className="table-responsive table-scrollable">
                            {spells?.length ?
                                <table className="table table-bordered table-hover table-striped">
                                    <thead>
                                    <tr>
                                        <th className="text-capitalize">name</th>
                                        <th className="text-capitalize">level</th>
                                        <th className="text-capitalize">cast</th>
                                        <th className="text-capitalize">type</th>
                                        <th className="text-capitalize">source</th>
                                        <th className="text-capitalize">sustained</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {spells.map(spell => {
                                        return <tr key={spell.id} onClick={() => toggleSpell(spell)}
                                                   className={`${(spell === selectedSpell) ? 'bg-gold text-gold text-bold font-weight-bold' : ''}`}>
                                            <td className='align-middle'>{spell.name}</td>
                                            <td className='align-middle'>{spell.level}</td>
                                            <td className='align-middle'>
                                            {(() => {
                                                if (spell.trigger) {
                                                    return <img className='img pr-1' alt='' src={reaction}
                                                                height='16px'/>
                                                } else if (spell.actions.length) {
                                                    return spell.actions.map(act => {
                                                        let isrc = act === 0 ? freeAction : act === 1 ? oneAction : act === 2 ? twoActions : threeActions;
                                                        return <img key={`${spell?.id}.${act}`}
                                                                    className='img pr-1' alt='' src={isrc}
                                                                    height='16px'/>
                                                    })
                                                } else {
                                                    return <span>{spell.cast}</span>
                                                }
                                            })()}
                                            </td>
                                            <td className='align-middle'>{spell.spellType}</td>
                                            <td className='align-middle'>{spell.source.book}</td>
                                            <td className='text-center align-middle font-weight-bolder'>{spell.isSustained ? 'x' : ''}</td>
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

                    {/*selected spell in card view*/}
                    {selectedSpell &&
                    <div className='col'>
                        <Card className='spell-card'>
                            <CardContent>
                                <div className='row'>
                                    <div className='col d-flex font-weight-bolder'>
                                        <div>{selectedSpell.name}</div>
                                        <div className='ml-auto'>{selectedSpell.spellType} {selectedSpell.level}</div>
                                    </div>
                                </div>
                                <hr/>
                                <div className='row'>
                                    <div className='col'>
                                        {selectedSpell.traits.map(tr => {
                                            return <Tooltip key={`${selectedSpell?.id}.${tr.id}`} title={tr.description}
                                                            classes={{tooltip: 'tooltip-lg'}}>
                                                <span className="badge badge-red">{tr.name}</span>
                                            </Tooltip>
                                        })}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <span className='font-weight-bold'>Source </span>
                                        <span className='p-1'>{selectedSpell.source.book} pg. {selectedSpell.source.page}</span>
                                    </div>
                                </div>
                                <div className='row row-cols-1'>
                                    <div className='col'>
                                        {selectedSpell.traditions?.length > 0 && <div className="d-flex">
                                            <span className="font-weight-bold">Tradition </span>
                                            <div>
                                                {selectedSpell.traditions.map((t, ind, arr) => {
                                                    return <span key={t}
                                                                 className="p-1">{t + (ind === arr.length - 1 ? '' : ',')}</span>
                                                })}
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                                <div className='row row-cols-1'>
                                    <div className="col d-flex">
                                        <span className="font-weight-bold">Cast </span>
                                        <span className="pl-1">
                                            {(() => {
                                                if (selectedSpell.trigger) {
                                                    return <img className='img pr-1' alt='' src={reaction}
                                                                height='16px'/>
                                                } else if (selectedSpell.actions.length) {
                                                    return selectedSpell.actions.map(act => {
                                                        let isrc = act === 0 ? freeAction : act === 1 ? oneAction : act === 2 ? twoActions : threeActions;
                                                        return <img key={`${selectedSpell?.id}.${act}`}
                                                                    className='img pr-1' alt='' src={isrc}
                                                                    height='16px'/>
                                                    })
                                                } else {
                                                    return <span>{selectedSpell.cast}</span>
                                                }
                                            })()}
                                        </span>
                                        <span>
                                        {selectedSpell.components.length ? '(' + selectedSpell.components.join(', ') + ')' : null}
                                        </span>
                                        {selectedSpell.cost &&
                                        <div>
                                            <span className="pl-1 font-weight-bold">cost </span>
                                            <span>{selectedSpell.cost}</span>
                                        </div>
                                        }
                                        {selectedSpell.requirements &&
                                        <div>
                                            <span className="pl-1 font-weight-bold">requirements </span>
                                            <span>{selectedSpell.requirements}</span>
                                        </div>
                                        }

                                        {selectedSpell.trigger &&
                                        <div>
                                            <span className="pl-1 font-weight-bold">trigger </span>
                                            <span>{selectedSpell.trigger}</span>
                                        </div>
                                        }
                                    </div>

                                    {(selectedSpell.range || selectedSpell.area || selectedSpell.targets) &&
                                    <div className="col d-flex">
                                        {selectedSpell.range &&
                                        <div className="pr-1">
                                            <span className="font-weight-bold">Range </span>
                                            <span>{selectedSpell.range}</span>
                                        </div>}
                                        {selectedSpell.area &&
                                        <div className="pr-1">
                                            <span className="font-weight-bold">Area </span>
                                            <span>{selectedSpell.area}</span>
                                        </div>}
                                        {selectedSpell.targets &&
                                        <div>
                                            <span className="font-weight-bold">Targets </span>
                                            <span>{selectedSpell.targets}</span>
                                        </div>}
                                    </div>
                                    }

                                    {(selectedSpell.savingThrow || selectedSpell.duration) &&
                                    <div className="col d-flex">
                                        {selectedSpell.savingThrow &&
                                        <div className="pr-1">
                                            <span className="font-weight-bold">Saving Throw  </span>
                                            <span>{selectedSpell.savingThrow}</span>
                                        </div>}
                                        {selectedSpell.duration &&
                                        <div>
                                            <span className="font-weight-bold">Duration </span>
                                            <span>{selectedSpell.duration}</span>
                                        </div>}
                                    </div>
                                    }
                                </div>
                                <hr/>
                                <div className='row row-cols-1'>
                                    <div className='col'>
                                        <span>{selectedSpell.description}</span>
                                        {selectedSpell.criticalSuccess &&
                                        <div>
                                            <span className="font-weight-bold">Critical Success </span>
                                            <span>{selectedSpell.criticalSuccess}</span>
                                        </div>
                                        }
                                        {selectedSpell.success && <div>
                                            <span className="font-weight-bold">Success </span>
                                            <span>{selectedSpell.success}</span>
                                        </div>}
                                        {selectedSpell.failure && <div>
                                            <span className="font-weight-bold">Failure </span>
                                            <span>{selectedSpell.failure}</span>
                                        </div>}
                                        {selectedSpell.criticalFailure && <div>
                                            <span className="font-weight-bold">Critical Failure </span>
                                            <span>{selectedSpell.criticalFailure}</span>
                                        </div>}
                                    </div>
                                </div>
                                {selectedSpell.heightened?.length > 0 &&
                                <div className='row'>
                                    <div className='col'>
                                        <hr/>
                                        {selectedSpell.heightened.map(h => {
                                            return <div key={h.level}>
                                                <span className="font-weight-bold">Heightened ({h.level})</span>
                                                <span className="pl-1">{h.description}</span>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                }
                            </CardContent>
                        </Card>
                    </div>}
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
        </div>
    )
}
