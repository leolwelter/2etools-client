import Navbar from "../Navbar/Navbar";
import React, {useEffect, useMemo, useState} from "react";
import {Spell} from "../_interfaces/spell";
import DataService from "../_services/data-service";
import {Card, CardContent, LinearProgress, Tooltip} from "@material-ui/core";
import freeAction from "../_assets/FreeAction.png";
import oneAction from "../_assets/OneAction.png";
import twoActions from "../_assets/TwoActions.png";
import threeActions from "../_assets/ThreeActions_I.png";
import reaction from "../_assets/Reaction.png";
import RollingTray from "../Roller/RollingTray";
import { useLocation, useHistory } from "react-router-dom";
import {dynamicSort} from "../lw-util";
import {ArrowDownward, ArrowUpward} from "@material-ui/icons";

export default function Spells() {
    let [spells, setSpells] = useState<Spell[]>();
    let [selected, setSelected] = useState<Spell>();
    let [error, setError] = useState<string>();
    let [sortBy, setSortBy] = useState<keyof Spell>('name');
    let [ascending, setAscending] = useState<boolean>(true);
    let location = useLocation();
    let history = useHistory();

    useEffect(() => {
        document.title = 'Spells - 2eTools';
        DataService.getSpells()
            .then(succ => {
                setSpells(dynamicSort<Spell>(succ, 'level', true))
            })
            .catch(err => {
                console.error(err);
                setError('oops, something went wrong. Please reload or try again later.');
            });
    }, []);

    useEffect(() => {
        let nameString = location.hash.replace('#', '').replace(/%20/g, ' ');
        let c = spells?.find(val => nameString === val.name);
        if (c) setSelected(c)
        else setSelected(undefined)
    }, [location, spells]);

    function toggleSpell(spell: Spell) {
        if (spell === selected) {
            setSelected(undefined);
            history.push(`${location.pathname}`);
        } else {
            console.log(spell);
            setSelected(spell);
            history.push(`${location.pathname}#${spell.name}`);
        }
    }

    const sorted = useMemo<Spell[] | undefined>(() => {
        switch (sortBy) {
            case "cast":
                return dynamicSort<Spell>(spells, sortBy, ascending, Spell.compareByCast, 'name');
            case "source":
                return dynamicSort<Spell>(spells, sortBy, ascending, Spell.compareBySource, 'name');
            default:
                return dynamicSort<Spell>(spells, sortBy, ascending, undefined, 'name');
        }
    }, [spells, sortBy, ascending])

    useEffect(() => {
        setSpells(sorted);
    }, [sorted])

    function toggleSortBy(field: keyof Spell) {
        if (spells) {
            if (sortBy === field) {
                setAscending(s => !s);
            } else {
                setSortBy(field);
                setAscending(true);
            }
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
                        <h4>Spells: Click to display details</h4>
                        <p className='text-muted'>hover over abbreviations to show more/expand tooltips</p>
                        <div className="table-responsive table-scrollable">
                            {spells?.length ?
                                <table className="table table-bordered table-hover table-striped">
                                    <thead>
                                    <tr className='text-capitalize text-justify'>
                                        <th onClick={() => toggleSortBy('name')}>name
                                            {sortBy === 'name' && (ascending ? <ArrowUpward fontSize='small'/> : <ArrowDownward fontSize='small'/>)}
                                        </th>
                                        <th onClick={() => toggleSortBy('level')}>level
                                            {sortBy === 'level' && (ascending ? <ArrowUpward fontSize='small'/> : <ArrowDownward fontSize='small'/>)}
                                        </th>
                                        <th onClick={() => toggleSortBy('cast')}>cast
                                            {sortBy === 'cast' && (ascending ? <ArrowUpward fontSize='small'/> : <ArrowDownward fontSize='small'/>)}
                                        </th>
                                        <th onClick={() => toggleSortBy('spellType')}>type
                                            {sortBy === 'spellType' && (ascending ? <ArrowUpward fontSize='small'/> : <ArrowDownward fontSize='small'/>)}
                                        </th>
                                        <th>trad.
                                        </th>
                                        <th onClick={() => toggleSortBy('source')}>source
                                            {sortBy === 'source' && (ascending ? <ArrowUpward fontSize='small'/> : <ArrowDownward fontSize='small'/>)}
                                        </th>
                                        <th onClick={() => toggleSortBy('isSustained')} title='Sustained'>S.
                                            {sortBy === 'isSustained' && (ascending ? <ArrowUpward fontSize='small'/> : <ArrowDownward fontSize='small'/>)}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {spells.map(spell => {
                                        return <tr key={spell.id} onClick={() => toggleSpell(spell)}
                                                   className={`${(spell === selected) ? 'bg-gold text-gold text-bold font-weight-bold' : ''}`}>
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
                                            <td className='align-middle'>
                                                {spell.traditions.map(t => {
                                                    return <p className='badge-gold badge p-pointer' key={t} title={t}>{t.charAt(0).toUpperCase()}</p>
                                                })}
                                            </td>
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
                    {selected &&
                    <div className='col'>
                        <Card>
                            <CardContent>
                                <div className='row'>
                                    <div className='col d-flex font-weight-bolder'>
                                        <div>{selected.name}</div>
                                        <div className='ml-auto'>{selected.spellType} {selected.level}</div>
                                    </div>
                                </div>
                                <hr/>
                                <div className='row'>
                                    <div className='col'>
                                        {selected.traits.map(tr => {
                                            return <Tooltip key={`${selected?.id}.${tr.id}`} title={tr.description}
                                                            classes={{tooltip: 'tooltip-lg'}}>
                                                <span className="badge badge-red">{tr.name}</span>
                                            </Tooltip>
                                        })}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <span className='font-weight-bold'>Source </span>
                                        <span
                                            className='p-1'>{selected.source.book} pg. {selected.source.page}</span>
                                    </div>
                                </div>
                                <div className='row row-cols-1'>
                                    <div className='col'>
                                        {selected.traditions?.length > 0 && <div className="d-flex">
                                            <span className="font-weight-bold">Tradition </span>
                                            <div>
                                                {selected.traditions.map((t, ind, arr) => {
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
                                                if (selected.trigger) {
                                                    return <img className='img pr-1' alt='' src={reaction}
                                                                height='16px'/>
                                                } else if (selected.actions.length) {
                                                    return selected.actions.map(act => {
                                                        let isrc = act === 0 ? freeAction : act === 1 ? oneAction : act === 2 ? twoActions : threeActions;
                                                        return <img key={`${selected?.id}.${act}`}
                                                                    className='img pr-1' alt='' src={isrc}
                                                                    height='16px'/>
                                                    })
                                                } else {
                                                    return <span>{selected.cast}</span>
                                                }
                                            })()}
                                        </span>
                                        <span>
                                        {selected.components.length ? '(' + selected.components.join(', ') + ')' : null}
                                        </span>
                                        {selected.cost &&
                                        <div>
                                            <span className="pl-1 font-weight-bold">cost </span>
                                            <span>{selected.cost}</span>
                                        </div>
                                        }
                                        {selected.requirements &&
                                        <div>
                                            <span className="pl-1 font-weight-bold">requirements </span>
                                            <span>{selected.requirements}</span>
                                        </div>
                                        }

                                        {selected.trigger &&
                                        <div>
                                            <span className="pl-1 font-weight-bold">trigger </span>
                                            <span>{selected.trigger}</span>
                                        </div>
                                        }
                                    </div>

                                    {(selected.range || selected.area || selected.targets) &&
                                    <div className="col d-flex">
                                        {selected.range &&
                                        <div className="pr-1">
                                            <span className="font-weight-bold">Range </span>
                                            <span>{selected.range}</span>
                                        </div>}
                                        {selected.area &&
                                        <div className="pr-1">
                                            <span className="font-weight-bold">Area </span>
                                            <span>{selected.area}</span>
                                        </div>}
                                        {selected.targets &&
                                        <div>
                                            <span className="font-weight-bold">Targets </span>
                                            <span>{selected.targets}</span>
                                        </div>}
                                    </div>
                                    }

                                    {(selected.savingThrow || selected.duration) &&
                                    <div className="col d-flex">
                                        {selected.savingThrow &&
                                        <div className="pr-1">
                                            <span className="font-weight-bold">Saving Throw  </span>
                                            <span>{selected.savingThrow}</span>
                                        </div>}
                                        {selected.duration &&
                                        <div>
                                            <span className="font-weight-bold">Duration </span>
                                            <span>{selected.duration}</span>
                                        </div>}
                                    </div>
                                    }
                                </div>
                                <hr/>
                                <div className='row row-cols-1'>
                                    <div className='col'>
                                        {selected.description.split('\n').map((p, ind) => {
                                            return <p key={ind}>{p}</p>
                                        })}
                                        {selected.criticalSuccess &&
                                        <div>
                                            <span className="font-weight-bold">Critical Success </span>
                                            <span>{selected.criticalSuccess}</span>
                                        </div>
                                        }
                                        {selected.success && <div>
                                            <span className="font-weight-bold">Success </span>
                                            <span>{selected.success}</span>
                                        </div>}
                                        {selected.failure && <div>
                                            <span className="font-weight-bold">Failure </span>
                                            <span>{selected.failure}</span>
                                        </div>}
                                        {selected.criticalFailure && <div>
                                            <span className="font-weight-bold">Critical Failure </span>
                                            <span>{selected.criticalFailure}</span>
                                        </div>}
                                    </div>
                                </div>
                                {selected.heightened?.length > 0 &&
                                <div className='row'>
                                    <div className='col'>
                                        <hr/>
                                        {selected.heightened.map(h => {
                                            return <div key={h.level}>
                                                <span className="font-weight-bold">Heightened ({h.level})</span>
                                                <span className="pl-1">{h.description.split('\n').map((p, ind) => {
                                                    return <p key={ind}>{p}</p>
                                                })}</span>
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
            <RollingTray/>
        </div>
    )
}
