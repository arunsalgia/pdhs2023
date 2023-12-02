import { ThemeProvider } from "@material-ui/styles";


export function dynamicModal(myWidth =  '75%') {
const modalStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      marginBottom          : '-50%',
      transform             : 'translate(-50%, -50%)',
      background            : '#18FFFF				',        //'#E0E0E0',
      //color                 : '#FFFFFF',
      transparent           : false,  
			width									: myWidth,
    }
  };
	return modalStyles;
}

