import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";


import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";
import { JumpButton, DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	showError, showSuccess, showInfo,
	disableFutureDt,
	dateString,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import VsButton from "CustomComponents/VsButton"; 
//import VsSelect from "CustomComponents/VsSelect";
//import VsRadio from "CustomComponents/VsRadio";
//import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsRadioGroup from "CustomComponents/VsRadioGroup";


import {
	//SELFRELATION, RELATION, GENTSRELATION, LADIESRELATION,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
} from 'views/functions';


export default function MemberEditDom(props) {
	const gClasses = globalStyles();
	
	const [header, setHeader] = useState("");
	const [emurDate1, setEmurDate1] = useState(moment());


	useEffect(() => {
		console.log(props.couple);
      
		if (!props.couple.dom.startsWith("1899"))
			setEmurDate1(props.couple.momentDom);
	}, [])






async function handleDOMChangeSubmit() {
	var myInfo = {
		hid:  props.hid,
		groomMid: props.couple.gMid,
		groomName: props.couple.gName,
		brideMid: props.couple.bMid,
		brideName: props.couple.bName,
		dom: emurDate1.toDate(),
	}
	console.log(props);

	myInfo = encodeURIComponent(JSON.stringify(myInfo));
	try {
 		// apply for both admin and member
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/changedom/${props.hodMid}/${sessionStorage.getItem("mid")}/${myInfo}`;
		console.log(myUrl);
		var resp = await axios.get(myUrl);
		
		props.onReturn.call(this, {
			status: STATUS_INFO.SUCCESS,
			data: resp.data,
			msg: `Successfully applied for DOM change. Your application id ref. ${resp.data.id}`
		});
	} catch (e) {
		console.log(e);
		props.onReturn.call(this, {status: STATUS_INFO.ERROR,  msg: `Error updating DOM.`});
	}	
	return;
}



return (
	<div>
		<br />
		<Typography align="center" className={gClasses.title}>Apply to change DOM of</Typography>
		<Typography align="center" className={gClasses.title}>{`${props.couple.gName} &`}</Typography>
		<Typography align="center" className={gClasses.title}>{props.couple.bName}</Typography>
		<br />
		<Grid key="SPLIT1" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography className={gClasses.patientInfo2Blue} >Date of Marriage</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={emurDate1}
				value={emurDate1}
				dateFormat="DD/MMM/yyyy"
				isValidDate={disableFutureDt}
				onClose={setEmurDate1}
				closeOnSelect={true}
			/>
		</Grid>
		</Grid>
		<br />
		<VsButton align="center" name="Apply" onClick={handleDOMChangeSubmit} />
		<br />
		<ToastContainer />
	</div>
	)
}
