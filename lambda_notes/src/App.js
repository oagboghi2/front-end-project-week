import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';

import NoteList from './container/components/NoteList.js';
import CreateNote from './container/components/CreateNote.js';
import SingleNote from './container/func/SingleNote.js';

import './App.css';
import './container/component.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      notesList: [],
      note: {},
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:5000/api/get/')
    .then(response => {
      console.log(response)
      this.setState({ notesList : response.data.note })
    })
    .catch(err => {
      console.log("errorMessage : ", err)
    })
  }

  fetchData = (dataFromChild) => {
    console.log("fetchData", dataFromChild);
    this.setState({
      notesList: dataFromChild
    });
  }

  filterNotes = (props) => {
    console.log("Int_prop", props)
    const newArr = this.state.notesList.filter(note => {
      return note.title === props.match.params.title
    })
    return newArr[0];
  }

  deleteNotes = (id) => {
    const newIds = this.state.notesList.filter(note => {
      return note.id !== id
    })
    this.setState({ notesList: newIds })
  }

  editNotes = (title, updNote) => {
    console.log("Int_state", this.state)
    console.log("title", title);
    console.log("updNote", updNote);
    const newNote = this.state.notesList.map((note)=>{
      console.log("note.title", note)
      if(note.title === title){
        return updNote;
      }else{
        return note;
      }
    })
    console.log("editNotes", updNote);
    console.log("state", this.state)
    this.setState({ notesList: newNote})
  }

  render() {
    console.log("NSB", this.props)
    return (
      <React.Fragment >
          <div className="main-container">
            <div className="sidebar">
              <div className="sidebar-div">
              <h1>Lambda Notes</h1>
              <Button className="sidebar-button" ><Link to="/Notes" >View Notes</Link></Button>
              <Button className="sidebar-button" ><Link to="/Create" >+Create Notes</Link></Button>
              </div>
              <Route exact path="/" render={props => <NoteList {...props} NoteData={this.state.notesList} />} />
              <Route exact path="/Notes" render={props => <NoteList {...props} NoteData={this.state.notesList} />} />
            <Route exact path="/Create" render={props => <CreateNote {...props} fetch={this.fetchData} />} />
            <Route path="/Notes/:title" render={props => <SingleNote {...props} NoteData={this.filterNotes(props)} DeleteData={this.deleteNotes} />} />
            <Route path="/Create/edit/:title" render={props => <CreateNote {...props} NoteData={this.state.notesList} EditData={this.editNotes} fetch={this.fetchData} />} />
            </div>
          </div>
      </React.Fragment>
    )
  }
}

export default App;
