import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';


import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Gotra from "views/Admin/Gotra";
import City from "views/Admin/City";
import Permissions from "views/Admin/Permissions";

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";



import {
	BlankArea,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"


import { 
	vsDialog,
} from "views/functions.js";



var adminRec = {mid: 0};

export default function Admin(props) {
	const gClasses = globalStyles();
	const [currentSelection, setCurrentSelection] = useState("Gotra");
	const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
		var tmpAdmin = false;
		if (sessionStorage.getItem("isMember") === "true") {
			adminRec = JSON.parse(sessionStorage.getItem("adminRec"));
			if ((adminRec.superAdmin) || (adminRec.pjymAdmin) || (adminRec.humadAdmin) || (adminRec.prwsAdmin) || (adminRec.pmmAdmin))
				tmpAdmin = true;
		}
		setIsAdmin(tmpAdmin);
  }, []);



	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >	
		<Typography onClick={() => setCurrentSelection(itemName)}>
			<span 
				className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
			{itemName}
			</span>
		</Typography>
		</Grid>
		)}
	
	
	function DisplayFunctionHeader() {
		return (
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
			<DisplayFunctionItem item="Permissions" />
			<DisplayFunctionItem item="Gotra" />
			<DisplayFunctionItem item="City" />
		</Grid>	
	)}

	if (!isAdmin)
	return (
	<div key="PRWS" className={gClasses.webPage} align="center" key="main">
		<br />
		<br />
		<Typography className={gClasses.message18Blue}>No permissions for non-admin users</Typography>
		<br />
		<br />
	</div>
	);
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	{/*<DisplayMemberHeader member={currentMemberData} />*/}
	<DisplayFunctionHeader />
		{(currentSelection === "Permissions") &&
			<Permissions />
		}
		{(currentSelection === "Gotra") &&
			<Gotra />
		}
		{(currentSelection === "City") &&
			<City />
		}
  </div>
  );    
}
