import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Login from "../components/Authentication/Login"
import SignUp from "../components/Authentication/Signup"
import Box from '@mui/material/Box';
import AppName from '../components/AppName';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Home() {

  const navigate=useNavigate();

  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));

    if(userInfo){
      navigate("/chats")
    }
  })

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }} >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Sign Up" {...a11yProps(0)} />
          <Tab label="Login" {...a11yProps(1)} />
         
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      
        <SignUp/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
       
       <Login/>
      </CustomTabPanel>
     
    </Box>
  );
}
