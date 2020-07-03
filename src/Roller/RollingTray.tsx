import React, {
    forwardRef,
    PropsWithoutRef,
    Ref,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import DataService from "../_services/data-service";
import {AppContext} from "../App";

enum CMD_RETURN {
    CLEAR = '/clear',
    HELP = '/help',
    INVALID = 'invalid',
}

export interface RollCommand {
    promptLine: string;
    result: string;
    label: string;
}

const HelpStr: string = 'Use /help to display this message\n' +
    'type \'XdY\' to roll X dice of step Y\n' +
    'add a modifier: \'XdY+Z\' or \'XdY-Z\'\n' +
    'roll a flat check (DC X): \'flatX\' or \'fX\'\n' +
    'Use /clear to clear history.\n' +
    'click on any entry to fill in its prompt\n' +
    'links highlighted red will be rolled (and show up) here\n' +
    'the history stays between sessions';

function RollingTray(props: PropsWithoutRef<any>, ref: Ref<any>) {
    let [history, setHistory] = useState<RollCommand[]>([]);
    let [promptLine, setPromptLine] = useState<string>('');
    let [hidden, setHidden] = useState<boolean>(true);
    let rollerRef = useRef<HTMLInputElement>(null);
    let globalContext = useContext<any>(AppContext)

    /** handle external components using ref to submit promptLines **/
    useImperativeHandle(ref, () => ({
        submitPrompt: (pl: string, label: string) => handleSubmit(null, pl, label)
    }));

    /** set history on component mount **/
    useEffect(() => {
        setHistory(globalContext.context.rollHistory);
    }, [globalContext.context.rollHistory])

    /** returns an integer between min and max **/
    function randInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    /** parses the prompt line given and returns a string to add to history, or undefined if invalid **/
    function processCommand(promptLine: string): RollCommand {
        // parse
        const reDice = /^\s*([0-9]+)d([0-9]+)\s*(([+-])\s*([0-9]+))?\s*$/;
        const reCmd = /^\s*(\/\w+)\s*$/;
        const reFlat = /^\s*(Flat|F |flat|f)([0-9]+)\s*$/;
        let mDice = promptLine.match(reDice);
        let mCmd = promptLine.match(reCmd);
        let mFlat = promptLine.match(reFlat);

        if (mDice) {
            const numDice = Number.parseInt(mDice[1], 10);
            const stepDice = Number.parseInt(mDice[2], 10);
            const modifier = Number.parseInt(mDice[4] + mDice[5], 10);
            let total = 0;
            let line = '';
            for (let i = 0; i < numDice; i++) {
                let x = randInt(1, stepDice);
                total += x;
                if (i > 0) line += ' + '
                line += `[${x}]`
            }
            if (modifier) {
                total += modifier;
                modifier >= 0 ? line += ` + ${modifier}` : line += ` - ${Math.abs(modifier)}`;
            }
            line = `${total} = ${line}`;
            return {label: 'Anon', promptLine: promptLine, result: line};
        } else if (mCmd) {
            if (mCmd[1] === CMD_RETURN.CLEAR) {
                return {label: '', promptLine: CMD_RETURN.CLEAR, result: 'cleared'};
            } else if (mCmd[1] === CMD_RETURN.HELP) {
                return {label: 'Help', promptLine: CMD_RETURN.HELP, result: HelpStr};
            } else {
                return {label: '', promptLine: CMD_RETURN.INVALID, result: 'invalid input: try /help'};
            }
        } else if (mFlat) {
            let DC = Number.parseInt(mFlat[2], 10);
            let roll = randInt(1, 20);
            let result = roll >= DC ? `SUCCESS! [${roll}] ≥ DC ${DC}` : `FAILURE: [${roll}] < DC ${DC}`;
            return {label: 'Anon', promptLine: promptLine, result: result}
        } else {
            return {label: '', promptLine: CMD_RETURN.INVALID, result: 'invalid input: try /help'};
        }
    }

    /** process the passed command, set global context and localstorage **/
    async function handleSubmit(event: any, pLine?: string, label?: string) {
        console.log(`rolling: ${promptLine.trim() || pLine?.trim()}`);
        setHidden(false);
        event && event.preventDefault();
        if (promptLine.trim() || pLine?.trim()) {
            let procLine = pLine ? processCommand(pLine) : processCommand(promptLine);
            if (label) procLine.label = label;
            if (procLine.promptLine === CMD_RETURN.CLEAR) {
                globalContext.setContext({rollHistory: [procLine]})
                await DataService.setRollHistory([procLine]);
            } else if (procLine.promptLine === CMD_RETURN.HELP) {
                globalContext.setContext({rollHistory: [procLine, ...(history || [])]})
                await DataService.setRollHistory([procLine, ...(history || [])]);
            } else if (procLine.promptLine === CMD_RETURN.INVALID) {
                globalContext.setContext({rollHistory: [procLine, ...(history || [])]})
                await DataService.setRollHistory([procLine, ...(history || [])]);
            } else if (procLine) {
                globalContext.setContext({rollHistory: [procLine, ...(history || [])]})
                await DataService.setRollHistory([procLine, ...(history || [])]);
            }
            setPromptLine('');
        }
    }

    return (
        hidden ?
            <div onClick={() => setHidden(false)} className='roller-tray-hidden bg-gold text-gold'>
                <span>Rolling Tray</span>
            </div> :
            <div className='roller-tray'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col'>
                            <div className='row'>
                                <div className='col bg-gold text-gold p-pointer' onClick={() => setHidden(true)}>
                                    <span className='my-1 font-weight-bolder'>Rolling Tray</span>
                                    <span className='float-right my-1 font-weight-bolder'>X</span>
                                </div>
                            </div>
                            {/*prompt*/}
                            <div className='row no-padding'>
                                <div className='col'>
                                    <form onSubmit={handleSubmit}>
                                        <input className='form-control form-control-sm border-square' id='roller-tray'
                                               ref={rollerRef}
                                               placeholder='type 1d20+7 or /help'
                                               autoComplete='off'
                                               value={promptLine}
                                               onKeyDown={(e) => {
                                                   if (history.length && history.length > 0 && e.key === 'ArrowUp') {
                                                       setPromptLine(history[0].promptLine);
                                                   }
                                               }}
                                               onKeyUp={(e) => {
                                                   if (history.length && history.length > 0 && e.key === 'ArrowUp') {
                                                       e.currentTarget.setSelectionRange(promptLine.length, promptLine.length, "none");
                                                   }
                                               }}
                                               onChange={(e) => {
                                                   setPromptLine(e.target.value || '')
                                               }
                                               }
                                        />
                                    </form>
                                </div>
                            </div>

                            {/*history*/}
                            <div className='row no-padding'>
                                <div className='col'>
                                    <div className='history'>
                                        <ul className='list-group list-group-flush'>
                                            {history && history.map((line, ind) => {
                                                return <li key={ind}
                                                           onClick={() => {
                                                               setPromptLine(line.promptLine);
                                                               rollerRef.current?.focus()
                                                           }}
                                                           className='p-pointer list-group-item list-group-item-light'>
                                                    {line.label && <label
                                                        className='text-muted p-pointer'>{`${line.label}: ${line.promptLine}`}</label>}
                                                    {line.result.split('\n').map((p, ind) => {
                                                        return <p key={ind} className='my-1'>{p}</p>
                                                    })}
                                                </li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
    )
}

export default forwardRef(RollingTray);
