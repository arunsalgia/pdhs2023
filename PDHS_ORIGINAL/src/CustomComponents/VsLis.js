import React from 'react';
import Box from '@material-ui/core/Box';
//import Typography from '@material-ui/core/Typography';
// icons
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';



//colours 
//import {  blue, yellow } from '@material-ui/core/colors';


function dummy() {
	//alert("disabled");
}

function arunSelect(x) { console.log("sel", x) };
function arunDelete(x) { console.log("del", x) };
//var liStyle = {padding: "5px 10px", margin: "4px 2px", color: 'black', fontSize:'16px', borderRadius: 7, border: 2};

export default function VsList(props) {
var bStyle = 
{padding: "5px 5px", margin: "2px 2px", 
color: 'blue', 
//backgroundColor: 'lightGrey',
fontSize:'16px', 
foneWeight: 'bold',
borderRadius:7, 
border: 2
};

//let _align = (props.align == null) ? "center" : props.align;
let _select = arunSelect;		//(props.onClick == null) ? dummy : props.onSelect;
let _delete = arunDelete;		//((props.onClick == null) ? dummy : props.onDelete;
return (
	<div align="left">
	{props.listArray.map( (item, index) =>
		<Box key={"LIST"+index} borderColor="black" borderRadius={20} border={1} >
		<span style={bStyle} onClick={() => props.onSelect(item) } >
			{item.name}
		</span>
		<span style={bStyle} onClick={() => props.onDelete(item) }>
			<IconButton color="secondary" size="small" >
				<CancelIcon />
			</IconButton>	
		</span>
		</Box>
	)}	
	</div>
	)
}

