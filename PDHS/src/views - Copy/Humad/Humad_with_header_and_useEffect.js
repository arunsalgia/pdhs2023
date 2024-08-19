import React, { useState, useContext, useEffect, useRef } from 'react';
import {  Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import Tooltip from "react-tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem'; 
import Menu from '@material-ui/core/Menu'; 
import TextField from '@material-ui/core/TextField'; 
import TablePagination from '@material-ui/core/TablePagination';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HumadUpgrade from 'views/Humad/HumadUpgrade';

//import Avatar from '@material-ui/core/Avatar';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";
import loadahUniqBy from "lodash/uniqBy";


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
import IconButton from '@material-ui/core/IconButton';
import MoveUp    from '@material-ui/icons/ArrowUpwardRounded';
import MoveDown  from '@material-ui/icons/ArrowDownwardRounded';
import InfoIcon  from 	'@material-ui/icons/Info';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownCircle from '@material-ui/icons/ArrowDropDownCircle';

import {
	BlankArea, DisplayPageHeader,
	PersonalHeader, PersonalMember,
	DisplaySingleTip,
	DisplayPrwsFilter,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN, APPLICATIONTYPES, SELECTSTYLE, NORMALSELECTSTYLE,
  PADSTYLE,
	HUMADCATEGORY,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	Options_Gender, Options_Marital_Status, Options_Blood_Group,
	READMEMBERINITIAL,
	MOBROWSPERPAGE, NONMOBROWSPERPAGE,	
	PAGELIST,
	STATUS_INFO,
} from "views/globals.js";


import { 
	showError, showSuccess, showInfo,
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

var currentPage = 0;

var menuMember = {};
function setMenuMember(p) { menuMember = p; }



export default function Humad() {
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
	const [memberCount, setMemberCount] = useState(0);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	//const [cityArray, setCityArray] = useState([]);
	// pagination
	const [page, setPage] = useState(0);
	
	// --- start of filter variables
	const	[lastFilter, setLastFilter] = useState("");
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

	//==============

	const [humadArray, setHumadArray] = useState([]);
	const [humadCount, setHumadCount] = useState(0);

	//================

  useEffect(() => {	
		function handleResize() {
			let myDim = getWindowDimensions();
			setWindowDimensions(myDim);
			//console.log(displayType(myDim.width));
			setDispType(displayType(myDim.width));
		}
		
		async function junked_getAllMembers() {
			// first get all cities
			//await getAllCities();
			// now fetch all members
			try {
				var myData = [];
				if (process.env.REACT_APP_PRWS_DB === "true") {
					myData = JSON.parse(localStorage.getItem("prwsMemberList"));
					setMemberMasterArray(myData);
					setMemberArray(myData);
				}
				else if (process.env.REACT_APP_BACKENDFILTER === "true") {
					await getMemeberPage([], 0);
				}
				else {
					let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/list/all`;
					let resp = await axios.get(myUrl);
					var myData = resp.data;					
					setMemberMasterArray(myData);
					setMemberArray(myData);
				}
			} catch (e) {
				console.log("Error fetching member data");
				//setMemberArray([]);		
			}
		}

		async function getAllHumad() {
			if (process.env.REACT_APP_BACKENDFILTER === "true") {
					await getHumadPage([], 0);
			}
			else {
				try {
				//console.log('in humad fetch', chrStr )
					let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/listwithnames`;
					let resp = await axios.get(myUrl);
					
					setHumadArray(resp.data.humad);
					setMemberArray(resp.data.member);
					setMemberMasterArray(resp.data.member);
					
					//setCurrentChar(chrStr);
				} 
				catch (e) {
					console.log(e);
					alert.error(`Error fetching Humad details`);
					setMemberArray([]);
					setHumadArray([]);
				}	
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
		
		if (sessionStorage.getItem("isMember") === "true") {
			getAllCities();
			getAllHumad();
		}
		
		handleResize();
		window.addEventListener('resize', handleResize);
		//return () => window.removeEventListener('resize', handleResize); 
  }, []);


//==========

	function DisplayHumadHeader() {
	return (
		<Box  key={"MEMBOXHDR"} className={gClasses.boxStyleOdd} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} key={"SYMHDR"} container align="center" alignItems="center" >
		<Grid align="left" item md={5} lg={5} >
			<Typography className={gClasses.patientInfo2Brown}>Name</Typography>
		</Grid>
		
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. No.</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Id</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Date</Typography>
		</Grid>
		<Grid align="center" item md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Brown}>Remarks</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
		</Grid>
		</Grid>
		</Box>	
	)};

	async function getHumadPage(filterList, pageNumber)  {
		var myData = encodeURIComponent(JSON.stringify({
			pageNumber: pageNumber,
			pageSize:	ROWSPERPAGE,
			filterData: filterList
		}));

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/filterdata/${myData}`;
			//console.log(myUrl);
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			currentPage = (process.env.REACT_APP_BACKENDFILTER === "true") ? 0 : pageNumber;
			setMemberArray(resp.data.member);
			setMemberMasterArray(resp.data.member);
			setHumadArray(resp.data.humad);
			setHumadCount(resp.data.count);
		} catch (e) {
			console.log("Error fetching filter member data");
			showError(`Error fetching member data of page ${pageNumber}`);
		}
		
	}
	
	function upgradeHumad() {
		handleHumadMenuClose();
		// get Humad record
		let tmpHumadRec = humadArray.find(x => x.mid === menuMember.mid);
		let  myIndex = HUMADCATEGORY.map(e => e.short).indexOf(tmpHumadRec.membershipNumber.substr(0, 1));  //.find(x => x.short === );
		if (myIndex === 0) {
			showInfo(`${getMemberName(menuMember, false, false)} is already ${HUMADCATEGORY[0].desc} (highest upgrade)`);
			return;
		}
		setHumadRec(tmpHumadRec);
		setIsDrawerOpened("Upgrade");
	}


//===================


	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.slice(currentPage*ROWSPERPAGE, (currentPage+1)*ROWSPERPAGE).map( t =>
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

	async function getMemeberPage(filterList, pageNumber, save=true)  {
		//console.log(save);
		var myData = encodeURIComponent(JSON.stringify({
			pageNumber: pageNumber,
			pageSize:	ROWSPERPAGE,
			filterData: filterList
		}));

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/filterdata/${myData}`;
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			if (save) {
				currentPage = (process.env.REACT_APP_BACKENDFILTER === "true") ? 0 : pageNumber;
				setMemberCount(resp.data.count);
				setMemberArray(resp.data.data);
				setMemberMasterArray(resp.data.data);
			} 
			else {
				return (resp.data.data);
			}
		} catch (e) {
			console.log("Error fetching filter member data");
			showError(`Error fetching member data of page ${pageNumber}`);
		}
		
	}
	
	
	function addFilterConfirm(tmpValue) {
		console.log("addFilterConfirm", tmpValue);
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
		if (process.env.REACT_APP_BACKENDFILTER === "true") {
			getMemeberPage(finalFilter, 0);
		}
		else {
			updateMemberArray(finalFilter);
		}
		setPage(0);
	}
	
	function removeFilter(item) {
		let tmp = filterList.filter(x => x.item !== item);
		setFilterList(tmp);	
		updateFilterItems(tmp);
		if (process.env.REACT_APP_BACKENDFILTER === "true") {
			getMemeberPage(tmp, 0);
		}
		else {
			updateMemberArray(tmp);
		}
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
		setDisplayPage(process.env.REACT_APP_FAMILY, tmp.hid, tmp.mid);
	}
	function jumpPjym() {
		handlePrwsContextMenuClose();
		setGrpAnchorEl(null);
		//setTab(process.env.REACT_APP_PJYM);
		console.log("Here");
		showInfo("Membership of PJYM to be implemented");
		console.log("Here again");
	}

	function jumpHumad() {
		handlePrwsContextMenuClose();
		setGrpAnchorEl(null);
		//setTab(process.env.REACT_APP_HUMAD);
		setIsDrawerOpened("HumadUpgrade");
	}
	
	
	function handleHumadUpgradeBack(sts) {
		if (sts.status === STATUS_INFO.ERROR) 
			showError(sts.msg); 
		else if (sts.status === STATUS_INFO.SUCCESS) {
			showSuccess(sts.msg); 
			// update member list
		}
		else if (sts.status === STATUS_INFO.INFO) {
			console.log("In info");
			vsInfo("Applied for ceased", sts.msg,
				{label: "Okay"}
			);
		}
		setIsDrawerOpened("");
	}
	function jumpGotra() {
		handlePrwsContextMenuClose();
		 setGrpAnchorEl(null);
		//setTab(process.env.REACT_APP_GOTRA);
		showError("Membership of PJYM to be implemented");
	}
	
	
	// pagination function 
	const handleChangePage = (event, newPage) => {
		if (process.env.REACT_APP_BACKENDFILTER === "true") {
			getMemeberPage(filterList, newPage);
		}
    setPage(newPage);
  };

	function downloadPrwsData() {
		handlePrwsContextMenuClose();
		setGrpAnchorEl(null);
		vsDialog("Download filtered list", "Are you sure you want to download filtered list?",
				{label: "Yes", onClick: () => downloadPrwsDataConfirm() },
				{label: "No" }
			);		
	}
	
	async function downloadPrwsDataConfirm() {
		
		var myList = await getMemeberPage(filterList, -1, false);
		console.log(myList.length);
		var memData = "Name,Age,Gender,Mobile1,Mobile2,Email1,Email2\n";
		var csvFileName = "prws.csv";
		for (var i=0; i<myList.length; ++i) {
			var m = myList[i];
			var tmp = getMemberName(m) + ",";
			tmp += getAge(m.dob) + ",";
			tmp += capitalizeFirstLetter(m.gender) + ",";
			tmp += m.mobile + ",";
			tmp += m.mobile1 + ",";
			tmp += dispEmail(m.email) + ",";
			tmp += dispEmail(m.email1) + ",";
			tmp += "\n";
			memData += tmp;
	 }
		downloadTextFile(csvFileName, memData);
		showInfo(`Successfully downloaded generated filtered list as csv file ${csvFileName}.`);
 }
 
 const handlePrwsContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
	 e.preventDefault();
	setGrpAnchorEl(e.currentTarget);
	console.log(e.currentTarget);
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
		setMenuMember(tmp);
		var tmpHumadRec = humadArray.find(x => x.mid === radioMid);
		//console.log(tmp);
    var myName = tmp.firstName + " " + tmp.lastName;
		//console.log(contextParams);
		var myStyle={top: `${contextParams.y}px` , left: `${contextParams.x}px` };
		console.log(myStyle);
		console.log(menuRef);
		//anchorEl={grpAnchorEl}
	return(
	<div id="PRWSMENU" ref={menuRef} className='absolute z-20' style={myStyle}>
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
			{getMemberName(tmp, false, false)}
		</Typography>
		<Divider />
		<MenuItem onClick={jumpFamily}>
			<Typography>{"Family"}</Typography>
		</MenuItem>
		<Divider />
		<MenuItem disabled={tmpHumadRec.membershipNumber.substr(0, 1) === HUMADCATEGORY[0].short} onClick={upgradeHumad}>
			<Typography>Upgrade</Typography>
		</MenuItem>
		{/*<Divider />
		<MenuItem onClick={jumpGotra}>
			<Typography>Gotra</Typography>
		</MenuItem>
		<MenuItem onClick={downloadPrwsData}>
			<Typography>Export</Typography>
		</MenuItem>*/}
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
		{/*<MenuItem onClick={downloadPrwsData}>
			<Typography>Export</Typography>
		</MenuItem>*/}
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
	
	/*
	<Typography style={{marginTop: "5px", marginRight: "10px" }} 
				className={gClasses.message16Blue} 
				onClick={downloadPrwsData} >Export</Typography>
	*/
	// If filter at back-end then we have only 1 page data
	currentPage =(process.env.REACT_APP_BACKENDFILTER === "true") ? 0 : page;
	return (
	<div key="PRWS" className={gClasses.webPage} align="center" key="main">
		<DisplayPageHeader headerName={(dispType === "xs") ? "Humad Samaj" : "Humad Samaj"} />
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
		<DisplayHumadHeader dispType={dispType} />
		{/* display members here */}
		{memberArray.slice(currentPage*ROWSPERPAGE, (currentPage+1)*ROWSPERPAGE).map( (m, index) => {
			if (m.ceased) return null;		
			var memberCity = getMyCity(m.hid);
			//console.log(memberCity);
			//console.log(m.email);
			return (
			<PersonalMember key= {"PERSONALMEMBER"+index} m={m} dispType={dispType}  index={index} 
				checked={radioRecord == m.mid}
				datatip={getMemberTip(m, dispType, memberCity) } 
				onClick={(event) => { radioMid = m.mid; handlePrwsContextMenu(event); }}
			/>
			)})}	
		{/* Table pagination here */}
		{((process.env.REACT_APP_BACKENDFILTER !== "true") && (memberArray.length > ROWSPERPAGE)) &&
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
		{((process.env.REACT_APP_BACKENDFILTER === "true") && (memberCount > ROWSPERPAGE)) &&
			<TablePagination
				align="right"
				rowsPerPageOptions={[ROWSPERPAGE]}
				component="div"
				labelRowsPerPage="Members per page"
				count={memberCount}
				rowsPerPage={ROWSPERPAGE}
				page={page}
				onPageChange={handleChangePage}
				//onRowsPerPageChange={handleChangeRowsPerPage}
				//showFirstButton={true}
			/>
		}
		<DisplayAllToolTips />
		{contextParams.show && <PrwsContextMenu /> }
		<Drawer style={{ width: "100%"}} anchor="top" variant="temporary" open={isDrawerOpened != ""} >
		<Container component="main" maxWidth="xs" >	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		{(isDrawerOpened === "HumadUpgrade") &&
			<HumadUpgrade memberRec={menuMember} humadRec={null} onReturn={handleHumadUpgradeBack} />
		}
		</Box>
		</Container>
		</Drawer>
		<ToastContainer />
  </div>
  );    
}
