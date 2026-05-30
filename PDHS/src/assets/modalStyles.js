import { ThemeProvider } from "@material-ui/styles";

/*
const modalStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      marginBottom          : '-50%',
      transform             : 'translate(-50%, -50%)',
      background            : '#18FFFF',        //'#E0E0E0',
      //color                 : '#FFFFFF',
      transparent           : false,  
			width: '75%',			
    }
  };
  
	
	borderColor="black" borderRadius={7} border={3}

*/

const modalStyles = {
    content : {
      top                   : '20%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '20%',
			//marginLeft            : '30%',
      marginBottom          : '-50%',
      transform             : 'translate(-50%, -50%)',
      //background            : '#18FFFF',        //'#E0E0E0',
      //color                 : '#FFFFFF',
      transparent           : false,  
			//width: '75%',	
			//borderColor						: "black",
			borderRadius					: '7%',	
			border								: '3px solid black',
    }
  };
  
  export default modalStyles;
