import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Main from './components/Main';
import GoogleLogin from 'react-google-login';
import { getSegments, getClassList, getStudentList } from './data/GoogleAPI';
import { SelectedClassContext, SelectedClassStudentsContext } from './data/Store';
import clientIDJSON from './data/clientID.json';

const clientID = clientIDJSON.clientID;

const App: React.FC = () => {

	const [, setSelectedClass] = useContext(SelectedClassContext);
	const [, setSelectedClassStudents] = useContext(SelectedClassStudentsContext);

	const [segments, setSegments] = useState<string[]>([]);
	const [loggedIn, boolLoggedIn] = useState(false);

	const onGoogleSuccess = async (res) => {
		console.log(res);

		const accessToken = res.tokenObj.access_token;

		getClassList(accessToken, async (classListData) => {
			// if(classListData[0]) setSelectedClass(classListData[0]);
			if(classListData[1]) { 
				setSelectedClass(classListData[1]);
				// getStudentList(classListData[1].id, accessToken, async (studentListData) => setSelectedClassStudents(studentListData));
			}
		});

		getSegments(accessToken, async (currSegments) => setSegments(currSegments));
		// setSegments(['Student 1', 'Student 2', 'Student 3']);

		boolLoggedIn(true);
	}

	useEffect(() => {}, [segments]);

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
				<Main segments={segments} />
			}
		</>
	);
}

export default App;