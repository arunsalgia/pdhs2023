import React from "react";
import axios from "axios";
// react plugin for creating charts

// @material-ui/core
import { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import TimelineIcon from '@material-ui/icons/Timeline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import Update from "@material-ui/icons/Update";

import Accessibility from "@material-ui/icons/Accessibility";

import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import socketIOClient from "socket.io-client";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import globalStyles from "assets/globalStyles";
import { NoGroup, BlankArea } from 'CustomComponents/CustomComponents.js';
import { blue, orange, deepOrange}  from '@material-ui/core/colors';
import { getTsBuildInfoEmitOutputFilePath } from "typescript";

import Modal from 'react-modal';

const CardColor = "#ff9800";
const currencyChar = '₹';

import {setTab, setDisplayPage } from "CustomComponents/CricDreamTabs.js"

/*
const modelStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    marginBottom          : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : '#000000',
    color                 : '#FFFFFF',
    transparent           : false,   
  }
};

const useStyles = makeStyles(styles);

const useDashStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  th: { 
    spacing: 0,
    align: "center",
    padding: "none",
    backgroundColor: '#EEEEEE', 
    color: deepOrange[700], 
    // border: "1px solid black",
    fontWeight: theme.typography.fontWeightBold,
  },
  td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },
  cardContent: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: '#18FFFF',   //deepOrange[500],
    margin: 0,
    padding: "none",
    //height: 20,
  },
  dashTitleWhite: {
    color: theme.palette.getContrastText(CardColor),
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      // color: grayColor[1],
      color: theme.palette.getContrastText(CardColor),
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  dashCategoryWhite: {
    color: theme.palette.getContrastText(CardColor),
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cc0: {
    color: theme.palette.getContrastText(CardColor),
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '14px',
    margin: theme.spacing(0, 0, 0),
    padding: "none",
  },
  cc1: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '14px',
    margin: theme.spacing(0, 0, 0),
    padding: "none",
  },
  cc2: {
    margin: theme.spacing(0, 0, 0),
    fontSize: '12px',
    padding: "none",
    // color: theme.palette.getContrastText(deepOrange[500]),
    // fontWeight: theme.typography.fontWeightBold,
  },
  modalContainer: {
    content: "",
    opacity: 0.8,
    // background: rgb(26, 31, 41) url("your picture") no-repeat fixed top;
    // background-blend-mode: luminosity;
    // also change the blend mode to what suits you, from darken, to other 
    // many options as you deem fit
    // background-size: cover;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // position: absolute;
    // z-index: -1;
    // height: 500px;
  },
  modalTitle: {
    color: blue[700],
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
  modalMessage: {
    //color: blue[700],
    fontSize: theme.typography.pxToRem(14),
    //fontWeight: theme.typography.fontWeightBold,
  },
  modalbutton: {
    margin: theme.spacing(2, 2, 2),
  },
})); 
*/

import { 
	dateString,
	getMemberName,
	getAdminInfo, getAdminRec,
} from "views/functions.js";


const IMAGESIZE = 75;
let first =  true;

export default function Dashboard() {
  const gClasses = globalStyles();
  //const classes = useStyles();
  //const dashClasses = useDashStyles();

  const [countInfo, setCountInfoLocal] = useState({prws: 0, pjym: 0,  humad: 0,  family: 0, application:  0});
	const [loginUserRec, setLoginUserRec] = useState(JSON.parse(sessionStorage.getItem("memberRec")));
	const [applMsg, setApplMsg] = useState("");
	const adminRec = getAdminRec();
	
  useEffect(() => {
		getCount();	
	}, []);

	async function getCount() {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/count/all/${sessionStorage.getItem("mid")}`;
		const resp = await axios.get(myUrl);
		setCountInfoLocal(resp.data);
		//console.log(resp.data.application);
		setApplMsg(resp.data.application + " application" + ((resp.data.application > 1) ? "s" : ""));
	}
	
	function jumpToPrws() {
		setTab(process.env.REACT_APP_PRWS);
	}

	function jumpToPjym() {
		setTab(process.env.REACT_APP_PJYM);
	}

	function jumpToHumad() {
		setTab(process.env.REACT_APP_HUMAD);
	}

	function jumpToFamily() {
		setDisplayPage(process.env.REACT_APP_FAMILY, 0, 0);
	}

	function jumpToApplication() {
		setDisplayPage(process.env.REACT_APP_APPLICATION, 0, 0);
	}

	function jumpToGotra() {
		setDisplayPage(process.env.REACT_APP_GOTRA, 0, 0);
	}
	
	function jumpToCity() {
		setDisplayPage(process.env.REACT_APP_CITY, 0, 0);		
	}
	
	function jumpToAdmin() {
		setDisplayPage(process.env.REACT_APP_ADMIN, 0, 0);
	}
	
	return (
	<div style={{padding: "10px"}} >
      <GridContainer key="db_gc_ub">
        <GridItem key="db_gi_ub1" xs={12} sm={6} md={4} lg={3}>
          <Card key="db_card_ub1" onClick={jumpToPrws} >
            <CardHeader key="db_chdr_ub1" color="warning" stats icon>
              <CardIcon color="warning">
								<img src={process.env.PUBLIC_URL + 'image/PJYM.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 
              </CardIcon>
							<div>
              <button className={gClasses.dashText} >PRWS</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} >{`${countInfo.prws} members`}</h5>
							</div>
            </CardHeader>
            <CardFooter key="db_cftr_ub1" stats>
							<Typography className={gClasses.patientInfo2Blue} >Pratapgarh Rajasthan Welfare Samiti</Typography>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem key="db_gi_ub2" xs={12} sm={6} md={4} lg={3}>
          <Card key="db_card_ub2" onClick={jumpToPjym} >
            <CardHeader key="db_chdr_ub2" color="success" stats icon>
              <CardIcon color="success">
							<img src={process.env.PUBLIC_URL + 'image/PJYM.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 
              </CardIcon>
              <button className={gClasses.dashText} >PJYM</button>
							<h5 color="blue"  className={gClasses.cardTitle} >{`${countInfo.pjym} members`}</h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub2" stats> 
							<Typography className={gClasses.patientInfo2Blue} >Pratapgarh Jain Yuva Manch</Typography>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem key="db_gi_ub3" xs={12} sm={6} md={4} lg={3} >
          <Card key="db_card_ub3" onClick={jumpToHumad} >
            <CardHeader key="db_chdr_ub3" color="info" stats icon>
              <CardIcon color="info">
								<img src={process.env.PUBLIC_URL + 'image/HUMAD.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 
              </CardIcon>
              <button className={gClasses.dashText} >Humad</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} >{`${countInfo.humad} members`}</h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub3" stats>
							<Typography className={gClasses.patientInfo2Blue} >Humad Jain Samaj</Typography>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem key="db_gi_ub4" xs={12} sm={6} md={4} lg={3} >
          <Card key="db_card_ub4" onClick={jumpToFamily} >
            <CardHeader key="db_chdr_ub4" color="info" stats icon>
              <CardIcon color="info">
							{/*<SportsHandballIcon />*/}
							<img src={process.env.PUBLIC_URL + 'image/FAMILY.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
              <button className={gClasses.dashText} >Family</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} >{`${countInfo.family} family members`}</h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub4" stats>
							<Typography className={gClasses.patientInfo2Blue} >{`Family of ${getMemberName(loginUserRec, false, false)}`}</Typography>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem key="db_gi_ub5" xs={12} sm={6} md={4} lg={3} >
          <Card key="db_card_ub5" onClick={jumpToApplication}>
            <CardHeader key="db_chdr_ub5" color="primary" stats icon>
              <CardIcon color="primary">
							<img src={process.env.PUBLIC_URL + 'image/APPLICATION.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
              <button className={gClasses.dashText} >Application</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} >{applMsg}</h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub5" stats>
							<Typography className={gClasses.patientInfo2Blue} >{`Pending applications`}</Typography>
            </CardFooter>
          </Card>
        </GridItem>
				{(adminRec.superAdmin || adminRec.prwsAdmin) &&
        <GridItem key="gotra_item" xs={12} sm={6} md={4} lg={3} >
          <Card key="gotra_card" onClick={jumpToGotra}>
            <CardHeader key="gotra_header" color="warning" stats icon>
              <CardIcon color="warning">
							<img src={process.env.PUBLIC_URL + 'image/GOTRA.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
              <button className={gClasses.dashText} >Gotra</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} ></h5>
            </CardHeader>
            <CardFooter key="gotra_footer" stats>
							<Typography className={gClasses.patientInfo2Blue} >{`Configured Gotras`}</Typography>
            </CardFooter>
          </Card>
        </GridItem>
				}
				{(adminRec.superAdmin || adminRec.prwsAdmin) &&
        <GridItem key="city_item" xs={12} sm={6} md={4} lg={3} >
          <Card key="city_card" onClick={jumpToCity}>
            <CardHeader key="city_header" color="warning" stats icon>
              <CardIcon color="warning">
							<img src={process.env.PUBLIC_URL + 'image/CITY.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
              <button className={gClasses.dashText} >City</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} ></h5>
            </CardHeader>
            <CardFooter key="city_footer" stats>
							<Typography className={gClasses.patientInfo2Blue} >{`Configured Cities`}</Typography>
            </CardFooter>
          </Card>
        </GridItem>
				}
				{(adminRec.superAdmin ) &&
        <GridItem key="admin_item" xs={12} sm={6} md={4} lg={3} >
          <Card key="admin_card" onClick={jumpToAdmin}>
            <CardHeader key="admin_header" color="info" stats icon>
              <CardIcon color="info">
							<img src={process.env.PUBLIC_URL + 'image/ADMIN.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
             <button className={gClasses.dashText} >Admins</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} ></h5>
            </CardHeader>
            <CardFooter key="admin_footer" stats>
							<Typography className={gClasses.patientInfo2Blue} >{`Configured Admins`}</Typography>
            </CardFooter>
          </Card>
        </GridItem>
				}
      </GridContainer>  
		</div>
);		
}
