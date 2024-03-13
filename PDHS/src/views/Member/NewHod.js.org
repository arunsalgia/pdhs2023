import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	showError, showSuccess, showInfo,
	disableFutureDt,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import VsButton from "CustomComponents/VsButton"; 
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsRadioGroup from "CustomComponents/VsRadioGroup";


import {
	SELFRELATION, RELATION, GENTSRELATION, LADIESRELATION,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
} from 'views/functions';


export default function NewHod(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [header, setHeader] = useState("");
	const [stage, setStage] = useState("STAGE1");
	const [stage2Req, setStage2Ref] = useState(false);
	
	const [emurDate1, setEmurDate1] = useState(moment());
	
	
	const [cbArray, setCbArray] = useState(Array(25).fill(""));
	const [memberList, setMemberList] = useState([]);
	const [selectedMemberList, setSelectedMemberList] = useState([]);
	const [relation, setRelation] = useState([]);
	const [newHod, setNewHod] = useState(props.selectedMid);
	const [registerStatus, setRegisterStatus] = useState(0);
	
	

	useEffect(() => {
		setHeader("Apply new HOD " + getMemberName(props.memberList.find(x => x.mid === props.selectedMid), false, false) );
		setRelation(lodashMap(props.memberList, 'relation'));
		setMemberList(props.memberList);
	}, [])



function handleNewRelation(rel, idx) {
	//console.log(rel, idx);	
	var tmp = [].concat(relation);
	tmp[idx] = rel;
	setRelation(tmp);
}


async function handleNewHodSubmit() {
	props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error new HOD member`});
	return;
}


return (
	<div>
		<br />
		<Typography align="center" className={gClasses.title}>{header}</Typography>
		<br />
		<Typography align="center" className={gClasses.title}>Select relation</Typography>
		<br />
		<Grid key="SPLIT3" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
			</Grid>	
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.titleOrange}>{"Relation"}</Typography>
			</Grid>
		</Grid>
		{memberList.map( (m, index) => {
			var tmpRelation = relation[index];
			if (m.mid === props.selectedMid)
				tmpRelation = "Self";
			else if (tmpRelation = "Self")
				tmpRelation = (m.gender === "Male") ? "Brother" : "Sister";
		
			// Select relation list based on Gender
			var tmpRelationList = RELATION;
			if (tmpRelation === "Self")
				tmpRelationList = SELFRELATION;
			else if (m.gender === "Male")
				tmpRelationList = GENTSRELATION;
			else if (m.gender === "Female")
				tmpRelationList = LADIESRELATION;
			else
				tmpRelationList = RELATION;
			return (
				<Grid key={"SPLITARRAY3"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{marginTop: "10px"}}  item xs={7} sm={7} md={7} lg={7} >
					<Typography style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
				</Grid>	
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
					options={tmpRelationList} value={tmpRelation} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
				</Grid>
				</Grid>	
			)}
		)}			
		<br />
		<VsButton align="center" name="Submit" onClick={handleNewHodSubmit} />
		<br />
	</div>
	)
}
