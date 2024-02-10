import React, { useState, useContext, useEffect, useRef  } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField'; 
import { useAlert } from 'react-alert'
import axios from "axios";
import Divider from '@material-ui/core/Divider';
import TablePagination from '@material-ui/core/TablePagination';
import ReactTooltip from "react-tooltip";
import MenuItem from '@material-ui/core/MenuItem'; 
import Menu from '@material-ui/core/Menu'; 


import VsTextSearch from "CustomComponents/VsTextSearch";
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
//import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsRadio from "CustomComponents/VsRadio";
//import { useLoading, Audio } from '@agney/react-loading';
//import Drawer from '@material-ui/core/Drawer';
import VsPdhsFilter from "CustomComponents/VsPdhsFilter";
import VsSelect from "CustomComponents/VsSelect";


import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
//import Stack from '@material-ui/core/Stack';
//import { deepOrange, deepPurple } from '@material-ui/core/colors';

//import Member from "views/Member/Member";

import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import {setTab, setDisplayPage} from "CustomComponents/CricDreamTabs.js"

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";



import InfoIcon   from 	'@material-ui/icons/Info';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CancelIcon from '@material-ui/icons/Cancel';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import {
	BlankArea, DisplayPageHeader,
	DisplayPrwsFilter,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN,
	//DATESTR, MONTHNUMBERSTR,
	ALPHABETSTR,
	APPLICATIONTYPES, SELECTSTYLE, NORMALSELECTSTYLE,
	Options_Gender, Options_Marital_Status, Options_Blood_Group,
	MOBROWSPERPAGE, NONMOBROWSPERPAGE,
	PAGELIST,
} 
from "views/globals.js";

import { 
  displayType, getWindowDimensions,
	isMobile,
	getAdminInfo,
	dateString,
	//vsDialog,
	getMemberName,
	dispAge,
	getMemberTip,
	getHodCityList,
	hasPRWSpermission,
} 
from "views/functions.js";


var menuMember = {};
function setMenuMember(p) { menuMember = p; }


var cityList = ["Mumbai"];
var cityArray = [];

const MasterFilterItems = [
		{item: "FirstName", 					value: "",  	type: "text"},
		{item: "MiddleName", 					value: "", 		type: "text"},
		{item: "LastName", 						value: "",   	type: "text"},
		{item: "Gender",    					value: "", 		type: "text", options: Options_Gender },
		{item: "Marital Status",    	value: "", 		type: "text", options: Options_Marital_Status },
		{item: "Blood Group",    			value: "", 		type: "text", options: Options_Blood_Group },
		{item: "City",    						value: "Mumbai", 		type: "text", options: cityList },
		{item: "Age greater than",    value: 24, 		type: "number", Min: 0, Max: 1000},
		{item: "Age less than",    		value: 24, 		type: "number", Min: 1, Max: 1000},
	];
var inputName="";

const InitialContextParams = {show: false, x: 0, y: 0};

var currentPage = 0;

export default function Pjym() {
	//var memberMasterArray;
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  const [ROWSPERPAGE, setROWSPERPAGE] = useState(NONMOBROWSPERPAGE);

	const adminInfo = getAdminInfo();
	const pjymAdmin = ((adminInfo & (ADMIN.superAdmin | ADMIN.pjymAdmin)) !== 0);
	const gClasses = globalStyles();

	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	
	const [pjymArray, setPjymArray] = useState([]);
	const [memberArray, setMemberArray] = useState([]);
	const [memberMasterArray, setMemberMasterArray] = useState([]);

	const [pjymCount, setPjymCount] = useState(0);
	
	const [currSort, setCurrSort] = useState({dir: "ASC", name: "NAME"});
	const [currentAlphabet, setCurrentAlphabet] = useState("A");
	const [modalRegister, setModalRegister] = useState(0);

	// pagination
	const [page, setPage] = useState(0);	
	//const [currentChar, setCurrentChar] = useState('A');

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
	
  useEffect(() => {	
	
		async function orggetPjymList() {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pjym/listwithnames`;
				let axiosResp = await axios.get(myUrl);
				//console.log(axiosResp.data.pjym);
				setPjymArray(axiosResp.data.pjym);
				//console.log(new Date());
				setMemberMasterArray(axiosResp.data.member);
				setMemberArray(axiosResp.data.member);
				//console.log(new Date());
			} catch (e) {
				console.log(e);
				alert.error(`Error fetching PJYM details`);
			}	
		}

		async function getPjymList() {
			if (process.env.REACT_APP_BACKENDFILTER === "true") {
					await getPjymPage([], 0);
			}
			else {			
				try {
					let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pjym/listwithnames`;
					let axiosResp = await axios.get(myUrl);
					//console.log(axiosResp.data.pjym);
					setPjymArray(axiosResp.data.pjym);
					//console.log(new Date());
					setMemberMasterArray(axiosResp.data.member);
					setMemberArray(axiosResp.data.member);
					//console.log(new Date());
				} 
				catch (e) {
					console.log(e);
					alert.error(`Error fetching PJYM details`);
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

    function handleResize() {
			let myDim = getWindowDimensions();
      setWindowDimensions(myDim);
      var myDispType = displayType(myDim.width);
      //console.log(myDispType);
      setROWSPERPAGE( (myDispType == "xm") ? MOBROWSPERPAGE : NONMOBROWSPERPAGE);
      setDispType(displayType(myDim.width));
		}
		
		let handler = (e) => {
			console.log("In handler");
			if (menuRef.current.contains(e.target)) {
				console.log("Inside");
				setContextParams({show: false});
				console.log(menuRef);		
			}
		}
		
		if (sessionStorage.getItem("isMember") === "true") {
			getPjymList();
			getAllCities();
		}
		
    handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
  }, []);

	function numberToDate(xxx) {
		return new Date(xxx);
	}
	
	async function getPjymPage(filterList, pageNumber)  {
		var myData = encodeURIComponent(JSON.stringify({
			pageNumber: pageNumber,
			pageSize:	ROWSPERPAGE,
			filterData: filterList
		}));

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pjym/filterdata/${myData}`;
			//console.log(myUrl);
			let resp = await axios.get(myUrl);
			//console.log(resp.data.member.length);
			//console.log(resp.data);
			currentPage = (process.env.REACT_APP_BACKENDFILTER === "true") ? 0 : pageNumber;
			setPjymCount(resp.data.count);
			setMemberArray(resp.data.member);
			setMemberMasterArray(resp.data.member);
			setPjymArray(resp.data.pjym);
			//console.log(resp.data.pjym);
		} catch (e) {
			console.log("Error fetching filter member data");
			showError(`Error fetching member data of page ${pageNumber}`);
		}
		
	}
	
	
	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = `Selected Symptom already added`;
        break;
      case 2001:
        myMsg = `Selected Diagnosis already added`;
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }

  
  function displayMember() {
		setDisplayPage(PAGELIST.FAMILY, menuMember.hid, menuMember.mid);
  }
	
	 
	function PjymContextMenu() {
		console.log(contextParams);
		//console.log(menuMember);
		//let family = (menuMember.hid === loginHid);
		let admin = ((adminInfo & (ADMIN.superAdmin | ADMIN.prwsAdmin)) !== 0);
	
		var tmp = memberArray.find(x => x.mid === menuMember.mid);
		if (!tmp) return;		
    let myName = tmp.firstName + " " + tmp.lastName;
		//console.log(contextParams);
		var myStyle={top: `${contextParams.y}px` , left: `${contextParams.x}px` };
		console.log(myStyle);
	return(
	<div ref={menuRef} className='absolute z-20' style={myStyle}>
	<Menu id="pjym-menu" anchorEl={grpAnchorEl}
		anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
		transformOrigin={{ vertical: 'top', horizontal: 'center', }}
		open={contextParams.show} onClose={handlePjymMenuClose}
	>
		<Typography className={gClasses.patientInfo2Blue} style={{paddingLeft: "5px", paddingRight: "5px"}}>{tmp.firstName + " " + tmp.lastName}</Typography>
		<Divider />
		<MenuItem onClick={displayMember}>
			<Typography>Family</Typography>
		</MenuItem>
	</Menu>	
	</div>
	)}
	
	const handlePjymContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		//console.log("In handleMemberPersonalContextMenu");
		e.preventDefault();
		setGrpAnchorEl(e.currentTarget);
		//console.log(e.currentTarget);
		//console.log(radioMid);
		const {pageX, pageY } = e;
		//console.log(pageX, pageY);
		setContextParams({show: true, x: pageX, y: pageY});
	}
	
	 
 function handlePjymMenuClose() { setContextParams({show: false, x: 0, y: 0}); }
 
 	
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
	
	
	function DisplayAllPjym() {
		return (
		<div>
		{memberArray.slice(currentPage*ROWSPERPAGE, (currentPage+1)*ROWSPERPAGE).map( (m, index) => {
			let p = pjymArray.find(x => x.mid === m.mid);
			//console.log("PJYM", p);
			var memberCity = getMyCity(m.hid);
			let myClass = gClasses.patientInfo2;

			return (
			<Box  key={"MEMBOX"+index} className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd } borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container align="center" alignItems="center" >
				<Grid align="left" item xs={8} sm={8} md={6} lg={5} >
					<Typography >
						<span className={gClasses.patientInfo2}>{getMemberName(m) + ((dispType != "xs") ? " ("+dispAge(m.dob, m.gender)+")" : "") }</span>
						<span align="left" data-for={"PJYM"+m.mid} data-tip={getMemberTip(m, dispType, memberCity)} data-iscapture="true" >
							<InfoIcon color="primary" size="small"/>
						</span>
					</Typography>
				</Grid>
				<Grid align="center" item xs={3} sm={3} md={3} lg={2} >
					<Typography className={myClass}>{m.mobile}</Typography>
				</Grid>				
        {((dispType != "xs") && (dispType != "sm") && (dispType != "md"))  &&
          <Grid align="center" item lg={2} >
            <Typography className={myClass}>{m.mid}</Typography>
          </Grid>
        }
        {((dispType != "xs") && (dispType != "sm"))  &&
          <Grid align="center" item md={2} lg={2} >
            <Typography className={myClass}>{(p) ? p.membershipNumber : ""}</Typography>
          </Grid>
        }
        <Grid align="left" item xs={1} sm={1} md={1} lg={1} >
          {/*<VisibilityIcon className={gClasses.blue} size="small" onClick={() => displayMember(p)} />;*/}
					<MoreVertIcon className={gClasses.blue} size="small" onClick={() => { setMenuMember(p); handlePjymContextMenu(event); } } />
        </Grid>
        </Grid>
			</Box>
			)}
		)}	
		{contextParams.show && <PjymContextMenu /> }
		</div>	
		)
	}

	function handleMemberSelect() {
		let tmp1 = firstName.trim().toLowerCase();
		let tmp2 = lastName.trim().toLowerCase();
		let tmp3 = middleName.trim().toLowerCase();
		
		let tmpArray = memberMasterArray;
		if (tmp1 !== "") tmpArray = tmpArray.filter(x => x.firstName.toLowerCase().includes(tmp1));
		if (tmp2 !== "") tmpArray = tmpArray.filter(x => x.lastName.toLowerCase().includes(tmp2));
		if (tmp3 !== "") tmpArray = tmpArray.filter(x => x.middleName.toLowerCase().includes(tmp3));
		
		setPage(0);
		setMemberArray(tmpArray);
	}
	
	// pagination function 
	const handleChangePage = (event, newPage) => {
		if (process.env.REACT_APP_BACKENDFILTER === "true") {
			getPjymPage(filterList, newPage);
		}
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

	function setFilter(fName, mName, lName) {
		//console.log(fName,"-",mName,"-",lName);
		let tmpArray = memberMasterArray;
		if (fName !== "") tmpArray = tmpArray.filter(x => x.firstName.toLowerCase().includes(fName));
		if (mName !== "") tmpArray = tmpArray.filter(x => x.middleName.toLowerCase().includes(mName));
		if (lName !== "") tmpArray = tmpArray.filter(x => x.lastName.toLowerCase().includes(lName));
		
		setPage(0);
		setMemberArray(tmpArray);
	}
	
	function updateFirstName(newName) {
		let tmp = newName.toLowerCase().trim();
		setFirstName(tmp);
		setFilter(tmp, middleName, lastName);
	}

	function updateMiddleName(newName) {
		let tmp = newName.toLowerCase().trim();
		setMiddleName(tmp);
		setFilter(firstName, tmp, lastName);
	}
	
	function updateLastName(newName) {
		let tmp = newName.toLowerCase().trim();
		setLastName(tmp);
		setFilter(firstName, middleName, tmp);
	}
	
	function DisplayAllToolTips() {
	//if (!isMobile()) return null;
	return(
		<div>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( t =>
			<ReactTooltip key={"PJYM"+t.mid} type="info" effect="float" id={"PJYM"+t.mid} multiline={true}/>
		)}
		</div>
	)}	
	
// Functions required for Filter 

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
			//console.log(MasterFilterItems);
			//console.log(tmp);
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
					var xxx = cityArray.filter( x => x.city === fList[i].value);
					xxx = lodashMap(xxx, 'hid');
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
	
	function OrgDisplayPrwsFilter(props) {
		return(
		<Box key="BOXPRWSFILTER"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Grid key="GRIDPRWSFILTER" className={gClasses.noPadding} container>
				<Grid align="left" item xs={10} sm={10} md={11} lg={11} >
					<div>
					{(!props.inputFilterMode) &&
						<Typography style={{paddingLeft: "5px"}}>
						{props.filterList.map( (m, index) => {
							return (
								<span key={"FILTER"+index} style={{marginLeft: "5px", paddingLeft: "5px"}} className={gClasses.filterItem} >
									{m.item}: {m.value}
									<CancelIcon size="small" style={{paddingTop: "8px"}} color="secondary" onClick={() => props.removeFilter(m.item)} />
								</span>
							)
						})}
						</Typography>
					}
					{(props.inputFilterMode) &&
						<div>
							{ (props.inputInfo.options) &&
								<VsSelect 
									inputProps={{className: gClasses.dateTimeNormal}} style={NORMALSELECTSTYLE} 
									label={props.inputName} options={props.inputInfo.options} value={props.inputValue} 
									onChange={props.selectClick} 
								/>				
							}
							{ (!props.inputInfo.options) &&
								<div>
									<TextField id="outlined-required" label={props.inputName}
										value={props.inputValue} type={props.inputInfo.type} autoFocus
										onChange={(event) => { props.setInputValue(event.target.value); }}
									/>
									<VsButton name="Apply"  onClick={props.applyClick} />
									<VsButton name="Cancel" onClick={props.cancelClick } />
								</div>
							}
						</div>
					}
					</div>
				</Grid>
				<Grid align="left" item xs={2} sm={2} md={1} lg={1} >
					<div style={{paddingLeft: "5px", paddingRight: "5px"}} >
					<VsPdhsFilter style={SELECTSTYLE} options={props.balanceFilterList} field="item"
					value={props.lastFilter} onChange={props.pdhsFilter} />			
					</div>
				</Grid>
			</Grid>			
		</Box>
	)};
	
	function DisplayFilter() {
	return (	
		<Box key="BOXPRWSFILTER"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
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
							value={inputValue} type={inputInfo.type} autoFocus
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
		</Box>
		
	)}

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
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	{/*<DisplayPageHeader headerName="PJYM Members" groupName="" tournament=""/>*/}
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
  <DisplayAllPjym />
	{(pjymCount > ROWSPERPAGE) &&
		<TablePagination
			align="right"
			rowsPerPageOptions={[ROWSPERPAGE]}
			component="div"
			labelRowsPerPage="Pjym Members per page"
			count={pjymCount}
			rowsPerPage={ROWSPERPAGE}
			page={page}
			onPageChange={handleChangePage}
			//onRowsPerPageChange={handleChangeRowsPerPage}
			//showFirstButton={true}
		/>
	}
	<DisplayAllToolTips />
  </div>
  );    
}
