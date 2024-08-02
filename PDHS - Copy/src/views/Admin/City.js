import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsRadio from "CustomComponents/VsRadio";


//import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import lodashSortBy from 'lodash/sortBy';

// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';

// styles
import globalStyles from "assets/globalStyles";


import {DisplayPageHeader, ValidComp, BlankArea,
} from "CustomComponents/CustomComponents.js"


import { 
	vsDialog,
} from "views/functions.js";

import {
  PADSTYLE,
} from "views/globals.js";


export default function City() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
  const [cityArray, setCityArray] = useState([]);	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [rename, setRename] = useState(false);
	
	const [emurName, setEmurName] = useState("");
	const [emurOrigName, setEmurOrigName] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);


	
  useEffect(() => {		
		getAllCity();
  }, []);

	async  function getAllCity() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/city/list`;
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			setCityArray(resp.data);
		} catch (e) {
			setCityArray([]);
		}	
	}
		
	function ShowResisterStatus() {
		let myMsg = "";
		switch (registerStatus) {
			case 0:  myMsg = ""; break;
			case 1001: myMsg = "Blank City name"; break;
			case 1002: myMsg = "Duplicate City name"; break;
			default:  myMsg = "Unknown error"; break;
		}
		return (
		<div>
			<Typography className={(registerStatus != 0) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
		</div>
		);
	}
	

	function addCity() {
		setRegisterStatus(0); 
		setEmurName("")
		setIsDrawerOpened("ADD");  
	}
	
	function editCity(cityRec) {
		setRegisterStatus(0);
		setRename(false);
		setEmurName(cityRec.city); 
		setEmurOrigName(cityRec.city);
    //console.log(cityRec.city);
		setIsDrawerOpened("EDIT");  
	}
	
	async function  addCitySubmit()  {
		let newName = emurName.trim();
		setEmurName(newName);
		//console.log("name is", newName);
		// for blank and duplicate
		if (newName.length === 0) return setRegisterStatus(1001);	
		if (cityArray.find(x => x.id === newName.toLowerCase())) return setRegisterStatus(1002);
		// now add gotra
		//console.log("all ok");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/add/${newName}`;
			let resp = await axios.get(myUrl);
			let tmpArray = [resp.data].concat(cityArray);
			setCityArray(lodashSortBy(tmpArray, 'id'));
		} catch (e) {
			console.log(e);
			alert.error("Error adding new gotra");
		}
		setIsDrawerOpened("");
	};
  
		
	async function  editCitySubmit()  {
		let newName = emurName.trim();
		setEmurName(newName);
		// check for blank and duplicate (if not rename to existing)
		if (newName.length === 0) return  setRegisterStatus(1001);	
		if (rename) {
			// new name must be already defined
			let tmp =  cityArray.find(x => x.id === newName.toLowerCase());
			if (!tmp) return setRegisterStatus(1003);
		} else {
			// if not rename to existing, new name must not be defined
			let tmp =  cityArray.find(x => x.id === newName.toLowerCase());
			if (tmp) return setRegisterStatus(1002);
		}

		setIsDrawerOpened("");
		let subcmd = (rename) ? "renametoexisting" : "renametonew"
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/${subcmd}/${emurOrigName}/${newName}`;
			let resp = await axios.get(myUrl);
			let tmpArray;
			if (subcmd === "renametonew") {
				tmpArray = [resp.data].concat(cityArray.filter(x => x.name !== emurOrigName));
			} else {
				tmpArray = cityArray.filter(x => x.name !== emurOrigName);
			}
			setCityArray(lodashSortBy(tmpArray, 'id'));
		} catch (e) {
			console.log(e);
			alert.error("Error adding new gotra");
		}
	};
	

	function delCity(cityRec) {
		vsDialog("Delete City", `Are you sure you want to delete ${cityRec.name}?`,
		{label: "Yes", onClick: () => handleDelCityConfirm(cityRec) },
		{label: "No" }
		);
	}
	
	async function handleDelCityConfirm(cityRec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/city/delete/${cityRec.name}`;
			let resp = await axios.get(myUrl);
			let tmpArray = [resp.data].concat(cityArray);
			setCityArray(cityArray.filter(x => x.id !== cityRec.id));
		} catch (e) {
			console.log(e);
			alert.error(`City ${cityRec.name} is configured. Cannot delete`);
		}
		//setIsDrawerOpened("");
	}

	function DisplayAllCity() {
	return (
	<Grid key="AllDOCS" container>
	{cityArray.map( (d, index) => 
		<Grid align="left" key={"CITYALL"+index} item xs={12} sm={6} md={3} lg={3} >
			<Box style={{margin: "2px" }}  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Typography >
			<span style={{paddingLeft: "8px" }} align="left" className={gClasses.patientInfo2}>{d.city+" "}</span>
			<span align="right">
        <EditIcon color="primary" size="small" onClick={() => {editCity(d)}} />
        <CancelIcon color="secondary" size="small" onClick={() => {delCity(d)}} />
			</span>
			</Typography>
			</Box>
		</Grid>
	)}
	</Grid>
	)}

  //console.log(emurName);
	return (
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayPageHeader headerName="City Database" groupName="" tournament=""/>
		<VsButton align="right" name="Add new City" onClick={addCity} />	
		<DisplayAllCity />
		<Drawer anchor="top" variant="temporary" open={isDrawerOpened !== ""}>
		<Box style={PADSTYLE} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
			{(isDrawerOpened === "ADD") &&   
				<ValidatorForm className={gClasses.form} onSubmit={addCitySubmit}>
				<Typography className={gClasses.title}>New Gotra</Typography>
				<br />
				<TextValidator fullWidth required className={gClasses.vgSpacing}
					label="Name of the Gotra" type="text"
					value={emurName}
					onChange={(event) => { setEmurName(event.target.value) }}
					validators={['noSpecialCharacters']}
					errorMessages={['Special characters not permitted']}
				/>
				<ShowResisterStatus/>
				<BlankArea />
				<VsButton align="center" name={"Add"} />
				<ValidComp />  			
				</ValidatorForm>
			}
			{(isDrawerOpened === "EDIT") &&   
				<ValidatorForm className={gClasses.form} onSubmit={editCitySubmit}>
				<Typography className={gClasses.title}>
					{`Edit City ${emurOrigName}`}
				</Typography>
				<VsCheckBox align="left" label="Rename to existing" checked={rename} onClick={() => setRename(!rename)} />
				<br />
				{(rename) &&
          <Grid key="ALLCITY" container >
            {cityArray.map( (d, index) => 
              <Grid align="left" key={"CITYNUM"+index} item xs={12} sm={6} md={2} lg={2} >
                <VsRadio align="left" label={d.city} checked={d.city === emurName} onClick={(event) => setEmurName(d.city) }	/>
              </Grid>
            )}
          </Grid>
        }
				{(!rename) &&
				<TextValidator fullWidth required className={gClasses.vgSpacing}
					label="Name of the City" type="text"
					value={emurName}
					onChange={(event) => { setEmurName(event.target.value) }}
					validators={['noSpecialCharacters']}
					errorMessages={['Special characters not permitted']}
				/>			
				}
				<ShowResisterStatus/>
				<br />
				<VsButton align="center" name={"Update"} />
				<ValidComp />  			
				</ValidatorForm>
			}
		</Box>
		</Drawer>
		</div>
	);
}
 