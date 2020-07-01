import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    overrides: {
        // Name of the component
        MuiLinearProgress: {
            root: {
                height: 6
            },
            colorPrimary: {backgroundColor: '#f8d991'},
            barColorPrimary: {backgroundColor: '#b01820'},
            bar: {
                height: 6,
                borderRadius: 5
            }
        },
        MuiTooltip: {
            tooltip: {
                fontSize: 14
            }
        }
    },
});
