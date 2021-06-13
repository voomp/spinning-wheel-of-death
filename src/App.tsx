import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Main from './components/Main';
import GoogleLogin from 'react-google-login';
import { getClassList, getStudentList } from './data/GoogleAPI';
import { ClassListContext, SelectedClassContext, SelectedClassStudentsContext } from './data/Store';
import clientIDJSON from './data/clientID.json';

const clientID = clientIDJSON.clientID;

const App: React.FC = () => {

	const [selectedClass, setSelectedClass] = useContext(SelectedClassContext);
	const [, setSelectedClassStudents] = useContext(SelectedClassStudentsContext);
	const [, setClassList] = useContext(ClassListContext);
	const [loggedIn, boolLoggedIn] = useState(null);

	const onGoogleSuccess = async (res) => {
		console.log(res);

		const accessToken = res.tokenObj.access_token;

		getClassList(accessToken, async (classListData) => {
			if(classListData[0]) setSelectedClass(classListData[0]);
			setClassList(classListData);
		});

		boolLoggedIn(res.tokenObj.access_token);
	}

	useEffect(() => {
		if(loggedIn) {
			getStudentList(selectedClass.id, loggedIn, async (studentListData) => {
				setSelectedClassStudents(studentListData);
			});

			if(!localStorage.getItem(selectedClass.id)) {
				localStorage.setItem(selectedClass.id, '[]');
			}
		}
	}, [selectedClass]);

	return (
		<>
			<div id="navbar">
			</div>
			{!loggedIn && 
				<GoogleLogin 
					clientId={clientID}
					buttonText="Login"
					onSuccess={onGoogleSuccess}
					cookiePolicy="single_host_origin"
					scope="openid https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly"
					isSignedIn={true}
				/>
			}
			
			{loggedIn &&
				<Main />
			}
		</>
	);
}

export default App;