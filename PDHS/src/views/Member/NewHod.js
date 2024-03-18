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
	hasPRWSpermission,
} from 'views/functions';


export default function NewHod(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [header, setHeader] = useState("");
	const [newHodRec, setNewHodRec] = useState({});
	const [oldHodRec, setOldHodRec] = useState({});
	const [relation, setRelation] = useState([]);
	const [memberList, setMemberList] = useState([]);

	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };


	useEffect(() => {
		// get new HOD record
		let memRec = props.memberList.find(x => x.mid === props.selectedMid);
		setHeader(`Apply for ${getMemberName(memRec, false, false)} as new Family Head` );
		setNewHodRec(memRec);

		// get current HOD record
		memRec = props.memberList.find(x => x.mid === props.hodMid);
		setOldHodRec(memRec);
		// Change the relation from "Self" to Brother/Sister"
		memRec.relation = (memRec.gender === "Female") ? "Sister" : "Brother";
		
		// balance members and relation
		var tmpArray = props.memberList.filter(x => x.mid !== props.selectedMid);
		setRelation(lodashMap(tmpArray, 'relation'));
		setMemberList(tmpArray);
	}, [])


function handleNewRelation(rel, idx) {
	//console.log(rel, idx);	
	var tmp = [].concat(relation);
	tmp[idx] = rel;
	setRelation(tmp);
}


async function handleNewHodSubmit() {
	var myInfo = {
		hid:  props.memberList[0].hid,
		newHodMid: newHodRec.mid,
		newHodName: getMemberName(newHodRec, false, false),
		oldHodName: getMemberName(oldHodRec, false, false),		
		midList: lodashMap(memberList, 'mid'),
		nameList: [],
		oldRelationList: lodashMap(props.memberList.filter(x => x.mid !== props.selectedMid), 'relation'),
		relationList: relation
	}
	
	var nameList = [];
	for(var i=0; i<memberList.length; ++i) {
		nameList.push(getMemberName(memberList[i], false, false));
	}
	myInfo.nameList = nameList;
	//console.log(myInfo);
	myInfo = encodeURIComponent(JSON.stringify(myInfo));
	//return;
	

	try {
 		// apply for both admin and member
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/newhod/${props.hodMid}/${sessionStorage.getItem("mid")}/${myInfo}`;
		var resp = await axios.get(myUrl);
		
		props.onReturn.call(this, {
			status: STATUS_INFO.SUCCESS,
			data: resp.data,
			msg: `Successfully applied for ${getMemberName(newHodRec)} as new F.Head. Your application id ref. ${resp.data.id}`
		});
	} catch (e) {
		console.log(e);
		props.onReturn.call(this, {status: STATUS_INFO.ERROR,  msg: `Error setting ${getMemberName(newHodRec)} as new F.Head.`});
	}	
	return;
}

	
return (
	<div>
		<br />
		<Typography align="center" className={gClasses.title}>{header}</Typography>
		<br />
		<Typography align="center" className={gClasses.pdhs_title}>{`Relation of members with new Family Head`}</Typography>
		<br />
		{memberList.map( (m, index) => {
			//var tmpRelation = relation[index];
			// Select relation list based on Gender
			var tmpRelationList = RELATION;
			if (m.gender === "Male")
				tmpRelationList = GENTSRELATION;
			else if (m.gender === "Female")
				tmpRelationList = LADIESRELATION;
		
			return (
			<Grid key={"NEWHODRELATION"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px"}}  item xs={7} sm={7} md={7} lg={7} >
				<Typography style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
			</Grid>	
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
				options={tmpRelationList} value={relation[index]} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
			</Grid>
			</Grid>	
			)}
		)}
		<br />
		<VsButton align="center" name="Apply" onClick={handleNewHodSubmit} />
		<br />
		<ToastContainer />
	</div>
	)
}
