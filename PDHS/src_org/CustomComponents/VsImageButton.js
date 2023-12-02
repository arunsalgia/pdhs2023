import React from 'react';
import Avatar from "@material-ui/core/Avatar"
import Typography from '@material-ui/core/Typography';
import { getImageName } from "views/functions.js"
//colours 
import {  blue, yellow } from '@material-ui/core/colors';


function disabled() {
	alert("disabled");
}


export default function VsImageButton(props) {
var bSTyle = {padding: "1px 1px", margin: "1px 1px", color: 'black', borderColor: 'blue', fontSize:'14px', fontWeight: 'bold', borderRadius:7, border: 2};

bSTyle.backgroundColor = (props.color) ? props.color: 'blue';
let handler=disabled;
if (props.disabled) {
	// job done
	bSTyle.backgroundColor = '#424242';
	bSTyle.color = 'black';
} else {
	if (props.onClick)
		handler=props.onClick
}
let myImage=getImageName(props.image);
//console.log(myImage);
let _name = (props.name == null) ? "" : props.name;
let _name1 = (props.name1 == null) ? "" : props.name1;
let _name2 = (props.name2 == null) ? "" : props.name2;
return (
<button align="center" style={bSTyle} onClick={handler} >
<Avatar variant="square" size="small" src={myImage} />
</button>
	)
}

