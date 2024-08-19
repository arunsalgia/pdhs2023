import React from 'react';
import Typography from '@material-ui/core/Typography';
import globalStyles from "assets/globalStyles";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default function VsAutoComplete(props) {
const gClasses = globalStyles();
return (
	<div align={_align} >
	{(props.getOptionLabel) && 
		<Autocomplete disablePortal
			id={props.id}
			defaultValue={props.defaultValue}
			onChange={props.onChange}
			style={{paddingTop: "10px" }}
			getOptionLabel={props.getOptionLabel}
			options={props.optionList}
			sx={{ width: 300 }}
			renderInput={(params) => <TextField {...params} />}
		/>		
	}
	</div>
	)
}

