import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';


import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Gotra from "views/Admin/Gotra";
import City from "views/Admin/City";

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



export default function Admin(props) {
	const gClasses = globalStyles();
	const [currentSelection, setCurrentSelection] = useState("Gotra");


  useEffect(() => {	
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
			<DisplayFunctionItem item="Gotra" />
			<DisplayFunctionItem item="City" />
		</Grid>	
	)}
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	{/*<DisplayMemberHeader member={currentMemberData} />*/}
	<DisplayFunctionHeader />
		{(currentSelection === "Gotra") &&
			<Gotra />
		}
		{(currentSelection === "City") &&
			<City />
		}
  </div>
  );    
}
