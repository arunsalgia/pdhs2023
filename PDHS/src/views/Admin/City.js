import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, InputAdornment } from "@material-ui/core";
import axios from 'axios';
import { Switch } from '@material-ui/core';

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


export default function City() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
  const [cityArray, setCityArray] = useState([]);	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [rename, setRename] = useState(false);
	
	const [mmr, setMmr] = useState(false);
	
	const [editCityRec, setEditCityRec] = useState(null);
	
	const [emurName, setEmurName] = useState("");
	const [emurOrigName, setEmurOrigName] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);

   var tmp = getAdminRec();
   const hasEditPerm = tmp.superAdmin || tmp.superduper;

	
  useEffect(() => {		
		getAllCity();
  }, []);

	async  function getAllCity() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/city/list`;
			let resp = await axios.get(myUrl);
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
			case 1004: myMsg = "City not selected from existing list."; break;
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
		setMmr(false);
		setIsDrawerOpened("ADD");  
	}
	
	function editCity(cityRec) {
		setRegisterStatus(0);
		setRename(false);
		setMmr(cityRec.mmr);
		setEmurName(cityRec.city); 
		setEmurOrigName(cityRec.city);
		setMmr(cityRec.mmr);
		setEditCityRec(cityRec);
    //console.log(cityRec.city);
		setIsDrawerOpened("EDIT");  
	}
	
	async function  addCitySubmit()  {
		let newName = emurName.trim().toLowerCase();
		if (newName.length === 0) return  setRegisterStatus(1001);	
		// for blank and duplicate
		if (cityArray.find(x => x.city.toLowerCase() === newName)) return setRegisterStatus(1002);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/city/add/${newName}/${mmr}`;
			let resp = await axios.get(myUrl);
			showSuccess(`Successfully added city ${resp.data.city} to database.`);
			let tmpArray = cityArray.concat([resp.data]);
			setCityArray(lodashSortBy(tmpArray, 'city'));
			showSuccess(`Successfully added City ${resp.data.city}`);
		} catch (e) {
			console.log(e);
			showError("Error adding new city to database");
		}
		setIsDrawerOpened("");
	};
  
		
	async function  editCitySubmit()  {
		// check for blank and duplicate (if not rename to existing)
		var newCityName = "";
		if (rename) {
			console.log(editCityRec);
			if (!editCityRec) return setRegisterStatus(1004);
			let tmp =  cityArray.find(x => x.city === editCityRec.city);
			newCityName = tmp.city.toLowerCase();
		} else {
			newCityName = emurName.trim().toLowerCase();
			if (newCityName.length === 0) return setRegisterStatus(1001);
			// if not rename to existing, new name must not be defined
			//let tmp =  cityArray.find(x => x.city.toLowerCase() === newCityName);
			//if (tmp) return setRegisterStatus(1002);
		}
		setIsDrawerOpened("");
		
		let subcmd = (rename) ? "renametoexisting" : "renametonew"
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/city/${subcmd}/${emurOrigName.toLowerCase()}/${newCityName}/${mmr}`;
			//console.log(myUrl);
			let resp = await axios.get(myUrl);
			// remove the entry of old city name
			let tmpArray = cityArray.filter(x => x.city.toLowerCase() !== emurOrigName.toLowerCase());
			if (subcmd !== "renametoexisting") {
				tmpArray = tmpArray.concat([resp.data]);
			}
			setCityArray(lodashSortBy(tmpArray, 'city'));
			showSuccess(`Successfully renamed city ${emurOrigName} to ${resp.data.city} in database.`);
		} catch (e) {
			console.log(e);
			showError("Error renaming city");
		}
	};
	

	function delCity(cityRec) {
		vsDialog("Delete City", `Are you sure you want to delete city "${cityRec.city}"?`,
		{label: "Yes", onClick: () => handleDelCityConfirm(cityRec) },
		{label: "No" }
		);
	}
	
	async function handleDelCityConfirm(cityRec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/city/delete/${cityRec.name}`;
			let resp = await axios.get(myUrl);
			setCityArray(cityArray.filter(x => x.city !== cityRec.city));
			showSuccess(`Successfully deleted city ${cityRec.city} from database`);
		} catch (e) {
			console.log(e);
			showError(`City ${cityRec.city} is used in members record. Cannot delete`);
		}
	}

	function handleMmr() {
		setMmr(!mmr);
	}

	function DisplayAllCity() {
	return (
	<Grid key="AllDOCS" container>
	{cityArray.map( (d, index) => 
		<Grid align="left" key={"CITYALL"+index} item xs={12} sm={6} md={3} lg={3} >
			<Box style={{margin: "2px" }}  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Typography >
			<span style={{paddingLeft: "8px" }} align="left" className={gClasses.patientInfo2}>{d.city+" "+((d.mmr) ? '(MMR)' : '')}</span>
         {(hasEditPerm) &&
         <span align="right">
           <EditIcon color="primary" size="small" onClick={() => {editCity(d)}} />
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
		<DisplayPageHeader headerName="City Database" groupName="" tournament=""/>
		<VsButton align="right" disabled={!hasEditPerm}  name="Add new City" onClick={addCity} />	
		<DisplayAllCity />
		<Drawer anchor="top" variant="temporary" open={isDrawerOpened !== ""}>
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "20px", paddingRight: "20px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		{(isDrawerOpened === "ADD") &&   
			<ValidatorForm className={gClasses.form} onSubmit={addCitySubmit}>
			<Typography className={gClasses.title}>New City</Typography>
			<br />
			<TextValidator fullWidth required className={gClasses.vgSpacing}
				label="Name of the City" type="text"
				value={emurName}
				onChange={(event) => { setEmurName(event.target.value) }}
				validators={['noSpecialCharacters']}
				errorMessages={['Special characters not permitted']}
			/>
			<br />
			<Grid className={gClasses.noPadding} key="MMROPTION" container align="left">
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{marginTop: "10px"  }} className={gClasses.title}>{`Part of MMR`}</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Switch color="primary" checked={mmr} onChange={handleMmr} />
			</Grid>
			</Grid>	
			<ShowResisterStatus/>
			<BlankArea />
			<VsButton align="center" name={"Add"} />
			<ValidComp />  			
			</ValidatorForm>
		}
		{(isDrawerOpened === "EDIT") &&   
				<ValidatorForm className={gClasses.form} onSubmit={editCitySubmit}>
				<Typography>
					<span className={gClasses.patientInfo2Brown} >Edit City: </span>
					<span className={gClasses.title}>{emurOrigName}</span>
				</Typography>
				{/*<DisplayApplicationName name={`(All member records having city as ${emurOrigName} will get updated with the new value)`} value="" style={{paddingTop: "5px" }}  />
				<VsCheckBox align="left" label="Rename to existing" checked={rename} onClick={() => setRename(!rename)} />*/}
				
				{(false && rename) &&
          <Grid key="ALLCITY" container >
            {cityArray.map( (d, index) => 
              <Grid align="left" key={"CITYNUM"+index} item xs={12} sm={6} md={2} lg={2} >
                <VsRadio align="left" label={d.city} checked={d.city === emurName} onClick={(event) => setEmurName(d.city) }	/>
              </Grid>
            )}
          </Grid>
        }
				{(rename) &&
				<Autocomplete
				disablePortal
				id="HODNAME"
				defaultValue={editCityRec}
				onChange={(event, values) => setEditCityRec(values) }
				style={{paddingTop: "10px" }}
				getOptionLabel={(option) => option.city || ""}
				options={cityArray}
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
				<br />
				<Grid className={gClasses.noPadding} key="MMROPTION" container align="left">
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{marginTop: "10px"  }} className={gClasses.title}>{`Part of MMR`}</Typography>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Switch color="primary" checked={mmr} onChange={handleMmr} />
				</Grid>
				</Grid>	
				<br />
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
 