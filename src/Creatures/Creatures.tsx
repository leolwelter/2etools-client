import Navbar from "../Navbar/Navbar";
import React, {useEffect, useMemo, useRef, useState} from "react";
import DataService from "../_services/data-service";
import {Card, CardContent, LinearProgress, Tooltip} from "@material-ui/core";
import {Creature} from "../_interfaces/creature";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import RollingTray from "../Roller/RollingTray";

export default function Creatures() {
    let [creatures, setCreatures] = useState<Creature[]>();
    let [selected, setSelected] = useState<Creature>();
    let [error, setError] = useState<string>();
    let [ascending, setAscending] = useState<boolean>(true);
    let [sortBy, setSortBy] = useState<keyof Creature>('id');
    let roller = useRef<any>(null);

    useEffect(() => {
        document.title = 'Creatures - 2eTools';
        DataService.getCreatures()
            .then(succ => {
                setCreatures(dynamicSort(succ, 'id', true));
            })
            .catch(err => {
                console.error(err);
                setError('oops, something went wrong. Please reload or try again later.');
            });
    }, []);

    const sorted = useMemo<Creature[] | undefined>(() => {
        switch (sortBy) {
            case "rarity":
                return dynamicSort<Creature>(creatures, sortBy, ascending, Creature.compareByRarity, 'name');
            case "source":
                return dynamicSort<Creature>(creatures, sortBy, ascending, Creature.compareBySource, 'name');
            case "size":
                return dynamicSort<Creature>(creatures, sortBy, ascending, Creature.compareBySize, 'name');
            default:
                return dynamicSort<Creature>(creatures, sortBy, ascending, undefined, 'name');
        }

    }, [creatures, sortBy, ascending])

    useEffect(() => {
        setCreatures(sorted);
    }, [sorted])

    function toggleSelected(creature: Creature) {
        if (creature === selected) {
            setSelected(undefined);
        } else {
            setSelected(creature);
        }
    }

    // TODO get secondary sort to work properly with ascending logic
    function dynamicSort<T>(array: T[] | undefined, field: keyof T, asc: boolean, compareFunc?: (((a: T, b: T) => number) | undefined), secondaryField?: keyof T): undefined | T[] {
        if (array === undefined) {
            return undefined;
        } else if (array?.length < 1) {
            return undefined;
        }

        // secondary field sorts are always ascending
        if (secondaryField)
            array = array.sort((a, b) => a[secondaryField] < b[secondaryField] ? -1 : 1);

        let cFunc: any;
        if (!compareFunc) {
            cFunc = (a: T, b: T) => {
                return a[field] < b[field] ? -1 : 1;
            };
        } else {
            cFunc = compareFunc;
        }
        return asc ? array.sort(cFunc) : array.sort(cFunc).reverse();
    }


    function toggleSortBy(field: keyof Creature) {
        if (creatures) {
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
                    {/*creatures table*/}
                    <div className='col-12 col-md-6'>
                        <h4>Creatures: Click to display details</h4>
                        <p className='text-muted'>hover over abbreviations to show more/expand tooltips</p>
                        <div className="table-responsive table-scrollable">
                            {creatures?.length ?
                                <table className="table table-bordered table-hover table-striped">
                                    <thead>
                                    <tr className='text-capitalize text-justify'>
                                        <th onClick={() => toggleSortBy('name')}>name
                                            {sortBy === 'name' && (ascending ? <ArrowUpward fontSize='small'/> :
                                                <ArrowDownward fontSize='small'/>)}
                                        </th>
                                        <th onClick={() => toggleSortBy('family')}>family
                                            {sortBy === 'family' && (ascending ? <ArrowUpward fontSize='small'/> :
                                                <ArrowDownward fontSize='small'/>)}
                                        </th>
                                        <th onClick={() => toggleSortBy('level')}>level
                                            {sortBy === 'level' && (ascending ? <ArrowUpward fontSize='small'/> :
                                                <ArrowDownward fontSize='small'/>)}
                                        </th>
                                        <th onClick={() => toggleSortBy('source')}>Source
                                            {sortBy === 'source' && (ascending ? <ArrowUpward fontSize='small'/> :
                                                <ArrowDownward fontSize='small'/>)}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {creatures.map(creature => {
                                        return <tr key={creature.id} onClick={() => toggleSelected(creature)}
                                                   className={`${(creature === selected) ? 'bg-gold text-gold text-bold font-weight-bold' : ''}`}>
                                            <td>{creature.name}</td>
                                            <td>{creature.family}</td>
                                            <td>{creature.level}</td>
                                            <td>{creature.source.book} ({creature.source.page})</td>
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

                    {/*selected creature in card view*/}
                    {selected &&
                    <div className='col'>
                        <Card className='creature-card'>
                            <CardContent>
                                <div className='row'>
                                    <div className='col d-flex font-weight-bolder'>
                                        <div>{selected.name}</div>
                                        <div className='ml-auto'>Creature {selected.level}</div>
                                    </div>
                                </div>
                                <hr/>
                                <div className='row'>
                                    <div className='col text-capitalize'>
                                        {selected.rarity !== 'common' &&
                                        <span className='badge trait-badge-orange'>{selected.rarity}</span>}
                                        <span className='badge trait-badge-blue'>{selected.alignment}</span>
                                        <span className='badge trait-badge-green'>{selected.size}</span>
                                        {selected.traits.map((tr, ind) => {
                                            return <Tooltip key={ind} title={tr.description}
                                                            classes={{tooltip: 'tooltip-lg'}}>
                                                <span className="badge badge-red">{tr.name}</span>
                                            </Tooltip>
                                        })}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <b>Perception</b>
                                        <span onClick={() => roller.current?.submitPrompt(`1d20+${selected?.perception}`, `${selected?.name} - Perception`)}
                                            className='pl-1'>{selected.perception > 0 ? '+' : '-'}{selected.perception}
                                        </span>
                                        <span>; {selected.senses.join(', ')}</span>
                                    </div>
                                </div>
                                {selected.languages.length > 0 &&
                                <div className='row'>
                                    <div className='col'>
                                        <b>Languages</b>
                                        <span className='pl-1'>{selected.languages.join(', ')}</span>
                                        {selected.otherCommunication.length > 1 &&
                                        <span>; {selected.otherCommunication.join(', ')}</span>}
                                    </div>
                                </div>
                                }
                                {selected.skills.length > 0 &&
                                <div className='row'>
                                    <div className='col'>
                                        <b>Skills</b>
                                        {selected.skills.map((s, i) => {
                                            return <span key={i}><span>{i > 0 ? ', ' : ' '}{s.name} </span>
                                                <span className='text-gold'>+{s.modifier}</span>
                                                <span className='text-muted'>{s.text && ` ${s.text}`}</span></span>
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
            <RollingTray ref={roller}/>
        </div>
    )
}
