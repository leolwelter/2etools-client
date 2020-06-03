import React, {useRef, useState} from "react";

enum CMD_RETURN {
    CLEAR = '/clear',
    HELP = '/help',
    INVALID = 'invalid',
}

interface RollCommand {
    promptLine: string;
    result: string;
    label: string;
}

const HelpStr: string = 'Use /help to display this message\n'+
    'type \'XdY\' to roll x dice of y sides\n'+
    'add a modifier: \'XdY+Z\' or \'XdY-Z\'\n'+
    'roll a flat check: \'flatX\' or \'fX\'\n'+
    'Use /clear to clear history.'


export default function RollingTray() {
    let [history, setHistory] = useState<RollCommand[]>([]);
    let [promptLine, setPromptLine] = useState<string>('');
    let [hidden, setHidden] = useState<boolean>(true);
    let rollerRef = useRef<HTMLInputElement>(null);

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
        const reFlat = /^\s*(flat|f)([0-9]+)\s*$/;
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
            return {label:'Anon', promptLine:promptLine, result: line};
        } else if (mCmd) {
            if (mCmd[1] === CMD_RETURN.CLEAR) {
                return {label:'', promptLine:CMD_RETURN.CLEAR, result:'cleared'};
            } else if(mCmd[1] === CMD_RETURN.HELP) {
                return {label:'Help', promptLine:CMD_RETURN.HELP, result: HelpStr};
            } else {
                return {label:'', promptLine: CMD_RETURN.INVALID, result: 'invalid input: try /help'};
            }
        } else if (mFlat) {
            let DC = Number.parseInt(mFlat[2], 10);
            let roll = randInt(1, 20);
            let result = roll >= DC ? `SUCCESS! [${roll}] ≥ DC ${DC}` : `FAILURE: [${roll}] < DC ${DC}`;
            return {label: 'Anon', promptLine: promptLine, result: result}
        } else {
            return {label:'', promptLine: CMD_RETURN.INVALID, result: 'invalid input: try /help'};
        }
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        if (promptLine.trim()) {
            const procLine = processCommand(promptLine);
            if (procLine.promptLine === CMD_RETURN.CLEAR) {
                setHistory([procLine]);
            } else if (procLine.promptLine === CMD_RETURN.HELP) {
                setHistory([procLine, ...history]);
            } else if (procLine.promptLine === CMD_RETURN.INVALID){
                setHistory([procLine, ...history]);
            } else if (procLine) {
                setHistory([procLine, ...history]);
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
                                                   setPromptLine(e.target.value || '')}
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
                                            {history.map((line, ind) => {
                                                return <li key={ind}
                                                           onClick={() => {setPromptLine(line.promptLine); rollerRef.current?.focus()}}
                                                           className='p-pointer list-group-item list-group-item-light'>
                                                    {line.label && <label className='text-muted p-pointer'>{`${line.label}: ${line.promptLine}`}</label>}
                                                    <p className='my-0 pre-spaced'>{line.result}</p>
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
