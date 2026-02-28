import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, InputAdornment } from "@material-ui/core";

import axios from 'axios';
import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsRadio from "CustomComponents/VsRadio";


//import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
//import { useAlert } from 'react-alert'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import lodashSortBy from 'lodash/sortBy';

// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

// styles
import globalStyles from "assets/globalStyles";


import {DisplayPageHeader, ValidComp, BlankArea,
	DisplayApplicationName
} from "CustomComponents/CustomComponents.js"


import { 
	vsDialog,
	getAdminInfo, getAdminRec,
	showError, showSuccess, showInfo,
} from "views/functions.js";

import {
  PADSTYLE,
} from "views/globals.js";


export default function State() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
  const [stateArray, setStateArray] = useState([]);	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [rename, setRename] = useState(false);
	
	const [editStateRec, seteditStateRec] = useState(null);
	
	const [emurName, setEmurName] = useState("");
	const [emurOrigName, setEmurOrigName] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);

   var tmp = getAdminRec();
   const hasEditPerm = tmp.superAdmin || tmp.superduper;

	
  useEffect(() => {		
		getAllState();
  }, []);

	async  function getAllState() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/state/list`;
			let resp = await axios.get(myUrl);
			setStateArray(resp.data);
		} catch (e) {
			setStateArray([]);
		}	
	}
		
	function ShowResisterStatus() {
		let myMsg = "";
		switch (registerStatus) {
			case 0:  myMsg = ""; break;
			case 1001: myMsg = "Blank State name"; break;
			case 1002: myMsg = "Duplicate State name"; break;
			case 1004: myMsg = "State not selected from existing list."; break;
			default:  myMsg = "Unknown error"; break;
		}
		return (
		<div>
			<Typography className={(registerStatus != 0) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
		</div>
		);
	}
	

	function addState() {
		setRegisterStatus(0); 
		setEmurName("")
		setIsDrawerOpened("ADD");  
	}
	
	function editState(stateRec) {
		setRegisterStatus(0);
		setRename(false);
		setEmurName(stateRec.state); 
		setEmurOrigName(stateRec.state);
		seteditStateRec(stateRec);
    //console.log(stateRec.state);
		setIsDrawerOpened("EDIT");  
	}
	
	async function  addStateSubmit()  {
		let newName = emurName.trim().toLowerCase();
		if (newName.length === 0) return  setRegisterStatus(1001);	
		// for blank and duplicate
		if (stateArray.find(x => x.state.toLowerCase() === newName)) return setRegisterStatus(1002);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/state/add/${newName}`;
			let resp = await axios.get(myUrl);
			//showSuccess(`Successfully added state ${resp.data.state} to database.`);
			let tmpArray = stateArray.concat([resp.data]);
			setStateArray(lodashSortBy(tmpArray, 'state'));
			showSuccess(`Successfully added state ${resp.data.state}`);
		} catch (e) {
			console.log(e);
			showError("Error adding new state to database");
		}
		setIsDrawerOpened("");
	};
  
		
	async function  editStateSubmit()  {
		// check for blank and duplicate (if not rename to existing)
		var newStateName = "";
		if (rename) {
			console.log(editStateRec);
			if (!editStateRec) return setRegisterStatus(1004);
			let tmp =  stateArray.find(x => x.state === editStateRec.state);
			newStateName = tmp.state.toLowerCase();
		} else {
			newStateName = emurName.trim().toLowerCase();
			if (newStateName.length === 0) return setRegisterStatus(1001);
			// if not rename to existing, new name must not be defined
			let tmp =  stateArray.find(x => x.state.toLowerCase() === newStateName);
			if (tmp) return setRegisterStatus(1002);
		}
		setIsDrawerOpened("");
		
		let subcmd = (rename) ? "renametoexisting" : "renametonew"
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/state/${subcmd}/${emurOrigName.toLowerCase()}/${newStateName}`;
			let resp = await axios.get(myUrl);
			// remove the entry of old state name
			let tmpArray = stateArray.filter(x => x.state.toLowerCase() !== emurOrigName.toLowerCase());
			if (subcmd !== "renametoexisting") {
				tmpArray = tmpArray.concat([resp.data]);
			}
			setStateArray(lodashSortBy(tmpArray, 'state'));
			showSuccess(`Successfully renamed state ${emurOrigName} to ${resp.data.state} in database.`);
		} catch (e) {
			console.log(e);
			showError("Error renaming state");
		}
	};
	

	function delCity(stateRec) {
		vsDialog("Delete State", `Are you sure you want to delete state "${stateRec.state}"?`,
		{label: "Yes", onClick: () => handleDelCityConfirm(stateRec) },
		{label: "No" }
		);
	}
	
	async function handleDelCityConfirm(stateRec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/state/delete/${stateRec.name}`;
			let resp = await axios.get(myUrl);
			setStateArray(stateArray.filter(x => x.state !== stateRec.state));
			showSuccess(`Successfully deleted state ${stateRec.state} from database`);
		} catch (e) {
			console.log(e);
			showError(`City ${stateRec.state} is used in members record. Cannot delete`);
		}
	}

	function DisplayAllState() {
	return (
	<Grid key="AllDOCS" container>
	{stateArray.map( (d, index) => 
		<Grid align="left" key={"CITYALL"+index} item xs={12} sm={6} md={3} lg={3} >
			<Box style={{margin: "2px" }}  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Typography >
			<span style={{paddingLeft: "8px" }} align="left" className={gClasses.patientInfo2}>{d.state+" "}</span>
         {(hasEditPerm) &&
			<span align="right">
           <EditIcon color="primary" size="small" onClick={() => {editState(d)}} />
           <DeleteIcon color="primary" size="small" onClick={() => {delCity(d)}} />
			</span>
         }
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
		<DisplayPageHeader headerName="State Database" groupName="" tournament=""/>
		<VsButton align="right" disabled={!hasEditPerm} name="Add new state" onClick={addState} />	
		<DisplayAllState />
		<Drawer anchor="top" variant="temporary" open={isDrawerOpened !== ""}>
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "20px", paddingRight: "20px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		{(isDrawerOpened === "ADD") &&   
			<ValidatorForm className={gClasses.form} onSubmit={addStateSubmit}>
			<Typography className={gClasses.title}>New State</Typography>
			<br />
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				label="Name of the state" type="text"
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
				<ValidatorForm className={gClasses.form} onSubmit={editStateSubmit}>
				<Typography>
					<span className={gClasses.patientInfo2Brown} >Edit City: </span>
					<span className={gClasses.title}>{emurOrigName}</span>
				</Typography>
				<DisplayApplicationName name={`(All member records having state as ${emurOrigName} will get updated with the new value)`} value="" style={{paddingTop: "5px" }}  />
				<VsCheckBox align="left" label="Rename to existing" checked={rename} onClick={() => setRename(!rename)} />
				<br />
				{(false && rename) &&
          <Grid key="ALLCITY" container >
            {stateArray.map( (d, index) => 
              <Grid align="left" key={"CITYNUM"+index} item xs={12} sm={6} md={2} lg={2} >
                <VsRadio align="left" label={d.state} checked={d.state === emurName} onClick={(event) => setEmurName(d.state) }	/>
              </Grid>
            )}
          </Grid>
        }
				{(rename) &&
				<Autocomplete
				disablePortal
				id="HODNAME"
				defaultValue={editStateRec}
				onChange={(event, values) => seteditStateRec(values) }
				style={{paddingTop: "10px" }}
				getOptionLabel={(option) => option.state || ""}
				options={stateArray}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} />}
				/>
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
		<br />
		<br />
		<br />
		<br />
		</Box>
		</Container>
		</Drawer>
		<ToastContainer />
		</div>
	);
}
 