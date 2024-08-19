import React from 'react';
import Typography from '@material-ui/core/Typography';
import globalStyles from "assets/globalStyles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core//Checkbox';
import Radio from '@material-ui/core/Radio';

export default function VsRadioSa(props) {
const gClasses = globalStyles();
let _label = (props.label == null) ? "" : props.label;
return (
	<Radio size="small" color="secondary" checked={props.checked}  onClick={props.onClick} />
)
}

