import React from 'react';
//import Grid from '@material-ui/core/Grid';
//import {  blue, yellow } from '@material-ui/core/colors';
//import {  blue, yellow } from '@material-ui/core/colors';
//import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

//{padding: "5px 10px", margin: "4px 2px", color: 'black', fontSize:'18px', borderRadius:7, border: 2};

const PADDINGVALUE = '2px';
const MARGINVALUE = '2px';
const BTNWIDTH = '36px';
const FONTSIZE = 20;
const PAGES = [
'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

const useStyles = makeStyles((theme) => ({
  label: {
    marginLeft:MARGINVALUE,
	marginRight: MARGINVALUE,
	fontSize: theme.typography.pxToRem(FONTSIZE),
	fontWeight: theme.typography.fontWeightBold,
	paddingLeft: PADDINGVALUE,
	paddingRight: PADDINGVALUE,
	border: 'none',
	backgroundColor: 'white'
  },
  selected: {
	width: BTNWIDTH,
    marginLeft: MARGINVALUE,
	marginRight: MARGINVALUE,
	backgroundColor: 'yellow',
	borderRadius: 7,
	border: 2,
	fontSize: theme.typography.pxToRem(FONTSIZE),
	fontWeight: theme.typography.fontWeightBold,
	paddingLeft: PADDINGVALUE,
	paddingRight: PADDINGVALUE,
	//borderColor: 'black',
	//borderStyle: 'solid',
  },
  normal: {
	width: BTNWIDTH,
    marginLeft:MARGINVALUE,
	marginRight: MARGINVALUE,
	backgroundColor: 'white',
	borderRadius: 7,
	border: 2,
	fontSize: theme.typography.pxToRem(FONTSIZE),
	fontWeight: theme.typography.fontWeightBold,
	//borderColor: 'black',
	//borderStyle: 'solid',
	paddingLeft: PADDINGVALUE,
	paddingRight: PADDINGVALUE,
  },
  blue: {
	width: BTNWIDTH,
    marginLeft: MARGINVALUE,
	marginRight: MARGINVALUE,
	color: 'blue',
	borderRadius: 7,
	border: 2,
	fontSize: theme.typography.pxToRem(FONTSIZE),
	fontWeight: theme.typography.fontWeightBold,
	paddingLeft: 0,	//PADDINGVALUE,
	paddingRight: 0, //PADDINGVALUE,
	borderColor: 'black',
	//borderStyle: 'solid',
  },
}));


export default function VsRolodex(props) {
const classes = useStyles();
return (
<div align="center">
	<button className={classes.label }>{props.label}</button>
{PAGES.map( (p, index) => 
	<button key={"ROL"+p} className={(p === props.current) ? classes.selected : classes.normal }
	onClick={() => props.onClick(p) } >
	{p}
	</button>		
)}
</div>
)
}

