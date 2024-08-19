import React from 'react';
import Box from '@material-ui/core/Box';
import globalStyles from "assets/globalStyles";
import { TextValidator} from 'react-material-ui-form-validator';
import { InputAdornment } from '@material-ui/core';
//import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';


//function arunSelect(x) { console.log("sel", x) };

export default function VsTextFilter(props) {
const gClasses = globalStyles();
let _type = (props.type == null) ? 'text' : props.type;
return (
	<TextValidator required fullWidth color="primary" className={gClasses.vgSpacing}
		label={props.label} required type={_type} onChange={props.onChange} value={props.value}
		InputProps={
			{
				endAdornment: (
					<div>
					<InputAdornment position="end"><ClearIcon onClick={props.onClear} /></InputAdornment>
					</div>
					)
			}
		}
	/>
)
}

