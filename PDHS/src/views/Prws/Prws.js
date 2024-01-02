import React, { useState, useContext, useEffect, useRef } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import Tooltip from "react-tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem'; 
import Menu from '@material-ui/core/Menu'; 
import TextField from '@material-ui/core/TextField'; 
import TablePagination from '@material-ui/core/TablePagination';

//import Avatar from '@material-ui/core/Avatar';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";
import loadahUniqBy from "lodash/uniqBy";

//import IconButton from '@material-ui/core/IconButton';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioSa from "CustomComponents/VsRadioSa";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsSelect from "CustomComponents/VsSelect";
import VsPdhsFilter from "CustomComponents/VsPdhsFilter";

//import { useLoading, Audio } from '@agney/react-loading';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import {setTab, setDisplayPage } from "CustomComponents/CricDreamTabs.js"

// styles
import globalStyles from "assets/globalStyles";

//icons
import MoveUp    from '@material-ui/icons/ArrowUpwardRounded';
import MoveDown  from '@material-ui/icons/ArrowDownwardRounded';
import InfoIcon  from 	'@material-ui/icons/Info';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';

import {
	BlankArea, DisplayPageHeader,
	DisplayMemberHeader,
	PersonalHeader, PersonalMember,
	DisplaySingleTip,
	DisplayPrwsFilter,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN, APPLICATIONTYPES, SELECTSTYLE, NORMALSELECTSTYLE,
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	Options_Gender, Options_Marital_Status, Options_Blood_Group,
	READMEMBERINITIAL,
	MOBROWSPERPAGE, NONMOBROWSPERPAGE,	
	PAGELIST,
} from "views/globals.js";


import { 
  displayType, getWindowDimensions,
	decrypt, dispMobile, dispEmail, disableFutureDt,
	isMobile, 
	dateString,
	getImageName,
	vsDialog,
	getMemberName,
	getRelation, dispAge, getAge, capitalizeFirstLetter, getMemberTip,
	downloadTextFile,
	getAdminInfo,
	applicationSuccess,
	getHodCityList,
} from "views/functions.js";


var cityList = ["Mumbai"];
var cityArray = [];


var MasterFilterItems = [
		{item: "FirstName", 					value: "",  		type: "text"},
		{item: "MiddleName", 					value: "", 			type: "text"},
		{item: "LastName", 						value: "",   		type: "text"},
		{item: "Gender",    					value: "", 			type: "text", options: Options_Gender },
		{item: "Marital Status",    	value: "", 			type: "text", options: Options_Marital_Status },
		{item: "Blood Group",    			value: "", 			type: "text", options: Options_Blood_Group },
		{item: "City",    						value: "Mumbai", 		type: "text", options: cityList },
		{item: "Age greater than",    value: 24, 		type: "number", Min: 0, Max: 1000},
		{item: "Age less than",    		value: 24, 		type: "number", Min: 1, Max: 1000},
	];
var inputName="";

const InitialContextParams = {show: false, x: 0, y: 0};



var memberMasterArray = [];  function setMemberMasterArray(data) { memberMasterArray = data; }
var radioMid = -1;
  
export default function Prws() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  const [ROWSPERPAGE, setROWSPERPAGE] = useState(NONMOBROWSPERPAGE);
  
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	//const isMember = true //props.isMember;
	//const adminInfo = getAdminInfo();
		
	const gClasses = globalStyles();
	const alert = useAlert();


	const [radioRecord, setRadioRecord] = useState(0);

	//const [memberMasterArray, setMemberMasterArray] = useState([]);
	const [memberArray, setMemberArray] = useState([]);
	//const [cityArray, setCityArray] = useState([]);
	// pagination
	const [page, setPage] = useState(0);
	
	// --- start of filter variables
	const	[lastFilter, setLastFilter] = useState("None");
	const [inputFilterMode, setInputFilterMode] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [inputInfo, setInputInfo] = useState({});
	const [filterList, setFilterList] = useState([]);
	const [modMasterFilterItems, setModMasterFilterItems] = useState(MasterFilterItems);
	//---  end of filter variables
	
	
	const [contextParams, setContextParams] = useState(InitialContextParams);

	const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
	const grpOpen = Boolean(grpAnchorEl);
	
	let menuRef = useRef();
	
  useEffect(() => {	
		function handleResize() {
			let myDim = getWindowDimensions();
			setWindowDimensions(myDim);
			//console.log(displayType(myDim.width));
			setDispType(displayType(myDim.width));
		}
		
		async function getAllMembers() {
			// first get all cities
			//await getAllCities();
			// now fetch all members
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/list/all`;
				let resp = await axios.get(myUrl);
				var myData = resp.data;
				setMemberMasterArray(myData);
				setMemberArray(myData);
			} catch (e) {
				console.log("Error fetching member data");
				//setMemberArray([]);		
			}
		}
		
		async function getAllCities() {
			// Update in Menu			
			cityArray = await getHodCityList();
			var tmp = MasterFilterItems.find(x => x.item == 'City');
			cityList = lodashMap(cityArray, 'city');
			tmp.options = cityList;
		}
		// use effects start here
		//getDetails();
		
		let handler = (e) => {
			console.log("In handler");
			if (menuRef.current.contains(e.target)) {
				console.log("Inside");
				setContextParams({show: false});
				console.log(menuRef);		
			}
		}
		
		setPage(0);
		getAllCities();
		if (sessionStorage.getItem("isMember") === "true") {
			getAllMembers();
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		//return () => window.removeEventListener('resize', handleResize); 
  }, []);

	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( t =>
		  <DisplaySingleTip key={"MEMBETIP"+t.mid}  id={"MEMBER"+t.mid} />
		)}
		</div>
	)}
	

	function numberToDate(xxx) {
		return new Date(xxx);
	}

	function addFilter(newItem) {
		setLastFilter(newItem);
		var tmp = MasterFilterItems.find(x => x.item === newItem);
		inputName = tmp.item;
		setInputInfo(tmp);
		let tmp1 = "";
		if (tmp.options) 
			tmp1 = "";   //tmp.options[0];
		else {
			tmp = filterList.find(x => x.item == newItem);
			tmp1 = (tmp) ? tmp.value : "";
		}
		setInputValue(tmp1);
		setInputFilterMode(true);
	}

	function addFilterConfirm(tmpValue) {
		//console.log("addFilterConfirm", tmpValue);
		let finalFilter;
		let userSelection = ""
		if (tmpValue.length > 0) 
			userSelection = tmpValue
    else {			
			if (inputValue.length === 0) return;
			userSelection = inputValue;
		}
		//console.log(inputValue);
		let tmp = filterList.find(x => x.item === inputName);
		//console.log(tmp);
		if (tmp) {
			tmp.value = userSelection;
			finalFilter = lodashCloneDe1ep(filterList);
			console.log(finalFilter);
		} 
		else {
			//console.log(inputName, userSelection);
			//console.log(MasterFilterItems[0]);
			tmp = lodashCloneDeep(MasterFilterItems.find(x => x.item === inputName));
			tmp.value = userSelection;
			finalFilter = filterList.concat(tmp);
			//console.log(finalFilter);
			setFilterList(finalFilter);
		}
		setInputFilterMode(false);
		updateFilterItems(finalFilter);
		updateMemberArray(finalFilter);
		setPage(0);
	}
	
	function removeFilter(item) {
		let tmp = filterList.filter(x => x.item !== item);
		setFilterList(tmp);	
		updateFilterItems(tmp);
		updateMemberArray(tmp);
		setPage(0);
	}
	
	function updateFilterItems(fList) {
		let tmp = lodashCloneDeep(MasterFilterItems);
		for(var i=0; i<fList.length; ++i) {
			tmp = tmp.filter(x => x.item !== fList[i].item);
		}
		setModMasterFilterItems(tmp);
		setLastFilter("");
	}
	

	function updateMemberArray(fList) {
		let tmp = lodashCloneDeep(memberMasterArray);
		for(var i=0; i<fList.length; ++i) {
			switch (fList[i].item) {
				case "FirstName": 
					tmp = tmp.filter(x => x.firstName.toUpperCase().includes(fList[i].value.toUpperCase()) );
					break;
				case "MiddleName":
					tmp = tmp.filter(x => x.middleName.toUpperCase().includes(fList[i].value.toUpperCase()) );
					break;
				case "LastName":
					tmp = tmp.filter(x => x.lastName.toUpperCase().includes(fList[i].value.toUpperCase()) );
					break;
				case "Marital Status":
					if (fList[i].value.toUpperCase() === "MARRIED")
						tmp = tmp.filter(x => !x.emsStatus.toUpperCase().includes("UNMARRIED"));
					else
						tmp = tmp.filter(x => x.emsStatus.toUpperCase().includes("UNMARRIED"));
					break;
				case "Gender":
					tmp = tmp.filter(x => x.gender.toUpperCase().startsWith(fList[i].value.toUpperCase()) );
					break;
				case "Blood Group":
					tmp = tmp.filter(x => x.bloodGroup.toUpperCase().includes(fList[i].value.toUpperCase()) );
					break;	
				case "City":
					console.log(fList[i].value);
					var xxx = cityArray.filter( x => x.city === fList[i].value);
					xxx = lodashMap(xxx, 'hid');
					console.log(xxx);
					tmp = tmp.filter(x => xxx.includes(x.hid)  );
					break;	
				case "Age greater than":
				case "Age less than":
					// calculate dot based on age criteria
					var d = new Date();
					d.setFullYear(d.getFullYear() - fList[i].value);
					// exclude all mebers whose dob is not available
					tmp = tmp.filter(x => numberToDate(x.dob).getFullYear() != 1900 );
					// now do the comparision
					if (fList[i].item === "Age greater than")
						tmp = tmp.filter( x => numberToDate(x.dob).getTime() <= d.getTime() );
					else
						tmp = tmp.filter( x => numberToDate(x.dob).getTime() >= d.getTime() );
					break;
			}
		}
		setMemberArray(tmp);
	}
	
	function jumpFamily() {
		 handlePrwsContextMenuClose();
		 setGrpAnchorEl(null);
		if (radioMid <= 0) return;
		var tmp = memberMasterArray.find( x => x.mid === radioMid);
		console.log("Mem info", tmp.hid, tmp.mid);
		//sessionStorage.setItem("memberHid", tmp.hid);
		//sessionStorage.setItem("memberMid", tmp.mid);
		//setTab(process.env.REACT_APP_MEMBER);
		setDisplayPage(PAGELIST.FAMILY, tmp.hid, tmp.mid);
	}
	function jumpPjym() {
		handlePrwsContextMenuClose();
		 setGrpAnchorEl(null);
		setTab(process.env.REACT_APP_PJYM);
	}
	function jumpHumad() {
		handlePrwsContextMenuClose();
		 setGrpAnchorEl(null);
		setTab(process.env.REACT_APP_HUMAD);
	}
	function jumpGotra() {
		handlePrwsContextMenuClose();
		 setGrpAnchorEl(null);
		setTab(process.env.REACT_APP_GOTRA);
	}
	
	
	// pagination function 
	const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

	function downloadPrwsData() {
	handlePrwsContextMenuClose();
	 setGrpAnchorEl(null);
	 var memData = "Name,Age,Gender,Mobile1,Mobile2,Email1,Email2\n";
	 var tmp = ""
	 for (var i=0; i<memberArray.length; ++i) {
			var m = memberArray[i];
			tmp = getMemberName(m) + ",";
			tmp += getAge(m.dob) + ",";
			tmp += capitalizeFirstLetter(m.gender) + ",";
			tmp += m.mobile + ",";
			tmp += m.mobile1 + ",";
			tmp += dispEmail(m.email) + ",";
			tmp += dispEmail(m.email1) + ",";
			tmp += "\n";
			memData += tmp;
	 }
	 downloadTextFile("prws.csv", memData);
	 /*
   const element = document.createElement("a");
   const file = new Blob([memData], {type: 'text/plain;charset=utf-8'});
   element.href = URL.createObjectURL(file);
   element.download = "prws.csv";
   document.body.appendChild(element);
   element.click();
	 */
 }
 
 const handlePrwsContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
	 e.preventDefault();
	setGrpAnchorEl(e.currentTarget);
	//console.log(e.currentTarget);
	 //console.log(radioMid);
	 const {pageX, pageY } = e;
	 //setAnchorEl(event.currentTarget);
	 setContextParams({show: true, x: pageX, y: pageY});
 }
 
 function handlePrwsContextMenuClose() { setContextParams({show: false, x: 0, y: 0}); }
 
 function handleMenu() { handlePrwsContextMenuClose(); console.log("In menu"); }
 
 
	function PrwsContextMenu() {
	//console.log(radioMid);
		var tmp = memberMasterArray.find(x => x.mid === radioMid);
		//console.log(tmp);
    var myName = tmp.firstName + " " + tmp.lastName;
		//console.log(contextParams);
		var myStyle={top: `${contextParams.y}px` , left: `${contextParams.x}px` };
		console.log(myStyle);
		//console.log(grpAnchorEl);
		//anchorEl={grpAnchorEl}
	return(
	<div ref={menuRef} className='absolute z-20' style={myStyle}>
	<Menu
		id="prws-menu"
		anchorEl={grpAnchorEl}
		anchorOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		// keepMounted
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		open={contextParams.show}
		onClose={handlePrwsContextMenuClose}
	>
		<Typography className={gClasses.patientInfo2Blue} style={{paddingLeft: "5px", paddingRight: "5px"}}>
			{tmp.lastName + " " + tmp.firstName + " " + tmp.middleName }
		</Typography>
		<Divider />
		<MenuItem onClick={jumpFamily}>
			<Typography>{"Family"}</Typography>
		</MenuItem>
		{/*<MenuItem onClick={jumpPjym}>
			<Typography>Pjym</Typography>
		</MenuItem>
		<MenuItem onClick={jumpHumad}>
			<Typography>Humad</Typography>
		</MenuItem>*/}
		<Divider />
		{/*<MenuItem onClick={jumpGotra}>
			<Typography>Gotra</Typography>
		</MenuItem>*/}
		<MenuItem onClick={downloadPrwsData}>
			<Typography>Export</Typography>
		</MenuItem>
	</Menu>	
	</div>
	)}
	
	 
	function MotWorking_PrwsContextMenu() {
		console.log(contextParams);
		var myStyle={top: contextParams.y+"px" , left: contextParams.x+"px" };
		console.log(myStyle);
		//anchorEl={grpAnchorEl}
	return(
	<div ref={menuRef}  style={myStyle}>
	<Menu
		id="prws-menu"
		open={contextParams.show}
		onClose={handlePrwsContextMenuClose}
	>
		<MenuItem onClick={jumpFamily}>
			<Typography>Family</Typography>
		</MenuItem>
		{/*<MenuItem onClick={jumpPjym}>
			<Typography>Pjym</Typography>
		</MenuItem>
		<MenuItem onClick={jumpHumad}>
			<Typography>Humad</Typography>
		</MenuItem>*/}
		<MenuItem onClick={jumpGotra}>
			<Typography>Gotra</Typography>
		</MenuItem>
		<MenuItem onClick={downloadPrwsData}>
			<Typography>Export</Typography>
		</MenuItem>
	</Menu>	
	</div>
	)}
	
	function getMyCity(hid) {
		var myCity = "";
		for(var i=0; i<cityArray.length; ++i) {
			//console.log(cityArray[i]);
			if (cityArray[i].hidList.includes(hid)) {
				myCity = cityArray[i].city;
				break;
			}
		}
		return myCity;
	}
	
	if (sessionStorage.getItem("isMember") === "false") 
	return (
	<div key="PRWS" className={gClasses.webPage} align="center" key="main">
		<br />
		<br />
		<Typography className={gClasses.message18Blue}>No permission to Guest to view Member information</Typography>
		<br />
		<br />
	</div>
	);
	
	
	// return work here ***********************
	return (
	<div key="PRWS" className={gClasses.webPage} align="center" key="main">
		{/*<DisplayPersonalButtons />*/}
		{/*<DisplayPageHeader headerName="Prws Members" groupName="" tournament=""/>*/}
		<DisplayPrwsFilter 
			inputFilterMode={inputFilterMode} 
			inputName={inputName}
			inputInfo={inputInfo}
			inputValue={inputValue}
			selectClick={(event) => { setInputValue(event.target.value); addFilterConfirm(event.target.value); }}
			setInputValue={setInputValue}
			filterList={filterList}
			balanceFilterList={modMasterFilterItems}
			lastFilter={lastFilter}
			removeFilter={removeFilter}
			pdhsFilter={(event) => { addFilter(event.target.value); }}
			applyClick={() => { addFilterConfirm(""); } }
			cancelClick={() => { setInputFilterMode(false); setLastFilter(""); } }
		/>

		{/*<Box key="BOXPRWSFILTER"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Grid key="PRWSFILTER" className={gClasses.noPadding} container>
				<Grid align="left" item xs={10} sm={10} md={11} lg={11} >
					<div>
					{(!inputFilterMode) &&
						<Typography style={{paddingLeft: "5px"}}>
						{filterList.map( (m, index) => {
							return (
								<span key={"FILTER"+index} style={{marginLeft: "5px", paddingLeft: "5px"}} className={gClasses.filterItem} >
									{m.item}: {m.value}
									<CancelIcon size="small" style={{paddingTop: "8px"}} color="secondary" onClick={() => removeFilter(m.item) } />
								</span>
							)
						})}
						</Typography>
					}
					{(inputFilterMode) &&
						<div>
							{ (inputInfo.options) &&
								<VsSelect 
									inputProps={{className: gClasses.dateTimeNormal}} style={NORMALSELECTSTYLE} 
									label={inputName} options={inputInfo.options} value={inputValue} 
									onChange={(event) => { setInputValue(event.target.value); addFilterConfirm(event.target.value); }} 
								/>				
							}
							{ (!inputInfo.options) &&
								<div>
									<TextField id="outlined-required" label={inputName}
										value={inputValue} type={inputInfo.type}
										onChange={(event) => { setInputValue(event.target.value); }}
									/>
									<VsButton name="Apply"  onClick={() => { addFilterConfirm(""); } } />
									<VsButton name="Cancel" onClick={() => { setInputFilterMode(false); setLastFilter(""); }  } />
								</div>
							}
						</div>
					}
					</div>
				</Grid>
				<Grid align="left" item xs={2} sm={2} md={1} lg={1} >
					<div style={{paddingLeft: "5px", paddingRight: "5px"}} >
					<VsPdhsFilter style={SELECTSTYLE} options={modMasterFilterItems} field="item"
					value={lastFilter} onChange={(event) => { addFilter(event.target.value); }} />			
					</div>
				</Grid>
			</Grid>			
</Box>*/}
		<PersonalHeader dispType={dispType} />
		{/* display members here */}
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( (m, index) => {
			if (m.ceased) return null;		
			//var cityRec = cityArray.find( x => x.hid === m.hid ); // get City record
			var memberCity = getMyCity(m.hid);
			//console.log(memberCity);
			return (
			<PersonalMember key= {"PERSONALMEMBER"+index} m={m} dispType={dispType}  index={index} 
				checked={radioRecord == m.mid}
				datatip={getMemberTip(m, dispType, memberCity) } 
				onClick={(event) => { radioMid = m.mid; handlePrwsContextMenu(event); }}
			/>
			)})}	
		{/* Table pagination here */}
		{(memberArray.length > ROWSPERPAGE) &&
			<TablePagination
				align="right"
				rowsPerPageOptions={[ROWSPERPAGE]}
				component="div"
				labelRowsPerPage="Members per page"
				count={memberArray.length}
				rowsPerPage={ROWSPERPAGE}
				page={page}
				onPageChange={handleChangePage}
				//onRowsPerPageChange={handleChangeRowsPerPage}
				//showFirstButton={true}
			/>
		}
		<DisplayAllToolTips />
		{contextParams.show && <PrwsContextMenu /> }
  </div>
  );    
}
