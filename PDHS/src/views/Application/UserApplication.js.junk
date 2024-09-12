import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import ReactTooltip from "react-tooltip";

/*
import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import lodashSortBy from 'lodash/sortBy';

// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';

*/

import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// styles
import globalStyles from "assets/globalStyles";


import {DisplayPageHeader,
} from "CustomComponents/CustomComponents.js"


import { 
	isMobile,
} from "views/functions.js";

import { getMemberName, dateString } from 'views/functions';

var loginHid, loginMid;
export default function PDHSAdmin() {
	loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	
	const gClasses = globalStyles();	
  const [applicationArray, setApplicationArray] = useState([]);	

  useEffect(() => {		
		getAllApplication();
  }, []);

	async  function getAllApplication() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/application/list/${loginHid}`;
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			setApplicationArray(resp.data);
		} catch (e) {
			console.log(e);
			setApplicationArray([]);
		}	
	}
		
	


	function DisplayAllApplication() {
	return (
	<div>
		<Box  key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="left" key={"DOC1H"} item xs={4} sm={4} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >Date</Typography>
		</Grid>
			<Grid align="center" key={"DOC2H"} item xs={8} sm={8} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2Brown} >Description</Typography>
		</Grid>
		<Grid align="center" key={"DOC3H"} item xs={3} sm={3} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >App. No.</Typography>
		</Grid>
		<Grid align="center" key={"DOC4H"} item xs={2} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >Status</Typography>
		</Grid>
			<Grid align="center" key={"DOC5H"} item xs={7} sm={7} md={3} lg={3} >
			<Typography className={gClasses.patientInfo2Brown} >Admin</Typography>
		</Grid>
		</Grid>
		</Box>
		{applicationArray.map( (a, index) => {
			//console.log(a);
			return (
			<Box  key={"DOC0Box"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"DOC0GRD"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="left" key={"DOC1"+index} item xs={4} sm={4} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{dateString(a.date)}</Typography>
			</Grid>
			<Grid align="center" key={"DOC2"+index} item xs={8} sm={8} md={6} lg={6} >
				<Typography className={gClasses.patientInfo2}>{a.desc}</Typography>
			</Grid>
			<Grid align="center" key={"DOC3"+index} item xs={3} sm={3} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{a.id}</Typography>
			</Grid>
			<Grid align="center" key={"DOC4"+index} item xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{a.status}</Typography>
			</Grid>
			<Grid align="center" key={"DOC5"+index} item xs={7} sm={7} md={3} lg={3} >
				<Typography className={gClasses.patientInfo2}>{a.adminName}</Typography>
			</Grid>
			</Grid>
			</Box>
		)})}
	</div>
	)}
	
	return (
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayPageHeader headerName="Application Status" groupName="" tournament=""/>
		<br />
		<DisplayAllApplication />
		</div>
	);
}
 