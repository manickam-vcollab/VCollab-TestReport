import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme)=>({
    label:{
        fontSize:'14px',
        fontWeight:600,
        color:'rgba(0, 0, 0, 0.88)'
    },
    placeHolder:{
        fontSize:'14px',
        fontWeight:400,
        color:'rgba(0, 0, 0, 0.88)'

    },
    sucessMsg:{
        fontSize:'14px',
        fontWeight:400,
        color:'rgba(0, 0, 255, 0.88)'

    },
    errorMsg:{
        fontSize:'14px',
        fontWeight:400,
        color:'rgba(255, 0, 0, 0.88)'
    },
    action:{
        fontSize:'14px',
        fontWeight:400
    }
}))