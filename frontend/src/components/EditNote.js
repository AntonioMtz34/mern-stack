import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';

export default function EditNote() {
    const [state, setState] = useState({
        users: [],
        userSelected: '',
        title: '',
        content:'',
        date: new Date(),
        editing: false,
        _id: ''
    });

    const { id } = useParams(); // Access route parameter
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://localhost:4000/api/users');
            setState(prevState => ({
                ...prevState,
                users: res.data,
                userSelected: res.data[0].username
            }));

            if (id) {
                const noteRes = await axios.get(`http://localhost:4000/api/notes/${id}`);
                setState(prevState => ({
                    ...prevState,
                    title: noteRes.data.title,
                    content: noteRes.data.content,
                    date: new Date(noteRes.data.date),
                    userSelected: noteRes.data.author,
                    editing: true,
                    _id: id
                }));
            }
        };

        fetchData();
    }, [id]);
    const onSubmit = async (e) => {
        e.preventDefault();
        const newNote = {
            title: state.title,
            content: state.content,
            date: state.date,
            author: state.userSelected
        };

        let verification = true
        if (!state.title || state.title.trim() === '') {
            verification = false
            
        }
        if (!state.content|| state.content.trim() === '') {
            verification = false
           
        }
        if(verification){
            if (state.editing) {
                await axios.put(`http://localhost:4000/api/notes/${state._id}`, newNote);
            } else {
                await axios.post('http://localhost:4000/api/notes', newNote);
            }
    
            window.location.href = '/';
        }
    };

    const onInputChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onChangeDate = date => {
        setState(prevState => ({
            ...prevState,
            date
        }));
    };

    return (
        <div className="col-md-6 offset-md-3">
            <div className="card card-body">
                <h4>Edit Note</h4>
                 <div className="card-body">
                    <h5>User: {state.userSelected}</h5>
                </div> 
                <div className="form-group">
                    <label>Title </label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Title" 
                        name="title"
                        onChange={onInputChange}
                        required
                        value={state.title} 
                    />
                </div>
                <div className="form-group">
                    <label>Content </label>
                    <textarea 
                        className="form-control"
                        placeholder="Content"
                        name="content"
                        onChange={onInputChange}
                        required
                        value={state.content}
                    />
                </div>
                <div className="form-group">
                <label>Date: </label>
                    <DatePicker 
                        className="form-control" 
                        selected={state.date}
                        onChange={onChangeDate}
                    />
                </div>

                <form onSubmit={onSubmit}>
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}
