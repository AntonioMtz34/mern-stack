import React, { Component } from 'react'
import axios from 'axios'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'

export default class NotesList extends Component {
    state = {
        notes: []
    }

    async componentDidMount() {
        const res = await axios.get('http://localhost:4000/api/notes')
        this.setState({ notes: res.data })
    }

    componentDidMount() {
        this.getNotes()
    }
    async getNotes() {
        const res = await axios.get('http://localhost:4000/api/notes')
        this.setState({ notes: res.data })
    }
    handleDelete = (noteId) => {
    // Mostrar un diálogo de confirmación
    const confirmDelete = window.confirm("¿Are you sure you want to delete this note?");

    // Si el usuario confirma la eliminación, llamar al método deleteNote
    if (confirmDelete) {
        this.deleteNote(noteId);
    }
};

deleteNote = async (noteId) => {
    // Lógica para eliminar la nota
    try {
        await axios.delete(`http://localhost:4000/api/notes/${noteId}`);
        this.getNotes();
        // Actualizar el estado o realizar cualquier otra acción necesaria después de la eliminación
    } catch (error) {
        // Manejar cualquier error que ocurra durante la eliminación
        console.error("Error deleting note:", error);
    }
};

    render() {
        return (
            <div className="row">
                {
                    this.state.notes.map(note => (
                        <div className="col-md-4 mt-4 p-2" key={note._id}>
                            <div className="card">
                                <div className="card-header d-flex justify-content-between">
                                    <h5>Titulo: {note.title}</h5>
                                    <Link className="btn btn-secondary" to={"/edit/" + note._id}>
                                        Edit
                                    </Link>
                                </div>
                                <div className="card-body">
                                    <p>Contenido: {note.content}</p>
                                    <p>Usuario: {note.author}</p>
                                    <p>Fecha: {format(note.date)}</p>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button 
                                    className="btn btn-danger" 
                                    onClick={() => this.handleDelete(note._id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))
                }
            </div>
        )
    }
}
