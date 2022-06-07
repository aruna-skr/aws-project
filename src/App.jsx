import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
//import withAuthenticator  from '@aws-amplify/ui-react';
import { v4 as uuid } from 'uuid';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';    
import '@aws-amplify/ui-react/styles.css';
import { listPics } from './graphql/queries';
import { updatePic, createPic } from './graphql/mutations';
import { useState } from 'react';
import { Paper, IconButton, TextField } from '@material-ui/core';
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import PhotoIcon from '@material-ui/icons/Photo';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import PublishIcon from '@material-ui/icons/Publish';
Amplify.configure(awsconfig);


function App() {
  const [pics, setPics] = useState([]);
  const [picState, setPicState] = useState('');

  const [URL, setURL] = useState('');
  const [showAddPic, setShowAddNewPic] = useState(false);

  useEffect(() => {
    fetchPics();
  },[])

  const fetchPics = async () => {
    try {
        const picData = await API.graphql(graphqlOperation(listPics));
        const picList = picData.data.listPics.items;
        console.log('pic list', picList);
        setPics(picList);
    } catch (error) {
        console.log('error on fetching pics', error);
    }
  };

  const togglePic = async idx => {
    if (picState === idx) {
        setPicState('');
        return;
    }
    const picFilePath = pics[idx].filePath;
        try {
            const fileAccessURL = await Storage.get(picFilePath, { expires: 60 });
            console.log('access url', fileAccessURL);
            setPicState(idx);
            setURL(fileAccessURL);
            return;
        } catch (error) {
            console.error('error accessing the file from s3', error);
            setURL('');
            setPicState('');
        }
      };

const addLike = async idx => {
  try {
      const pic = pics[idx];
      pic.like = pic.like + 1;
      delete pic.createdAt;
      delete pic.updatedAt;

      const picData = await API.graphql(graphqlOperation(updatePic, { input: pic }));
      const picList = [...pics];
      picList[idx] = picData.data.updatePic;
      setPics(picList);
  } catch (error) {
      console.log('error on adding Like to pic', error);
  }
};
const delLike = async idx => {
  try {
      const pic = pics[idx];
      pic.like = pic.like - 1;
      delete pic.createdAt;
      delete pic.updatedAt;

      const picData = await API.graphql(graphqlOperation(updatePic, { input: pic }));
      const picList = [...pics];
      picList[idx] = picData.data.updatePic;
      setPics(picList);
  } catch (error) {
      console.log('error on adding Like to pic', error);
  }
};

  return (
    <header className="App">
      <header className="App-header">
      <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <div className="App">
           
          <button onClick={signOut}>Sign out</button><br/>
          <p>Welcome!</p>
        </div>
      )}
    </Authenticator>
    </header>
    <div className="picList">
                {pics.map((pic, idx) => {
                    return (
                        <Paper variant="outlined" elevation={2} key={`pic${idx}`}>
                            <div className="picCard">
                                <IconButton aria-label="photo" onClick={() => togglePic(idx)}>
                                  {picState === idx ? <CloseIcon /> : <PhotoIcon />}
                                </IconButton>
                                <div>
                                    <div className="picTitle">{pic.name}</div>
                                    <div className="picOwner">{pic.owner}</div>
                                </div>
                                <div>
                                  {pic.like}
                                    <IconButton aria-label="like" onClick={() => addLike(idx)}>
                                        <ThumbUpIcon />
                                    </IconButton>
                                    <IconButton aria-label="unlike" onClick={() => delLike(idx)}>
                                        <ThumbDownIcon />
                                    </IconButton>
                                </div>
                                <div className="picDescription">{pic.description}</div>
                            </div>
                            {picState === idx ? (
                                <div className="picDisplay">
                                  <Card>
                                    <CardActionArea>
                                    <div
                                    style={{
                                    display: "flex",
                                    alignItem: "center",
                                    justifyContent: "center",
                                    width:"300",
                                    height:"300"
                                    }}
                                    >
                                    <CardMedia
                                      width="100%"
                                      maxHeight="350"
                                      component="img"
                                      image={URL}
                                    />
                                    </div></CardActionArea> </Card>
                                    
                                </div>
                            ) : null}
                        </Paper>
                    );
                })}
                {showAddPic ? (
                    <AddPic
                        onUpload={() => {
                            setShowAddNewPic(false);
                            fetchPics();
                        }}
                    />
                ) : (
                    <IconButton onClick={() => setShowAddNewPic(true)}>
                        <AddIcon />
                    </IconButton>
                )}


            </div>
            </header> 
  );
}

export default withAuthenticator(App);

const AddPic = ({ onUpload }) => {
    const [picData, setPicData] = useState({});
    const [jpgData, setJpgData] = useState();

    const uploadPic = async () => {
        //Upload the pic
        console.log('picData', picData);
        console.log('jpgData', jpgData);
        const { name, description, owner } = picData;
        console.log(name);
        console.log(description);
        console.log(owner);
        const { key } = await Storage.put(`${uuid()}.jpg`, jpgData, { contentType: 'image/jpg' });

        const createPicInput = {
            id: uuid(),
            name,
            description,
            filePath: key,
            like: 0,
            owner,          
        }
        await API.graphql(graphqlOperation(createPic, { input: createPicInput }));
        onUpload();
    }

    return (
        <div className="newPic">
            <TextField
                label="Title"
                value={picData.name}
                onChange={e => setPicData({ ...picData, name: e.target.value })}
            />
            <TextField
                label="Photographer"
                value={picData.owner}
                onChange={e => setPicData({ ...picData, owner: e.target.value })}
            />
            <TextField
                label="Description"
                value={picData.description}
                onChange={e => setPicData({ ...picData, description: e.target.value })}
            />
            <input type="file" accept="image/jpg" onChange={e => setJpgData(e.target.files[0])} />
            <IconButton onClick={uploadPic}>
                <PublishIcon />
            </IconButton>
        </div>
    );
};

/*    const addLike = async idx => {
        try {
            const pic = pics[idx];
            pic.like = pic.like + 1;
            delete pic.createdAt;
            delete pic.updatedAt;

            const picData = await API.graphql(graphqlOperation(updatePic, { input: pic }));
            const picList = [...pics];
            picList[idx] = picData.data.updatePic;
            setPics(picList);
        } catch (error) {
            console.log('error on adding Like to pic', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <AmplifySignOut />
                <h2>My App Content</h2>
            </header>
            <div className="picList">
                {pics.map((pic, idx) => {
                    return (
                        <Paper variant="outlined" elevation={2} key={`pic${idx}`}>
                            <div className="picCard">
                                <IconButton aria-label="play">
                                    <PlayArrowIcon />
                                </IconButton>
                                <div>
                                    <div className="picTitle">{pic.name}</div>
                                    <div className="picOwner">{pic.owner}</div>
                                </div>
                                <div>
                                    <IconButton aria-label="like" onClick={() => addLike(idx)}>
                                        <FavoriteIcon />
                                    </IconButton>
                                    {pic.like}
                                </div>
                                <div className="picDescription">{pic.description}</div>
                            </div>
                        </Paper>
                    );
                })}
            </div>
        </div>
    );
}

export default withAuthenticator(App);*/